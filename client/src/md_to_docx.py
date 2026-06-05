#!/usr/bin/env python
# -*- coding: utf-8 -*-
import subprocess
import os
import glob

desktop = os.path.join(os.path.expanduser('~'), 'Desktop')
md_files = glob.glob(os.path.join(desktop, '*.md'))

print(f'Найдено {len(md_files)} markdown файлов на рабочем столе')

for md_file in md_files:
    docx_file = md_file.replace('.md', '.docx')
    
    if os.path.exists(docx_file):
        print(f'Пропущен (уже существует): {os.path.basename(docx_file)}')
        continue
    
    try:
        subprocess.run(['pandoc', md_file, '-o', docx_file], check=True, capture_output=True)
        print(f'✓ Создан: {os.path.basename(docx_file)}')
    except Exception as e:
        print(f'✗ Ошибка при конвертации {os.path.basename(md_file)}: {e}')

print('\nГотово!')
input('Нажмите Enter для выхода...')
