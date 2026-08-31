"""Synchronize simulator copies with the audited canonical question bank."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def load(path: Path, name: str) -> tuple[str, list[dict]]:
    source = path.read_text(encoding="utf-8")
    declaration = source.index(f"export const {name}")
    payload = source.index(" = ", declaration) + 3
    return source[:payload], json.loads(source[payload:].rstrip().removesuffix(";"))


def main() -> None:
    bank_path = ROOT / "src" / "data" / "questionBank.ts"
    simulado_path = ROOT / "src" / "data" / "simuladoQuestions.ts"
    _, bank = load(bank_path, "QUESTION_BANK")
    prefix, simulados = load(simulado_path, "SIMULADO_QUESTIONS")
    head_source = subprocess.run(
        ["git", "show", "HEAD:src/data/simuladoQuestions.ts"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    ).stdout
    declaration = head_source.index("export const SIMULADO_QUESTIONS")
    payload = head_source.index(" = ", declaration) + 3
    previous = json.loads(head_source[payload:].rstrip().removesuffix(";"))
    previous_by_key = {(item["listId"], item["questionNumber"]): item for item in previous}
    canonical = {(item["listId"], item["questionNumber"]): item for item in bank}
    synchronized = 0
    for item in simulados:
        source = canonical.get((item.get("listId"), item.get("questionNumber")))
        if not source:
            continue
        for field in ("statement", "readingText", "support", "provenance", "quality", "correctLetter"):
            if field in source:
                item[field] = source[field]
            else:
                item.pop(field, None)
        old_options = {
            option["letter"]: option
            for option in previous_by_key.get((item.get("listId"), item.get("questionNumber")), {}).get("options", [])
        }
        item["options"] = [
            {
                **option,
                "explanation": old_options.get(option["letter"], {}).get(
                    "explanation", "Alternativa revisada conforme o gabarito oficial."
                ),
            }
            for option in source.get("options", [])
        ]
        synchronized += 1
    simulado_path.write_text(
        prefix + json.dumps(simulados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Synchronized {synchronized} simulator questions.")


if __name__ == "__main__":
    main()
