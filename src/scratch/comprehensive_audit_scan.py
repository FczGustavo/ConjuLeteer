"""Comprehensive auditor for all 1,500 English questions."""

from __future__ import annotations

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
    if not match:
        raise ValueError("Could not parse ENGLISH_QUESTION_BANK")
    return json.loads(json.loads(match.group(1)))

def load_media() -> dict[str, list[dict]]:
    content = MEDIA_TS.read_text(encoding="utf-8")
    match = re.search(r"export const ENGLISH_QUESTION_MEDIA\s*:\s*Record<string, QuestionMediaDescriptor\[\]>\s*=\s*(\{.*\});\s*$", content, re.S)
    if not match:
        return {}
    return json.loads(match.group(1))

def audit_all():
    questions = load_questions()
    media_map = load_media()
    
    print(f"Loaded {len(questions)} questions.")
    
    # 1. GABARITO AUDIT
    reader = PdfReader(str(PDF_PATH))
    from import_english_questions import answer_key, TOPICS
    answers, answer_pages = answer_key(reader)
    
    gabarito_divergences = []
    for q in questions:
        key = (q["subjectId"], q["questionNumber"])
        official = answers.get(key)
        if official != q["correctLetter"]:
            gabarito_divergences.append((q["id"], official, q["correctLetter"]))
    print(f"1. Gabarito divergences: {len(gabarito_divergences)}")
    if gabarito_divergences:
        for d in gabarito_divergences[:10]:
            print(f"   Divergence: {d}")

    # 2. METADATA AUDIT (Banca and Year)
    banca_variations = {}
    missing_years = []
    for q in questions:
        meta = q.get("examMetadata") or {}
        board = meta.get("board", q.get("banca", ""))
        year = meta.get("year")
        banca_variations.setdefault(board, []).append(q["id"])
        if meta.get("source") == "pdf-header" and not year:
            missing_years.append((q["id"], board))
    print(f"2. Unique Board names: {len(banca_variations)}")
    print(f"   Missing years in header credits: {len(missing_years)}")
    
    # Check for non-standardized bancas
    print("\n   Sample Board names in metadata:")
    for b in sorted(banca_variations.keys())[:30]:
        print(f"     '{b}': {len(banca_variations[b])} questions")

    # 3. IMAGES AUDIT
    # Check all images in PDF and compare with media_map
    print("\n3. Images Audit:")
    with pdfplumber.open(PDF_PATH) as pdf:
        all_pdf_images = []
        for page_idx, page in enumerate(pdf.pages, 1):
            if page_idx > 189: break
            for img_idx, img in enumerate(page.images):
                all_pdf_images.append({
                    "page": page_idx,
                    "name": img.get("name"),
                    "x0": img.get("x0"), "top": img.get("top"),
                    "width": img.get("width"), "height": img.get("height")
                })
    print(f"   Total images extracted from PDF (pages 1-189): {len(all_pdf_images)}")
    print(f"   Total question IDs with attached media in media_map: {len(media_map)}")
    
    # Check questions mentioning images
    image_keywords = re.compile(r"\b(comic\s+strip|cartoon|picture|image|figure|illustration|tirinha|tira|charge|quadrinho|gráfico|chart|diagram|ad|advertisement|anúncio|below|above|following\s+image)\b", re.I)
    questions_mentioning_image = []
    for q in questions:
        has_media = q["id"] in media_map
        stmt = q.get("statement", "")
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        if image_keywords.search(stmt) or image_keywords.search(support_text):
            questions_mentioning_image.append((q["id"], q["subjectId"], q["questionNumber"], q["provenance"]["questionPage"], has_media, stmt[:120]))
    
    print(f"   Questions mentioning image/cartoon/picture keywords: {len(questions_mentioning_image)}")
    missing_media_in_image_q = [q for q in questions_mentioning_image if not q[4]]
    print(f"   Questions mentioning image but without media attached: {len(missing_media_in_image_q)}")
    for m in missing_media_in_image_q[:15]:
        print(f"     [NO MEDIA] {m[0]} (p. {m[3]}): {m[5]}")

    # Check attached media types (photo vs cartoon vs figure)
    decorative_candidates = []
    for qid, media_list in media_map.items():
        for m in media_list:
            alt = m.get("altText", "")
            kind = m.get("kind", "")
            url = m.get("assetUrl", "")
            # Check if it looks like a generic decorative photo
            if kind == "photo" or "fotografia" in alt.lower() or "imagem de um" in alt.lower() or "micrografia" in alt.lower() or "capa" in alt.lower():
                decorative_candidates.append((qid, url, kind, alt))
    print(f"\n   Potential decorative photos attached ({len(decorative_candidates)} items):")
    for d in decorative_candidates[:20]:
        print(f"     {d[0]}: kind={d[1]} alt='{d[3]}'")

    # 4. BLANKS / LACUNAS AUDIT
    print("\n4. Blanks / Lacunas Audit:")
    blank_keywords = re.compile(r"\b(blank|gap|lacuna|lacunas|fill\s+in|complete|completes|preenche|preenchem|correctly\s+fills|best\s+completes)\b", re.I)
    blank_pattern = re.compile(r"_{2,}|\[[I|V|X|\d]+\]|\.{4,}")
    
    blank_issues = []
    stuck_blank_issues = []
    for q in questions:
        stmt = q.get("statement", "")
        support = q.get("support") or {}
        support_paragraphs = support.get("paragraphs", [])
        support_text = " ".join(support_paragraphs)
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_q_text = f"{stmt} {support_text} {options_text}"
        
        if blank_keywords.search(stmt):
            has_blank = bool(blank_pattern.search(all_q_text))
            if not has_blank:
                blank_issues.append((q["id"], stmt[:140]))
        
        # Check for blanks glued to punctuation or words without proper spacing
        # e.g. "word______punctuation" or "______word"
        glued_match = re.search(r"([A-Za-z0-9À-ÿ])_{2,}|_{2,}([A-Za-z0-9À-ÿ])", all_q_text)
        if glued_match:
            stuck_blank_issues.append((q["id"], glued_match.group(0), stmt[:100]))

    print(f"   Questions mentioning blank/fill-in without any detected blank: {len(blank_issues)}")
    for b in blank_issues[:15]:
        print(f"     [MISSING BLANK?] {b[0]}: {b[1]}")
    print(f"   Questions with glued/stuck blanks: {len(stuck_blank_issues)}")
    for s in stuck_blank_issues[:15]:
        print(f"     [GLUED BLANK] {s[0]} ({s[1]}): {s[2]}")

    # 5. HIGHLIGHTS / DESTAQUES AUDIT
    print("\n5. Highlights / Destaques Audit:")
    highlight_keywords = re.compile(r"\b(the\s+bold\s+word|the\s+word\s+in\s+bold|underlined|destacad[oa]|sublinhad[oa]|grifad[oa]|in\s+bold\s+type|palavra\s+em\s+negrito|termo\s+em\s+negrito)\b", re.I)
    highlight_issues = []
    
    for q in questions:
        stmt = q.get("statement", "")
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_q_text = f"{stmt} {support_text} {options_text}"
        
        if highlight_keywords.search(stmt):
            has_highlight = ("**" in all_q_text) or ("<u>" in all_q_text) or ("<b>" in all_q_text)
            if not has_highlight:
                highlight_issues.append((q["id"], stmt[:140]))
                
    print(f"   Questions mentioning bold/underlined without any detected markup: {len(highlight_issues)}")
    for h in highlight_issues[:20]:
        print(f"     [NO HIGHLIGHT MARKUP] {h[0]}: {h[1]}")

    # 6. SUPPORT TEXT STRUCTURE AUDIT
    print("\n6. Support Text Structure Audit:")
    support_structure_issues = []
    for q in questions:
        support = q.get("support")
        if support:
            paragraphs = support.get("paragraphs", [])
            title = support.get("title", "")
            source = support.get("source", "")
            
            # Check for single giant paragraph > 800 chars
            for p_idx, p in enumerate(paragraphs):
                if len(p) > 1200 and not "\n" in p:
                    support_structure_issues.append((q["id"], f"Paragraph {p_idx+1} is very long ({len(p)} chars) with no internal break", p[:80]))
            
            # Check for title formatting
            if title and re.match(r"^[\"“']", title):
                support_structure_issues.append((q["id"], f"Title has quotes: {title}", ""))

    print(f"   Support structure warnings: {len(support_structure_issues)}")
    for w in support_structure_issues[:15]:
        print(f"     {w[0]}: {w[1]} ({w[2]})")

if __name__ == "__main__":
    audit_all()
