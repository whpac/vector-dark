import os
import re
import sys

def compactifyFile(file):
    with open(file, 'r+', encoding='utf-8') as f:
        content = f.read()

        # Strip whitespace at the beginning of the individual lines
        content = re.sub(r'^\s+', '', content, flags=re.MULTILINE)

        # Turn the selector content into a single line
        content = re.sub(
            r'^([^@][^{\n]+\{)((?:.*\n)+?)(\})$',
            lambda m: m.group(1) + m.group(2).replace('\n', '') + m.group(3),
            content, flags=re.MULTILINE)

        # Strip whitespace between property and value
        content = re.sub(
            r'([;{])[ \t]*([-a-z]+:)\s*([^;}]+)(?=[;}])',
            r'\1\2\3',
            content, flags=re.MULTILINE)

        f.seek(0)
        f.write(content)
        f.truncate()

def compactifyFileOrDirectory(path):
    if os.path.isdir(path):
        for entry in os.scandir(path):
            compactifyFileOrDirectory(entry.path)
    else:
        compactifyFile(path)
    pass

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python compactify.py <file or directory>')
        sys.exit(1)
    compactifyFileOrDirectory(sys.argv[1])