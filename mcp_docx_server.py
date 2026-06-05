#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
MCP Server для создания Word документов через pandoc
"""
import asyncio
import subprocess
import os
from mcp.server import Server
from mcp.types import Tool, TextContent

app = Server("docx-generator")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="create_word_document",
            description="Создает Word документ (.docx) из markdown текста на рабочем столе пользователя",
            inputSchema={
                "type": "object",
                "properties": {
                    "filename": {
                        "type": "string",
                        "description": "Имя файла без расширения (например: 'Документ' или 'Отчет')"
                    },
                    "content": {
                        "type": "string",
                        "description": "Содержимое документа в формате Markdown"
                    }
                },
                "required": ["filename", "content"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "create_word_document":
        filename = arguments["filename"]
        content = arguments["content"]
        
        desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
        md_path = os.path.join(desktop, f'{filename}.md')
        docx_path = os.path.join(desktop, f'{filename}.docx')
        
        try:
            # Создаем markdown файл
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            # Конвертируем через pandoc
            result = subprocess.run(
                ['pandoc', md_path, '-o', docx_path],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Удаляем markdown файл
            if os.path.exists(docx_path):
                os.remove(md_path)
                return [TextContent(
                    type="text",
                    text=f"✓ Word документ успешно создан: {docx_path}"
                )]
            else:
                return [TextContent(
                    type="text",
                    text=f"✗ Ошибка: файл .docx не был создан"
                )]
                
        except subprocess.CalledProcessError as e:
            return [TextContent(
                type="text",
                text=f"✗ Ошибка pandoc: {e.stderr}"
            )]
        except Exception as e:
            # Удаляем markdown если что-то пошло не так
            if os.path.exists(md_path):
                os.remove(md_path)
            return [TextContent(
                type="text",
                text=f"✗ Ошибка: {str(e)}"
            )]
    
    return [TextContent(type="text", text=f"Unknown tool: {name}")]

async def main():
    from mcp.server.stdio import stdio_server
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
