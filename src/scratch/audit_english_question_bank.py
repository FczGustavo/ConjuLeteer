"""Deterministic audit for the imported 1,500-question English bank."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")
DATA = ROOT / "src" / "data" / "englishQuestionBank.ts"

sys.path.insert(0, str(Path(__file__).parent))
from import_english_questions import TOPICS, answer_key  # noqa: E402


def load_data() -> list[dict]:
    source = DATA.read_text(encoding="utf-8")
    match = re.search(r"export const ENGLISH_QUESTION_BANK\s*:\s*QuestionBankItem\[\]\s*=\s*JSON\.parse\((.+)\)\s+as QuestionBankItem\[\];\s*$", source, re.S)
    if not match:
        raise AssertionError("Generated English data module has an unexpected format")
    return json.loads(json.loads(match.group(1)))


def main() -> None:
    if not PDF.exists():
        raise AssertionError(f"PDF não encontrado: {PDF}")
    records = load_data()
    expected = sum(item[3] for item in TOPICS)
    assert len(records) == expected == 1500, (len(records), expected)
    assert len({record["id"] for record in records}) == len(records), "IDs duplicados"
    expected_topics = {item[0]: item[3] for item in TOPICS}
    counts = {topic_id: 0 for topic_id in expected_topics}
    topic_ranges = {
        # Adjacent subdivisions can share a page (the final item of one topic
        # and the first item of the next are both printed there).
        item[0]: (item[4], TOPICS[index + 1][4] if index + 1 < len(TOPICS) else 189)
        for index, item in enumerate(TOPICS)
    }
    for record in records:
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
        assert record["quality"]["status"] == "verified", record["id"]
        assert record["quality"]["warnings"] == [], record["id"]
        assert record["questionNumber"] >= 1 and record["questionNumber"] <= expected_topics[subject_id]
        options = record["options"]
        assert len(options) in (4, 5), (record["id"], len(options))
        letters = [option["letter"] for option in options]
        assert len(set(letters)) == len(letters), record["id"]
        assert record["correctLetter"] in letters, record["id"]
        assert sum(1 for option in options if option["correct"]) == 1, record["id"]
        assert next(option for option in options if option["correct"])["letter"] == record["correctLetter"]
        assert not any(token in json.dumps(record, ensure_ascii=False) for token in ("�", "¢", "€", "†"))
    assert counts == expected_topics, (counts, expected_topics)
    for topic_id, expected_count in expected_topics.items():
        numbers = [record["questionNumber"] for record in records if record["subjectId"] == topic_id]
        assert numbers == list(range(1, expected_count + 1)), topic_id

    answers, _answer_pages = answer_key(PdfReader(str(PDF)))
    divergences = []
    for record in records:
        key = (record["subjectId"], record["questionNumber"])
        official = answers.get(key)
        if official != record["correctLetter"]:
            divergences.append({"id": record["id"], "official": official, "stored": record["correctLetter"]})
    assert len(answers) == 1500, len(answers)
    assert not divergences, divergences[:10]
    print(json.dumps({"questions": len(records), "topics": len(expected_topics), "answers": len(answers), "divergences": 0, "warnings": 0}, ensure_ascii=False))


if __name__ == "__main__":
    main()
