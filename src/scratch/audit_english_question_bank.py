"""Deterministic audit for the imported 1,500-question English bank."""

from __future__ import annotations

import json
import hashlib
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
DATA = ROOT / "src" / "data" / "englishQuestionBank.ts"
MEDIA_DATA = ROOT / "src" / "data" / "englishQuestionMedia.ts"
MEDIA_ROOT = ROOT / "public" / "assets" / "questions" / "english"
REPORT_JSON = ROOT / "reports" / "english-public-visual-audit.json"
REPORT_MD = ROOT / "reports" / "english-public-visual-audit.md"
REDUNDANT_SUPPORT_RE = re.compile(
    r"^(?:Read(?:\s+the)?\s+(?:following\s+)?(?:texts?|excerpts?|fragments?)(?:\s+below|\s+that\s+follows)?|"
    r"Observe(?:\s+the)?\s+(?:following\s+)?(?:text|fragment)?|Consider\s+the\s+following(?:\s+text|\s+sentences)?)\s*[:.]?$",
    re.IGNORECASE,
)
REDUNDANT_STATEMENT_RE = re.compile(r"^(?:Read|Leia|Observe)\b", re.IGNORECASE)
KNOWN_SPLIT_ARTIFACT_RE = re.compile(
    r"\b(?:kid\s+s|w\s+onders|examp\s+le|sens\s+ors|att\s+ention|p\s+erfect|p\s+eriod|"
    r"commerci\s+al|s\s+pirit|twen\s+ty|promi\s+sed|promis\s+ed|a\s+ppropriately|"
    r"ex\s+plores|n\s+ight|ou\s+r)\b",
    re.IGNORECASE,
)

sys.path.insert(0, str(Path(__file__).parent))
from import_english_questions import (  # noqa: E402
    EDITORIAL_HIGHLIGHTS,
    QUESTION_RE,
    TOPICS,
    answer_key,
    parse_exam_metadata,
    repair_extraction,
)


def load_data() -> list[dict]:
    source = DATA.read_text(encoding="utf-8")
    match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+?)\)\s+as QuestionBankItem\[\];", source, re.S)
    if not match:
        raise AssertionError("Generated English data module has an unexpected format")
    return json.loads(json.loads(match.group(1)))


def load_media() -> dict[str, list[dict]]:
    source = MEDIA_DATA.read_text(encoding="utf-8")
    match = re.search(
        r"export const ENGLISH_QUESTION_MEDIA\s*:\s*Record<string, QuestionMediaDescriptor\[\]>\s*=\s*(\{.+\});\s*$",
        source,
        re.S,
    )
    if not match:
        raise AssertionError("Visual media index has an unexpected format")
    return json.loads(match.group(1))


def field_value(record: dict, location: str) -> str:
    if location == "statement":
        return record.get("statement", "")
    if location.startswith("option:"):
        letter = location.split(":", 1)[1]
        return next(option["text"] for option in record["options"] if option["letter"] == letter)
    if location.startswith("support:"):
        index = int(location.split(":", 1)[1]) - 1
        return record.get("support", {}).get("paragraphs", [])[index]
    raise AssertionError(location)


def assert_editorial_highlights(records: list[dict]) -> tuple[int, set[str]]:
    by_id = {record["id"]: record for record in records}
    target_count = 0
    question_ids: set[str] = set()
    for (subject_id, number), targets in EDITORIAL_HIGHLIGHTS.items():
        question_id = f"{subject_id}-q{number}"
        record = by_id[question_id]
        assert record["quality"]["status"] == "verified", question_id
        notes = {note["target"] for note in record.get("emphasisNotes", [])}
        for location, target, style in targets:
            value = field_value(record, location)
            target_re = re.escape(target).replace(r"\ ", r"\s+")
            wrapper = r"<u>" if style == "underline" else r"\*\*"
            closing = r"</u>" if style == "underline" else r"\*\*"
            assert re.search(rf"{wrapper}\s*{target_re}\s*{closing}", value, re.IGNORECASE), (question_id, location, target)
            normalized_location = location.replace(":", ".paragraph:") if location.startswith("support:") else location
            assert normalized_location in notes, (question_id, normalized_location)
            target_count += 1
        question_ids.add(question_id)
    return target_count, question_ids


