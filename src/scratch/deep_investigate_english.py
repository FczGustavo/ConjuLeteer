"""Deep investigation of blanks, highlights, images, and metadata."""

import json
import re
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")
PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
DATA_TS = ROOT / "src" / "data" / "englishQuestionBank.ts"
MEDIA_TS = ROOT / "src" / "data" / "englishQuestionMedia.ts"

def load_questions() -> list[dict]:
    content = DATA_TS.read_text(encoding="utf-8")
    match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", content, re.S)
    return json.loads(json.loads(match.group(1)))

def load_media() -> dict[str, list[dict]]:
    content = MEDIA_TS.read_text(encoding="utf-8")
    match = re.search(r"export const ENGLISH_QUESTION_MEDIA\s*:\s*Record<string, QuestionMediaDescriptor\[\]>\s*=\s*(\{.*\});\s*$", content, re.S)
    return json.loads(match.group(1)) if match else {}

def main():
    questions = load_questions()
    media_map = load_media()
    reader = PdfReader(str(PDF_PATH))
    
    print("=== 1. CHECKING ALL BOARDS (BANCAS) ===")
    board_counts = {}
    for q in questions:
        meta = q.get("examMetadata") or {}
        b = meta.get("board", "")
        board_counts[b] = board_counts.get(b, 0) + 1
    
    for b, c in sorted(board_counts.items(), key=lambda x: -x[1]):
        print(f"  {b}: {c}")

    print("\n=== 2. CHECKING MISSING HIGHLIGHTS IN ALL QUESTIONS ===")
    # Look for statements referencing highlights
    highlight_patterns = [
        (re.compile(r"\b(bold|negrito)\b", re.I), "bold"),
        (re.compile(r"\b(underlined|sublinhad\w*|grifad\w*)\b", re.I), "underline"),
        (re.compile(r"\b(italic|itálico)\b", re.I), "italic"),
        (re.compile(r"\b(destacad\w*|highlighted)\b", re.I), "highlight"),
        (re.compile(r"\b(in line\s+\d+|na linha\s+\d+)\b", re.I), "line_ref"),
    ]
    
    for q in questions:
        stmt = q["statement"]
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_text = f"{stmt} {support_text} {options_text}"
        
        for pat, kind in highlight_patterns:
            if pat.search(stmt):
                # check if there is formatting
                has_u = "<u>" in all_text
                has_b = "**" in all_text or "<b>" in all_text
                has_quotes = bool(re.search(r'["“][A-Za-z\s-]{2,40}["”]', stmt))
                # print details if missing markup
                if kind in ("bold", "underline", "highlight") and not (has_u or has_b):
                    p_no = q["provenance"]["questionPage"]
                    print(f"\n[NEEDS HIGHLIGHT AUDIT] {q['id']} (p.{p_no}) kind={kind}:")
                    print(f"  Statement: {stmt[:200]}")
                    if support_text:
                        print(f"  Support: {support_text[:150]}...")
                    print(f"  Options: {[opt['text'] for opt in q['options']]}")

    print("\n=== 3. CHECKING ALL BLANK ISSUES ===")
    for q in questions:
        stmt = q["statement"]
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_text = f"{stmt} {support_text} {options_text}"
        
        # Check for gap keywords
        if re.search(r"\b(blank|gap|lacuna|fill\s+in|complete|preench\w*)\b", stmt, re.I):
            has_blank_symbol = bool(re.search(r"_{2,}|\[[I|V|X|\d]+\]|\.{4,}|(?<!\w)___+(?!\w)", all_text))
            # Also check if it's Roman numeral inside text like (I)
            has_roman_blank = bool(re.search(r"\((?:I|II|III|IV|V)\)|\b(?:I|II|III|IV|V)\b\s*[-–—:]", all_text))
            if not (has_blank_symbol or has_roman_blank):
                p_no = q["provenance"]["questionPage"]
                print(f"\n[POTENTIAL MISSING BLANK] {q['id']} (p.{p_no}):")
                print(f"  Statement: {stmt}")
                if support_text:
                    print(f"  Support: {support_text[:200]}")
                print(f"  Options: {[opt['text'] for opt in q['options']]}")

    print("\n=== 4. CHECKING ATTACHED IMAGES - VITAL VS DECORATIVE ===")
    for qid, media_list in media_map.items():
        q = next((x for x in questions if x["id"] == qid), None)
        if not q: continue
        stmt = q["statement"]
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        for m in media_list:
            alt = m.get("altText", "")
            kind = m.get("kind", "")
            url = m.get("assetUrl", "")
            page = m.get("page", 0)
            
            # Check if statement refers to picture/cartoon/comic/image
            refers_to_image = bool(re.search(r"\b(comic|strip|cartoon|tirinha|tira|charge|quadrinho|figure|picture|image|imagem|anúncio|ad|advertisement|graph|chart|gráfico|map|mapa|painting|pintura|micrografia|foto|photo)\b", stmt, re.I))
            print(f"{qid} (p.{page}): kind={kind} img={url} refers_to_img={refers_to_image}")
            print(f"  Alt: {alt}")
            print(f"  Statement: {stmt[:120]}...")

if __name__ == "__main__":
    main()
