import sys
import re
import json
from pathlib import Path
import pypdf

sys.stdout.reconfigure(encoding='utf-8')
from import_english_preview import GROUPS

PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))

OCR_TYPOS = [
    (r"\bHelpinq\b", "Helping"),
    (r"\bpeopie\b", "people"),
    (r"\bhospitais\b", "hospitals"),
    (r"\borthey\b", "or they"),
    (r"\bAcoording\b", "According"),
    (r"\bNous:\s*Genders\b", "Nouns: Genders"),
    (r"€€€100", "100"),
    (r"€€€", ""),
    (r"\bTsnunami\b", "Tsunami"),
]

HEADER_PATTERNS = [
    r"^\s*Interpreta[çc][ãa]o(?:\s+de\s+Texto)?\s+e\s+Vocabul[áa]rio(?:\s*[-–—]\s*.*)?$",
    r"^\s*(?:Col[ée]gio\s+Naval|EPCAR|EAM|EsSA|EEAr|EEAr\s+BCT|EsPCEx|AFA|EFOMM|Escola\s+Naval|ITA)\s*$",
    r"^\s*Textos?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o|oes)?\s*\d+.*$",
    r"^\s*Instru[çc][õo]es?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o)?\s*\d+.*$",
    r"^\s*Read\s+the\s+(?:following\s+)?(?:text|passage|poem|comic\s+strip|cartoon)(?:\s+below|\s+that\s+follows)?.*$",
    r"^\s*Leia\s+o\s+texto(?:\s+abaixo)?.*$",
]

SOURCE_RE = re.compile(
    r"(?:^\s*\(?(?:Source|Fonte|Adapted\s+from|Dispon[íi]vel|Available|http|www\.)|The\s+Economist|The\s+Actuary|BBC|Reuters|\b(?:19|20)\d{2}\b\s*\)?$)",
    re.I
)

LABEL_RE = re.compile(r"^\s*(EXTRACT\s+\d+|TEXTO?\s+[IVX\d]+|PART\s+[IVX\d]+)\s*$", re.I)

def clean_ocr(text: str) -> str:
    for pattern, replacement in OCR_TYPOS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text

def parse_support_blocks(raw_text: str) -> list[dict]:
    raw_text = clean_ocr(raw_text)
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    
    filtered_lines = []
    for line in lines:
        is_header = any(re.match(p, line, re.I) for p in HEADER_PATTERNS)
        if is_header:
            continue
        filtered_lines.append(line)
        
    if not filtered_lines:
        return []
    
    sub_blocks = []
    current_label = None
    current_lines = []
    
    for line in filtered_lines:
        label_match = LABEL_RE.match(line)
        if label_match:
            if current_lines:
                sub_blocks.append((current_label, current_lines))
                current_lines = []
            current_label = label_match.group(1).upper()
        else:
            current_lines.append(line)
    if current_lines:
        sub_blocks.append((current_label, current_lines))
        
    results = []
    for label, b_lines in sub_blocks:
        if not b_lines:
            continue
        title = None
        source = None
        
        # Check source lines at the bottom (possibly 1 or 2 lines)
        if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or (b_lines[-1].startswith("(") and b_lines[-1].endswith(")"))):
            source = b_lines.pop()
            if len(b_lines) > 1 and SOURCE_RE.search(b_lines[-1]) and not b_lines[-1].endswith("."):
                source = b_lines.pop() + " " + source
        elif len(b_lines) > 2 and (SOURCE_RE.search(b_lines[-2]) and b_lines[-1].endswith(")")):
            source = b_lines.pop(-2) + " " + b_lines.pop(-1)
            
        # Check title at the top
        if b_lines and len(b_lines[0]) < 100 and not b_lines[0].endswith((".", ",", ";", ":")) and not is_source(b_lines[0]):
            title = b_lines.pop(0)
            
        # Group remaining into paragraphs
        paras = []
        cur_para = []
        for line in b_lines:
            if cur_para:
                prev = cur_para[-1]
                is_para_end = (
                    len(prev) < 70 and bool(re.search(r'[.!?]["\'’”)]?$', prev))
                    or bool(re.match(r'^\[\d+\]', line))
                )
                if is_para_end:
                    paras.append(" ".join(cur_para))
                    cur_para = []
            cur_para.append(line)
        if cur_para:
            paras.append(" ".join(cur_para))
            
        res = {"paragraphs": paras}
        if label:
            res["label"] = label
        if title:
            res["title"] = title
        if source:
            res["source"] = source
        results.append(res)
        
    return results

def is_source(line: str) -> bool:
    return bool(SOURCE_RE.search(line))

print("Testing all 11 reading groups...")
for g in GROUPS[:11]:
    start_p = g["start"]
    end_p = g["end"]
    txt = reader.pages[start_p - 1].extract_text()
    q_matches = list(re.finditer(r"(?m)^\s*1\s*\)\s*", txt))
    if q_matches:
        initial = txt[:q_matches[0].start()]
        res = parse_support_blocks(initial)
        print(f"Group: {g['id']} (p{start_p}) -> {len(res)} support block(s) detected. Title: {res[0].get('title') if res else 'None'}, Paras: {len(res[0].get('paragraphs', [])) if res else 0}")
    else:
        print(f"Group: {g['id']} (p{start_p}) -> Q1 match not on first page")
