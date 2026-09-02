import sys
import re
import json
from pathlib import Path
from collections import defaultdict
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

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

RANGE_HEADER_RE = re.compile(
    r"Textos?\s+para\s+(?:a|as)?\s*quest(?:[õo]es|[ãa]o|oes)?\s*(\d+)(?:\s*(?:[–—e -]+)\s*(\d+))?",
    re.I
)

def clean_ocr(text: str) -> str:
    for pattern, replacement in OCR_TYPOS:
        text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)
    return text

def parse_support_blocks_with_range(raw_text: str) -> dict | None:
    raw_clean = clean_ocr(raw_text)
    
    # Check for range marker in the raw text
    range_match = RANGE_HEADER_RE.search(raw_clean)
    q_range = None
    if range_match:
        start_q = int(range_match.group(1))
        end_q = int(range_match.group(2) or start_q)
        q_range = (start_q, end_q)
        
    lines = [line.strip() for line in raw_clean.splitlines() if line.strip()]
    filtered_lines = []
    for line in lines:
        is_header = any(re.match(p, line, re.I) for p in HEADER_PATTERNS)
        if is_header:
            continue
        filtered_lines.append(line)
        
    if not filtered_lines:
        return None
        
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
        
    if not sub_blocks:
        return None
        
    if len(sub_blocks) == 1:
        label, b_lines = sub_blocks[0]
        title = None
        source = None
        
        # Check source lines at bottom
        if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or (b_lines[-1].startswith("(") and b_lines[-1].endswith(")"))):
            source = b_lines.pop()
            if len(b_lines) > 1 and SOURCE_RE.search(b_lines[-1]) and not b_lines[-1].endswith("."):
                source = b_lines.pop() + " " + source
        elif len(b_lines) > 2 and (SOURCE_RE.search(b_lines[-2]) and b_lines[-1].endswith(")")):
            source = b_lines.pop(-2) + " " + b_lines.pop(-1)
            
        # Check title at top
        if b_lines and len(b_lines[0]) < 100 and not b_lines[0].endswith((".", ",", ";", ":")) and not bool(SOURCE_RE.search(b_lines[0])):
            title = b_lines.pop(0)
            
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
            
        if not paras:
            return None
        res = {"paragraphs": paras}
        if label:
            res["label"] = label
        if title:
            res["title"] = title
        if source:
            res["source"] = source
        if q_range:
            res["_range"] = q_range
        return res
    else:
        # Multiple extracts (e.g. EXTRACT 1 and EXTRACT 2)
        combined_paras = []
        titles = []
        sources = []
        for label, b_lines in sub_blocks:
            if not b_lines:
                continue
            extract_title = None
            extract_source = None
            if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or (b_lines[-1].startswith("(") and b_lines[-1].endswith(")"))):
                extract_source = b_lines.pop()
            if b_lines and len(b_lines[0]) < 100 and not b_lines[0].endswith((".", ",", ";", ":")):
                extract_title = b_lines.pop(0)
            
            paras = []
            cur_para = []
            for line in b_lines:
                if cur_para:
                    prev = cur_para[-1]
                    if len(prev) < 70 and bool(re.search(r'[.!?]["\'’”)]?$', prev)):
                        paras.append(" ".join(cur_para))
                        cur_para = []
                cur_para.append(line)
            if cur_para:
                paras.append(" ".join(cur_para))
                
            header_prefix = f"[{label}]" if label else ""
            if extract_title:
                header_prefix += f" {extract_title}" if header_prefix else extract_title
            if header_prefix:
                combined_paras.append(header_prefix)
            combined_paras.extend(paras)
            if extract_source:
                combined_paras.append(f"({extract_source.strip('()')})")
                sources.append(extract_source)
            if extract_title:
                titles.append(extract_title)
                
        if not combined_paras:
            return None
        res = {
            "title": " / ".join(titles) if titles else None,
            "paragraphs": combined_paras,
            "source": "; ".join(sources) if sources else None
        }
        if q_range:
            res["_range"] = q_range
        return {k: v for k, v in res.items() if v}

print("Testing parse_support_blocks_with_range on EFOMM p136...")
from import_english_preview import GROUPS
PDF_PATH = Path(r"c:\Users\gusta\Documents\ConjuLetter\lists\Apostila de Inglês (CN, EPCAR, EAM, EsSA, EEAR, EsPCEx, AFA, EFOMM, EN e ITA) - Atualizada.pdf")
reader = pypdf.PdfReader(str(PDF_PATH))
efomm_page_text = reader.pages[135].extract_text()
initial = efomm_page_text[:list(re.finditer(r"(?m)^\s*1\s*\)\s*", efomm_page_text))[0].start()]
supp = parse_support_blocks_with_range(initial)
print(json.dumps(supp, indent=2, ensure_ascii=False))
