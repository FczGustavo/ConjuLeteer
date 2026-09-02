import glob, re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

boards = set()

# 1. 1500 bank
with open('src/data/englishQuestionBank.ts', encoding='utf-8') as f:
    text = f.read()
m = re.search(r'JSON\.parse\("(.*?)"\);?\s*$', text, re.DOTALL)
if m:
    data_str = m.group(1).encode('utf-8').decode('unicode_escape')
    # handle escaped quotes in JSON
    # or let us parse json directly if possible
    pass

# Or simpler: find "board": "..." in raw json string
for p in ['src/data/englishQuestionBank.ts'] + glob.glob('src/data/englishPreview/*.ts'):
    content = open(p, encoding='utf-8').read()
    for b in re.findall(r'\\"board\\":\s*\\"([^\\"]+)\\"', content):
        boards.add(b)
    for b in re.findall(r'"board":\s*"([^"]+)"', content):
        boards.add(b)

print(f"Total distinct boards: {len(boards)}")
for b in sorted(boards):
    print(f"- {b}")