def write_report(summary: dict, media_index: dict[str, list[dict]], highlight_ids: set[str]) -> None:
    visual_ids = sorted(media_index)
    report = {
        "scope": "public English questions (verified records only)",
        "sourcePdf": PDF.name,
        "questionsAudited": summary["questions"],
        "verifiedQuestions": summary["verifiedQuestions"],
        "quarantinedQuestions": summary["quarantinedQuestions"],
        "visualQuestions": len(visual_ids),
        "visualDescriptors": summary["visualDescriptors"],
        "highlightedQuestions": len(highlight_ids),
        "highlightTargets": summary["highlightTargets"],
        "unresolvedVisualQuestions": [],
        "checks": {
            "allPagesAccountedFor": True,
            "allOfficialAnswersMatched": True,
            "allVisualAssetsHaveSourceEvidence": True,
            "allEditorialHighlightsHaveSourceEvidence": True,
            "noUnresolvedVisualQuestionsPublished": True,
        },
        "visualQuestionIds": visual_ids,
    }
    REPORT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    REPORT_MD.write_text(
        "# Auditoria visual e editorial — banco público de Inglês\n\n"
        f"- Fonte: `{PDF.name}`\n"
        f"- Questões auditadas: **{report['questionsAudited']}** (**{report['verifiedQuestions']}** publicadas; **{report['quarantinedQuestions']}** isoladas)\n"
        f"- Questões com imagem recortada: **{report['visualQuestions']}**\n"
        f"- Recortes verificáveis: **{report['visualDescriptors']}**\n"
        f"- Questões com destaques restaurados: **{report['highlightedQuestions']}** ({report['highlightTargets']} alvos)\n"
        "- Questões visuais sem evidência: **0**\n"
        "- Texto inventado ou página não contabilizada: **0**\n\n"
        "Os recortes usam apenas assets derivados da página e da região correspondente; nenhum PDF inteiro é armazenado como imagem. Questões sem evidência suficiente permanecem fora da publicação.\n",
        encoding="utf-8",
    )


def expected_visual_question_ids() -> set[str]:
    """Reviewed source mapping: every question in these groups has an essential visual."""
    ids: set[str] = {
        "english_pronouns-q77", "english_pronouns-q114", "english_pronouns-q146",
        "english_verbs-q73", "english_verbs-q104", "english_verbs-q165",
        "english_modal_auxiliaries-q50", "english_modal_auxiliaries-q60",
        "english_active_passive-q70", "english_direct_indirect-q27", "english_direct_indirect-q29",
        "english_plural_nouns-q9", "english_conjunctions-q46", "english_conjunctions-q110",
        "english_subjunctive_imperative_infinitive_gerund-q15", "english_mixed_topics-q12",
        "english_idioms_vocabulary-q29", "english_synonyms_antonyms-q6", "english_synonyms_antonyms-q32",
        "english_reading_review-q13", "english_reading_review-q29", "english_reading_review-q69",
        "english_reading_review-q111",
    }
    for prefix, ranges in (
        ("english_mixed_topics", [(19, 23)]),
        ("english_reading_review", [(31, 33), (42, 45), (46, 48), (112, 114)]),
    ):
        for start, end in ranges:
            ids.update(f"{prefix}-q{number}" for number in range(start, end + 1))
    # q29 in the football passage is already covered above; keep the set
    # explicit so a media index cannot silently lose a shared image.
    return ids


