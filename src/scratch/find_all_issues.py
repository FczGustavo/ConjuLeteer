import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"c:\Users\gusta\Documents\ConjuLetter\src\data\questionBank.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if "export const QUESTION_BANK" in line:
        start_idx = i
        break

json_text = "".join(lines[start_idx:]).replace("export const QUESTION_BANK: QuestionBankItem[] = ", "").rstrip(";\n")
questions = json.loads(json_text)

print(f"Total questions in database: {len(questions)}")

# 1. Statements that are still too long (> 280 chars)
long_stmts = []
for q in questions:
    if len(q['statement']) > 280:
        long_stmts.append((q['id'], len(q['statement']), q['statement']))

print(f"Total statements > 280 chars: {len(long_stmts)}")
for q_id, l, stmt in long_stmts[:15]:
    print(f"[{q_id}] ({l} chars):\n  FIRST: {stmt[:120]}...\n  LAST: {stmt[-120:]}\n")

# 2. Check broken words across the entire database
broken_word_matches = []
for q in questions:
    full = q['statement'] + " " + " ".join([o['text'] for o in q['options']])
    if q.get('readingText'):
        full += " " + q['readingText']
        
    # Single letter followed by space and word (e.g. "r elação", "p orvir", "n ovo", "d izer")
    # excluding valid single letters: a, e, o, à, é, ó, u (and punctuation/dashes)
    m1 = re.findall(r'(?<=\s)[bcdfghjklmnpqrstvxyzBCDFGHJKLMNPQRSTVXYZ]\s+[a-záéíóúâêîôûãõç]{2,}', full)
    if m1:
        broken_word_matches.extend([(q['id'], 'prefix_single', m) for m in m1])
        
    # Word followed by space and single letter (e.g. "Afina l", "conforto s", "indivídu o", "Entã o")
    # excluding valid standalone words like "não a", "com o", "para e", etc.
    m2 = re.findall(r'[a-záéíóúâêîôûãõç]{3,}\s+[bcdfghjklmnpqrstvxyz](?=\s|[,.;:!?]|$)', full)
    if m2:
        broken_word_matches.extend([(q['id'], 'suffix_single', m) for m in m2])

print(f"\nTotal broken single-letter word instances found: {len(broken_word_matches)}")
for q_id, kind, val in broken_word_matches[:25]:
    print(f"  [{q_id}] {kind}: '{val}'")
