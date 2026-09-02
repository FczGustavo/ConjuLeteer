import sys
import re
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
    """Given a raw support chunk (from top of section or between questions), extract clean support object(s)."""
    raw_text = clean_ocr(raw_text)
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    
    # Filter out redundant header lines from the top
    filtered_lines = []
    for line in lines:
        is_header = any(re.match(p, line, re.I) for p in HEADER_PATTERNS)
        if is_header:
            continue
        filtered_lines.append(line)
        
    if not filtered_lines:
        return []
    
    # Check for extract/text boundaries (e.g. EXTRACT 1, EXTRACT 2)
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
        
        # Check if last line is source
        if len(b_lines) > 1 and (SOURCE_RE.search(b_lines[-1]) or b_lines[-1].startswith("(") and b_lines[-1].endswith(")")):
            source = b_lines.pop()
        elif len(b_lines) > 2 and (SOURCE_RE.search(b_lines[-2]) and b_lines[-1].endswith(")")):
            source = b_lines.pop(-2) + " " + b_lines.pop(-1)
            
        # Check if first line is title
        if b_lines and len(b_lines[0]) < 100 and not b_lines[0].endswith((".", ",", ";", ":")):
            # It's a title!
            title = b_lines.pop(0)
            
        # Group remaining lines into paragraphs
        paras = []
        cur_para = []
        for line in b_lines:
            if cur_para:
                prev = cur_para[-1]
                # Is prev line a paragraph end? (ends with . ! ? " ” ) and line starts with Capital or [1], [2]
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

# Test on CN Page 12
cn_page_text = reader.pages[11].extract_text()
cn_initial = cn_page_text[:list(re.finditer(r"(?m)^\s*1\s*\)\s*", cn_page_text))[0].start()]
print("=== CN Page 12 Parsed Support ===")
cn_res = parse_support_blocks(cn_initial)
print(cn_res)

# Test on EFOMM Page 136
efomm_page_text = reader.pages[135].extract_text()
efomm_initial = efomm_page_text[:list(re.finditer(r"(?m)^\s*1\s*\)\s*", efomm_page_text))[0].start()]
print("\n=== EFOMM Page 136 Parsed Support ===")
efomm_res = parse_support_blocks(efomm_initial)
for r in efomm_res:
    print(r)