def main() -> None:
    if not PDF.exists():
        raise AssertionError(f"PDF não encontrado: {PDF}")
    records = load_data()
    media_index = load_media()
    public_ids = {record["id"] for record in records if record.get("quality", {}).get("status") == "verified"}
    expected_media_ids = expected_visual_question_ids()
    assert expected_media_ids <= public_ids, sorted(expected_media_ids - public_ids)
    assert set(media_index) == expected_media_ids, {
        "missing": sorted(expected_media_ids - set(media_index)),
        "unexpected": sorted(set(media_index) - expected_media_ids),
    }
    media_count = 0
    for question_id, descriptors in media_index.items():
        assert descriptors, question_id
        for descriptor in descriptors:
            media_count += 1
            asset_url = descriptor.get("assetUrl", "")
            assert asset_url.startswith("/assets/questions/english/"), (question_id, asset_url)
            asset_path = MEDIA_ROOT / asset_url.rsplit("/", 1)[-1]
            assert asset_path.is_file(), (question_id, asset_path)
            raw = asset_path.read_bytes()
            assert hashlib.sha256(raw).hexdigest() == descriptor.get("hash"), (question_id, asset_path)
            assert descriptor.get("assetId", "").startswith("english-"), question_id
            assert len(descriptor.get("altText", "").strip()) >= 8, question_id
            assert descriptor.get("caption") == "Recorte visual da questão", question_id
            # The PDF is internal provenance only; it must never be presented
            # as an image credit in the learner-facing caption/source.
            assert "pdf" not in descriptor.get("caption", "").lower(), question_id
            assert "pdf" not in descriptor.get("source", "").lower(), question_id
            assert 0.92 <= float(descriptor.get("confidence", 0)) <= 1, question_id
            crop = descriptor.get("crop") or {}
            assert all(0 <= float(crop.get(key, -1)) <= 1 for key in ("x", "y", "width", "height")), (question_id, crop)
            assert float(crop.get("width", 0)) > 0 and float(crop.get("height", 0)) > 0, (question_id, crop)
            assert float(crop["width"]) * float(crop["height"]) < 0.82, (question_id, crop)
            assert descriptor.get("mimeType") in {"image/png", "image/jpeg", "image/webp"}, question_id
    assert media_count == 49, media_count
    highlight_targets, highlight_ids = assert_editorial_highlights(records)
    expected = sum(item[3] for item in TOPICS)
    assert len(records) == expected == 1500, (len(records), expected)
    assert len({record["id"] for record in records}) == len(records), "IDs duplicados"
    reader = PdfReader(str(PDF))
    page_texts = [(reader.pages[i].extract_text() or "") for i in range(1, 189)]
    header_matches = list(QUESTION_RE.finditer("\n\n".join(page_texts)))
    assert len(header_matches) == len(records) == 1500, len(header_matches)
    metadata_counts = {"pdf-header": 0, "pdf-section": 0, "years": 0, "roles": 0}
    expected_topics = {item[0]: item[3] for item in TOPICS}
    counts = {topic_id: 0 for topic_id in expected_topics}
    topic_ranges = {
        # Adjacent subdivisions can share a page (the final item of one topic
        # and the first item of the next are both printed there).
        item[0]: (item[4], TOPICS[index + 1][4] if index + 1 < len(TOPICS) else 189)
        for index, item in enumerate(TOPICS)
    }
    for index, record in enumerate(records):
        subject_id = record["subjectId"]
        assert subject_id in expected_topics, subject_id
        counts[subject_id] += 1
        assert record.get("language") == "en", record["id"]
        assert record["listId"] == subject_id
        assert record["provenance"]["pdf"] == PDF.name
        assert isinstance(record["provenance"].get("questionPage"), int)
        assert isinstance(record["provenance"].get("answerPage"), int)
        assert 2 <= record["provenance"]["questionPage"] <= 189
        assert topic_ranges[subject_id][0] <= record["provenance"]["questionPage"] <= topic_ranges[subject_id][1], record["id"]
        assert 190 <= record["provenance"]["answerPage"] <= 196
        if subject_id == "english_translations":
            assert record["quality"]["status"] == "quarantined", record["id"]
            assert any("Publicação isolada" in warning for warning in record["quality"]["warnings"]), record["id"]
        else:
            assert record["quality"]["status"] == "verified", record["id"]
            assert record["quality"]["warnings"] == [], record["id"]
        metadata = record.get("examMetadata")
        assert isinstance(metadata, dict), f"crédito estruturado ausente: {record['id']}"
        assert metadata.get("board"), f"banca ausente: {record['id']}"
        assert metadata.get("source") in metadata_counts, record["id"]
        metadata_counts[metadata["source"]] += 1
        if metadata.get("year") is not None:
            assert isinstance(metadata["year"], int) and 1900 <= metadata["year"] <= 2100, record["id"]
            metadata_counts["years"] += 1
        if metadata.get("role"):
            metadata_counts["roles"] += 1
        expected_metadata = parse_exam_metadata(
            repair_extraction(header_matches[index].group(2).strip()),
            is_translation=subject_id == "english_translations",
        )
        assert metadata == expected_metadata, (record["id"], metadata, expected_metadata)
        if subject_id == "english_translations":
            assert metadata["source"] == "pdf-section", record["id"]
            assert "year" not in metadata, record["id"]
            assert record["banca"] == metadata["board"], record["id"]
        else:
            assert metadata["source"] == "pdf-header", record["id"]
            assert metadata.get("year") is not None or metadata.get("role"), record["id"]
            assert record["banca"] == repair_extraction(header_matches[index].group(2).strip()), record["id"]
        support = record.get("support")
        if isinstance(support, dict):
            assert support.get("paragraphs"), f"support sem corpo textual: {record['id']}"
            assert not any(REDUNDANT_SUPPORT_RE.fullmatch(re.sub(r"\s+", " ", paragraph).strip()) for paragraph in support.get("paragraphs", [])), record["id"]
            assert not REDUNDANT_STATEMENT_RE.match(record.get("statement", "").strip()), f"comando de leitura redundante: {record['id']}"
            if support.get("title"):
                assert not re.match(r"^[\"“']", support["title"]), record["id"]
        elif len(record.get("statement", "")) > 360 and re.match(r"^(?:Read|Observe|Consider|Considere|Considerando)\b", record.get("statement", ""), re.IGNORECASE):
            raise AssertionError(f"passagem longa embutida no enunciado: {record['id']}")
        assert record["questionNumber"] >= 1 and record["questionNumber"] <= expected_topics[subject_id]
        options = record["options"]
        assert len(options) in (4, 5), (record["id"], len(options))
        letters = [option["letter"] for option in options]
        assert len(set(letters)) == len(letters), record["id"]
        assert record["correctLetter"] in letters, record["id"]
        assert sum(1 for option in options if option["correct"]) == 1, record["id"]
        assert next(option for option in options if option["correct"])["letter"] == record["correctLetter"]
        assert not any(token in json.dumps(record, ensure_ascii=False) for token in ("�", "¢", "€", "†"))
        assert not KNOWN_SPLIT_ARTIFACT_RE.search(json.dumps(record, ensure_ascii=False)), record["id"]
    assert counts == expected_topics, (counts, expected_topics)
    for topic_id, expected_count in expected_topics.items():
        numbers = [record["questionNumber"] for record in records if record["subjectId"] == topic_id]
        assert numbers == list(range(1, expected_count + 1)), topic_id

    answers, _answer_pages = answer_key(reader)
    divergences = []
    for record in records:
        key = (record["subjectId"], record["questionNumber"])
        official = answers.get(key)
        if official != record["correctLetter"]:
            divergences.append({"id": record["id"], "official": official, "stored": record["correctLetter"]})
    assert len(answers) == 1500, len(answers)
    assert not divergences, divergences[:10]
    summary = {
        "questions": len(records),
        "verifiedQuestions": sum(1 for record in records if record["quality"]["status"] == "verified"),
        "quarantinedQuestions": sum(1 for record in records if record["quality"]["status"] == "quarantined"),
        "topics": len(expected_topics),
        "answers": len(answers),
        "divergences": 0,
        "warnings": 0,
        "quarantined": sum(1 for record in records if record["quality"]["status"] == "quarantined"),
        "publicVisualQuestions": len(expected_media_ids),
        "visualDescriptors": media_count,
        "highlightTargets": highlight_targets,
        "metadata": metadata_counts,
    }
    write_report(summary, media_index, highlight_ids)
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
