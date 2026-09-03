"""Fail-fast audit gate for the generated Inglês Preview corpus."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "english-preview-audit.json"
DATA = ROOT / "src" / "data" / "englishPreviewQuestionBank.ts"
ASSETS = ROOT / "public" / "assets" / "english-preview"


def main() -> None:
    if not REPORT.exists() or not DATA.exists():
        raise SystemExit("Inglês Preview ainda não foi gerado; execute npm run import:english-preview")
    report = json.loads(REPORT.read_text(encoding="utf-8"))
    assert report["totalPages"] == 394, report["totalPages"]
    assert report["expectedQuestions"] == 2270, report["expectedQuestions"]
    assert report["detectedQuestions"] == 2270, report["detectedQuestions"]
    reconciliation = report.get("editorialTotals", {})
    assert reconciliation.get("status") == "passed"
    assert reconciliation.get("declared") == {
        "questions": 2270,
        "readingVocabulary": 967,
        "grammar": 1303,
        "subjects": 30,
        "exams": 112,
    }
    assert reconciliation.get("computed", {}).get("answerPositions") == 2270
    assert reconciliation.get("computed", {}).get("answerBlocks") == 40
    assert not reconciliation.get("answerDuplicates")
    assert len(report.get("receivedPages", [])) == 394
    assert len(report.get("processedPages", [])) == 394
    assert len(report.get("extractionMethods", {})) == 394
    assert report.get("coverage") == 1.0
    assert len(report["sections"]) == 40
    assert all(section["complete"] for section in report["sections"])
    section_fields = {"extracted", "verified", "warning", "duplicates", "quarantined", "rejected"}
    assert all(section_fields.issubset(section) for section in report["sections"])
    assert sum(section["extracted"] for section in report["sections"]) == 2270
    assert sum(section["duplicates"] for section in report["sections"]) == report["duplicateCount"]
    assert report.get("authorialRemovedCount") == 59, report.get("authorialRemovedCount")
    assert report.get("quality", {}).get("rejected") == 59
    rows = report["rows"]
    assert len(rows) == 2270
    assert all(re.match(r"^ep-[0-9a-f]{12}-preview_[a-z0-9_]+-q\d+$", row["id"]) for row in rows)
    visual_audit = report.get("visualAudit", [])
    assert visual_audit, "Referências visuais não foram registradas no manifesto"
    assert all(row.get("status") == "quarantined" for row in visual_audit if not row.get("assetIds"))
    assert not [row for row in visual_audit if not row.get("assetIds")], "Há referência visual sem recorte após a revisão web"
    assert sum(1 for row in visual_audit if row.get("officialSourceRecovered")) == 2
    assert all(row.get("provenance", {}).get("questionPage") for row in rows)
    assert all(row.get("provenance", {}).get("answerPage") for row in rows)
    for row in rows:
        status = row.get("quality", {}).get("status")
        if row.get("authorialRemoved"):
            assert status == "rejected", row["id"]
            assert row.get("statement") == "", row["id"]
            assert row.get("options") == [], row["id"]
            assert row.get("banca") == "Conteúdo removido", row["id"]
        if status in {"verified", "warning"}:
            assert len(row.get("options", [])) in {4, 5}, row["id"]
            assert row.get("correctLetter") in {"A", "B", "C", "D", "E"}, row["id"]
            assert any(option.get("letter") == row["correctLetter"] for option in row["options"]), row["id"]
            assert row.get("statement", "").strip(), row["id"]
            assert not any(re.search(r"Texto\s+para\s+(?:a|as)\s+quest", option.get("text", ""), re.I) for option in row.get("options", [])), row["id"]
            assert not row.get("authorialRemoved"), row["id"]
        evidence_fields = {item.get("field") for item in row.get("quality", {}).get("evidence", [])}
        assert {"statement", "options", "answer", "metadata"}.issubset(evidence_fields), row["id"]
    referenced_assets = []
    for row in rows:
        for media in row.get("media", []):
            referenced_assets.append(media["assetId"])
            assert (ROOT / "public" / "assets" / media["assetId"]).exists(), media["assetId"]
            assert media.get("caption") == "Recorte visual da questão"
            assert ".pdf" not in media.get("caption", "").lower()
            assert ".pdf" not in media.get("source", "").lower()
    assert len(list(ASSETS.glob("*.webp"))) == len(set(referenced_assets)), "Há recortes órfãos no diretório do Preview"
    source = DATA.read_text(encoding="utf-8")
    assert "loadEnglishPreviewQuestions" in source
    print(json.dumps({
        "pages": report["totalPages"],
        "questions": report["detectedQuestions"],
        "published": report["publishedQuestions"],
        "answers": report["expectedAnswerBlocks"],
        "media": len(referenced_assets),
        "quarantined": report["quality"]["quarantined"],
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
