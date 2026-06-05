import subprocess
import os

home = os.path.expanduser('~')
input_file = os.path.join(home, 'Desktop', 'Конспект_Конституционное_судопроизводство.md')
output_file = os.path.join(home, 'Desktop', 'Конспект_Конституционное_судопроизводство.docx')

result = subprocess.run(['pandoc', input_file, '-o', output_file], capture_output=True, text=True)

if os.path.exists(output_file):
    print(f'SUCCESS: {output_file}')
else:
    print(f'FAILED')
    print(result.stderr)
