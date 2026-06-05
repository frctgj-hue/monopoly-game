#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
import os
import sys

def create_word_document(filename, content):
    """Создает Word документ через markdown и pandoc"""
    desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
    
    # Создаем markdown файл
    md_path = os.path.join(desktop, f'{filename}.md')
    docx_path = os.path.join(desktop, f'{filename}.docx')
    
    # Записываем контент
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Конвертируем через pandoc
    try:
        subprocess.run(['pandoc', md_path, '-o', docx_path], 
                      capture_output=True, text=True, check=True)
        
        # Удаляем markdown
        if os.path.exists(docx_path):
            os.remove(md_path)
            return True, docx_path
        else:
            return False, "DOCX not created"
    except Exception as e:
        return False, str(e)

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python create_word_doc.py <filename> <content>")
        sys.exit(1)
    
    filename = sys.argv[1]
    content = sys.argv[2]
    
    success, result = create_word_document(filename, content)
    if success:
        print(f'SUCCESS: {result}')
    else:
        print(f'FAILED: {result}')
