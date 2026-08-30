"""Cross-check every displayed conjugation against a Brazilian reference.

This is a release audit, intentionally independent from the catalogue builder.
It reads the compiled application data through ``audit-verbs.cjs --json`` and
compares all 11 displayed paradigms with conjugacao.com.br.  Network access is
required; the normal offline runtime does not depend on this script.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
PERSONS = ["1s", "2s", "3s", "1p", "2p", "3p"]
TENSE_KEYS = [
    "indicativo_presente",
    "indicativo_pret_imperfeito",
    "indicativo_pret_perfeito",
    "indicativo_pret_mais_que_perfeito",
    "indicativo_futuro_presente",
    "indicativo_futuro_preterito",
    "subjuntivo_presente",
    "subjuntivo_pret_imperfeito",
    "subjuntivo_futuro_subjuntivo",
    "imperativo_af_presente",
    "imperativo_neg_presente",
]
INDICATIVE_KEYS = TENSE_KEYS[:6]


def load_catalogue() -> list[dict]:
    result = subprocess.run(
        ["node", "scripts/audit-verbs.cjs", "--json"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(result.stdout)


def slug(value: str) -> str:
    folded = unicodedata.normalize("NFD", value)
    return "".join(char for char in folded if unicodedata.category(char) != "Mn").lower()


def fetch_reference(verb: str) -> tuple[str, dict[str, list[str | None]]]:
    response = requests.get(
        f"https://www.conjugacao.com.br/verbo-{slug(verb)}/",
        headers={"User-Agent": "ConjuLetter release audit/1.0"},
        timeout=30,
    )
    response.raise_for_status()
    # Decode before handing the document to BeautifulSoup; the page includes a
    # legacy meta declaration that otherwise overrides the HTTP UTF-8 header.
    soup = BeautifulSoup(response.content.decode("utf-8"), "html.parser")
    columns = soup.select("#conjugacao .verb-col")
    result: dict[str, list[str | None]] = {key: [None] * 6 for key in TENSE_KEYS}
    indicative_index = 0
    for column in columns:
        heading = column.select_one("h4")
        if not heading:
            continue
        heading_text = slug(heading.get_text(" ", strip=True))
        if indicative_index < 6:
            key = INDICATIVE_KEYS[indicative_index]
            indicative_index += 1
        elif heading_text == "presente":
            key = "subjuntivo_presente"
        elif heading_text == "preterito imperfeito":
            key = "subjuntivo_pret_imperfeito"
        elif heading_text == "futuro":
            key = "subjuntivo_futuro_subjuntivo"
        elif heading_text == "imperativo afirmativo":
            key = "imperativo_af_presente"
        elif heading_text == "imperativo negativo":
            key = "imperativo_neg_presente"
        else:
            continue  # infinitivo pessoal is outside the application table

        for row in column.select("p > span"):
            form_node = row.select_one(".f")
            if not form_node:
                continue
            labels = " ".join(
                slug(child.get_text(" ", strip=True))
                for child in row.find_all("span", recursive=False)
                if child is not form_node
            ).split()
            person_map = {
                "eu": "1s", "tu": "2s", "ele": "3s", "voce": "3s",
                "nos": "1p", "vos": "2p", "eles": "3p", "voces": "3p",
            }
            person = next((person_map[label] for label in reversed(labels) if label in person_map), None)
            if not person:
                continue
            form = re.sub(r"\s+", " ", form_node.get_text(" ", strip=True))
            if key == "imperativo_neg_presente":
                form = f"não {form}"
            result[key][PERSONS.index(person)] = form
    if indicative_index != 6:
        raise RuntimeError(f"página sem os seis tempos do indicativo ({indicative_index})")
    return verb, result


def main() -> int:
    catalogue = load_catalogue()
    references: dict[str, dict[str, list[str | None]]] = {}
    fetch_errors: list[str] = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(fetch_reference, verb["id"]): verb["id"] for verb in catalogue}
        for future in as_completed(futures):
            verb_id = futures[future]
            try:
                key, value = future.result()
                references[key] = value
            except Exception as exc:  # noqa: BLE001 - release report needs every URL failure
                fetch_errors.append(f"{verb_id}: {exc}")

    mismatches: list[str] = []
    compared = 0
    for verb in catalogue:
        reference = references.get(verb["id"])
        if not reference:
            continue
        for tense in TENSE_KEYS:
            for index, person in enumerate(PERSONS):
                actual = verb["conjugations"][tense][person]
                expected = reference[tense][index]
                if actual is None and expected is None:
                    compared += 1
                    continue
                accepted = expected.split(" ou ") if expected else [expected]
                actual_nfc = unicodedata.normalize("NFC", actual) if actual else actual
                accepted_nfc = [unicodedata.normalize("NFC", value) if value else value for value in accepted]
                if actual is None or expected is None or actual_nfc not in accepted_nfc:
                    mismatches.append(
                        f"{verb['id']}/{tense}/{person}: app={actual!r}; referência={expected!r}"
                    )
                compared += 1

    report = {
        "verbs": len(catalogue),
        "reference_pages": len(references),
        "forms_compared": compared,
        "fetch_errors": sorted(fetch_errors),
        "mismatches": mismatches,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if fetch_errors or mismatches else 0


if __name__ == "__main__":
    sys.exit(main())
