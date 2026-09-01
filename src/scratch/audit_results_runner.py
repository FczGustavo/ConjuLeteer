"""Comprehensive detailed auditor saving to UTF-8 JSON."""

import json
import re
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

ROOT = Path(r"c:\Users\gusta\Documents\ConjuLetter")
PDF_PATH = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
DATA_TS = ROOT / "src" / "data" / "englishQuestionBank.ts"
MEDIA_TS = ROOT / "src" / "data" / "englishQuestionMedia.ts"
OUT_JSON = ROOT / "src" / "scratch" / "audit_results.json"

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
    from import_english_questions import answer_key, TOPICS, parse_exam_metadata, repair_extraction
    answers, answer_pages = answer_key(reader)

    results = {
        "gabarito_divergences": [],
        "bancas": {},
        "special_chars": [],
        "missing_highlights": [],
        "blank_issues": [],
        "glued_blanks": [],
        "image_audit": {
            "attached_images": [],
            "decorative_candidates": [],
            "questions_referencing_images_without_media": []
        },
        "support_text_issues": []
    }

    # 1. GABARITO AUDIT
    for q in questions:
        key = (q["subjectId"], q["questionNumber"])
        official = answers.get(key)
        if official != q["correctLetter"]:
            results["gabarito_divergences"].append({
                "id": q["id"],
                "official": official,
                "current": q["correctLetter"]
            })

    # 2. METADATA / BANCAS
    for q in questions:
        meta = q.get("examMetadata") or {}
        b = meta.get("board", q.get("banca", ""))
        y = meta.get("year")
        results["bancas"].setdefault(b, {"count": 0, "years": set(), "sample_ids": []})
        results["bancas"][b]["count"] += 1
        if y: results["bancas"][b]["years"].add(y)
        if len(results["bancas"][b]["sample_ids"]) < 5:
            results["bancas"][b]["sample_ids"].append(q["id"])
            
    # convert sets to sorted lists for json
    for b in results["bancas"]:
        results["bancas"][b]["years"] = sorted(results["bancas"][b]["years"])

    # 3. SPECIAL / CORRUPT CHARACTERS
    for q in questions:
        q_str = json.dumps(q, ensure_ascii=False)
        corrupt = [c for c in q_str if ord(c) > 127 and (0xE000 <= ord(c) <= 0xF8FF or c in "¢€†")]
        if corrupt:
            results["special_chars"].append({
                "id": q["id"],
                "chars": list(set(corrupt))
            })

    # 4. HIGHLIGHTS
    highlight_patterns = [
        (re.compile(r"\b(the\s+bold\s+word|the\s+word\s+in\s+bold|palavra\s+em\s+negrito|termo\s+em\s+negrito)\b", re.I), "bold"),
        (re.compile(r"\b(underlined|sublinhad\w*|grifad\w*)\b", re.I), "underline"),
        (re.compile(r"\b(destacad\w*|highlighted)\b", re.I), "highlight"),
    ]
    for q in questions:
        stmt = q["statement"]
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_text = f"{stmt} {support_text} {options_text}"
        for pat, kind in highlight_patterns:
            if pat.search(stmt):
                has_u = "<u>" in all_text
                has_b = "**" in all_text or "<b>" in all_text
                if kind in ("bold", "underline", "highlight") and not (has_u or has_b):
                    results["missing_highlights"].append({
                        "id": q["id"],
                        "kind": kind,
                        "page": q["provenance"]["questionPage"],
                        "statement": stmt,
                        "support": support_text[:200] if support_text else None,
                        "options": [opt["text"] for opt in q["options"]]
                    })

    # 5. BLANKS / LACUNAS
    blank_keywords = re.compile(r"\b(blank|gap|lacuna|lacunas|fill\s+in|complete|completes|preenche|preenchem|correctly\s+fills|best\s+completes)\b", re.I)
    for q in questions:
        stmt = q["statement"]
        support = q.get("support") or {}
        support_text = " ".join(support.get("paragraphs", []))
        options_text = " ".join(opt["text"] for opt in q["options"])
        all_text = f"{stmt} {support_text} {options_text}"
        
        # Check glued blanks
        glued = list(re.finditer(r"([A-Za-z0-9À-ÿ])_{2,}|_{2,}([A-Za-z0-9À-ÿ])", all_text))
        if glued:
            results["glued_blanks"].append({
                "id": q["id"],
                "matches": [m.group(0) for m in glued],
                "statement": stmt
            })
            
        if blank_keywords.search(stmt):
            has_blank_symbol = bool(re.search(r"_{2,}|\[[I|V|X|\d]+\]|\.{4,}|(?<!\w)___+(?!\w)", all_text))
            has_roman_blank = bool(re.search(r"\((?:I|II|III|IV|V)\)|\b(?:I|II|III|IV|V)\b\s*[-–—:]", all_text))
            if not (has_blank_symbol or has_roman_blank):
                results["blank_issues"].append({
                    "id": q["id"],
                    "page": q["provenance"]["questionPage"],
                    "statement": stmt,
                    "support": support_text[:200] if support_text else None,
                    "options": [opt["text"] for opt in q["options"]]
                })

    # 6. IMAGES AUDIT
    for qid, media_list in media_map.items():
        q = next((x for x in questions if x["id"] == qid), None)
        if not q: continue
        for m in media_list:
            results["image_audit"]["attached_images"].append({
                "id": qid,
                "page": m.get("page"),
                "kind": m.get("kind"),
                "url": m.get("assetUrl"),
                "alt": m.get("altText"),
                "statement": q["statement"][:120]
            })
            # Check if decorative photo / illustration not needed
            is_decorative = (
                m.get("kind") == "photo" or
                "fotografia" in m.get("altText", "").lower() or
                "capa ilustrada" in m.get("altText", "").lower() or
                "pintura" in m.get("altText", "").lower() or
                "micrografia" in m.get("altText", "").lower() or
                "imagem de nikita" in m.get("altText", "").lower() or
                "imagem de um robô" in m.get("altText", "").lower() or
                "imagem do gorillaz" in m.get("altText", "").lower() or
                "imagem de um homem sentado" in m.get("altText", "").lower()
            )
            if is_decorative:
                results["image_audit"]["decorative_candidates"].append({
                    "id": qid,
                    "url": m.get("assetUrl"),
                    "kind": m.get("kind"),
                    "alt": m.get("altText"),
                    "statement": q["statement"]
                })

    # Check questions referencing comic/cartoon/charge that lack media
    ref_image_re = re.compile(r"\b(comic\s+strip|cartoon|charge|tirinha|tira|quadrinho|in\s+the\s+picture|in\s+the\s+ad|no\s+anúncio|no\s+quadro\s+a\s+seguir)\b", re.I)
    for q in questions:
        if q["id"] not in media_map:
            stmt = q["statement"]
            if ref_image_re.search(stmt):
                results["image_audit"]["questions_referencing_images_without_media"].append({
                    "id": q["id"],
                    "page": q["provenance"]["questionPage"],
                    "statement": stmt
                })

    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Audit results written to {OUT_JSON}")
    print(f"- Gabarito divergences: {len(results['gabarito_divergences'])}")
    print(f"- Special corrupt chars: {len(results['special_chars'])}")
    print(f"- Missing highlights: {len(results['missing_highlights'])}")
    print(f"- Blank issues: {len(results['blank_issues'])}")
    print(f"- Glued blanks: {len(results['glued_blanks'])}")
    print(f"- Attached images: {len(results['image_audit']['attached_images'])}")
    print(f"- Decorative image candidates to expunge: {len(results['image_audit']['decorative_candidates'])}")
    print(f"- Questions referencing image without media: {len(results['image_audit']['questions_referencing_images_without_media'])}")

if __name__ == "__main__":
    main()
