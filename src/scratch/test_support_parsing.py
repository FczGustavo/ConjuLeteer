import sys
import re
from pathlib import Path
import pypdf

sys.stdout.reconfigure(encoding='utf-8')
from import_english_questions import paragraphs_from_text, build_support, repair_extraction
from import_english_preview import GROUPS, clean_group_text, normalise_metadata

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))

# Test CN (group 0, page 12)
cn_group = GROUPS[0]
cn_page_text = reader.pages[11].extract_text()
print("=== CN Page 12 Raw Top ===")
print(cn_page_text[:400])

# Test EFOMM (group 8, page 136)
efomm_group = GROUPS[8]
efomm_page_text = reader.pages[135].extract_text()
print("=== EFOMM Page 136 Raw Top ===")
print(efomm_page_text[:500])

# Find matches on EFOMM page 136
QUESTION_RE = re.compile(r"(?m)^\s*(\d{1,3})\s*\)\s*")
matches = list(QUESTION_RE.finditer(efomm_page_text))
print(f"EFOMM matches found on p136: {[m.group(1) for m in matches]}")
initial = efomm_page_text[:matches[0].start()] if matches else efomm_page_text
print("=== EFOMM Initial ===")
print(initial)
paras = paragraphs_from_text(initial)
print(f"EFOMM paragraphs count: {len(paras)}")
for i, p in enumerate(paras):
    print(f"P{i}: {repr(p)}")
supp = build_support(paras)
print(f"EFOMM build_support result: {supp}")
