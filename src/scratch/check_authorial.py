import json
import re
from pathlib import Path

txt = Path('src/data/englishQuestionBank.ts').read_text(encoding='utf-8')

# extract the JSON.parse("...")
m = re.search(r'export const ENGLISH_QUESTION_BANK:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.*?)\);', txt, re.DOTALL)
if m:
    raw_json = json.loads(m.group(1))
    items = json.loads(raw_json)
    print(f"Total parsed in 1500 bank: {len(items)}")
    
    jfs_items = [q for q in items if 'jfs' in (q.get('banca') or '').lower() or 'germano' in (q.get('banca') or '').lower() or (q.get('examMetadata') and (q['examMetadata'].get('board') in ['JFS', 'Germano']))]
    print(f"Total JFS/Germano in 1500 bank: {len(jfs_items)}")
    
    statuses = {}
    for q in jfs_items:
        st = q.get('quality', {}).get('status')
        statuses[st] = statuses.get(st, 0) + 1
    print("JFS/Germano statuses in 1500:", statuses)
    
    # Check if ANY JFS/Germano is NOT quarantined
    unquarantined = [q for q in jfs_items if q.get('quality', {}).get('status') != 'quarantined']
    print(f"Unquarantined JFS/Germano: {len(unquarantined)}")
    for q in unquarantined:
        print("  UNQUARANTINED:", q['id'], q.get('banca'))

# Check preview files
preview_files = list(Path('src/data/englishPreview').glob('*.ts'))
print(f"\nChecking {len(preview_files)} preview files...")
preview_authorial = 0
for pf in preview_files:
    content = pf.read_text(encoding='utf-8')
    # search for JFS or Germano or Jefferson
    matches = re.findall(r'.{0,40}\b(?:germano|jerfeson|jefferson|jfs)\b.{0,40}', content, re.I)
    if matches:
        print(f"Preview matches in {pf.name}: {len(matches)}")
        for match in matches[:5]:
            print(f"   {match.strip()}")
        preview_authorial += len(matches)

print(f"Total authorial occurrences in preview: {preview_authorial}")
