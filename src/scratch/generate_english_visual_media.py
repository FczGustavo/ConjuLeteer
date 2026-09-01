"""Emit the reviewed, cropped visual assets used by public English questions.

The PDF is only used at audit time.  The application ships the extracted
asset bytes under ``public/assets/questions/english`` and this module emits a
small descriptor index that is merged into the generated English bank.  Each
descriptor keeps the source page/crop, hash and an accessible description so
the UI never has to load or screenshot the full source PDF.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSET_DIR = ROOT / "public" / "assets" / "questions" / "english"
OUT = ROOT / "src" / "data" / "englishQuestionMedia.ts"
PDF = Path(r"C:\Users\gusta\Downloads\1500 Questões de Inglês para Concursos Militares.pdf")


# Question ids are local to their English topic.  A group shares one visual
# passage; attaching it to every question in the group preserves the source
# context when a learner opens any item directly.
GROUPS: list[tuple[list[str], list[str], str, str, str]] = [
    (["english_pronouns-q77"], ["p023-Im11.png"], "figure", "Tirinha de Garfield procurando a jaqueta em vários lugares.", "support"),
    (["english_pronouns-q114"], ["p028-Im11.png"], "figure", "Tirinha em quatro quadrinhos sobre crianças observadoras.", "statement"),
    (["english_pronouns-q146"], ["p032-Im11.png"], "figure", "Tirinha com balões para completar pronomes interrogativos.", "statement"),
    (["english_verbs-q73"], ["p045-Im11.png"], "figure", "Tirinha usada para corrigir uma forma verbal.", "statement"),
    (["english_verbs-q104"], ["p048-Im11.png"], "figure", "Tirinha usada para interpretar uma condição verbal.", "statement"),
    (["english_verbs-q165"], ["p055-Im11.png"], "figure", "Tirinha de Charlie Brown e Lucy com linguagem coloquial.", "statement"),
    (["english_verbs-q175"], ["p057-Im11.png"], "photo", "Capa ilustrada de Secrets of the New Matrix.", "support"),
    (["english_modal_auxiliaries-q50"], ["p063-Im11.png"], "figure", "Tirinha de Peanuts sobre tomar café da manhã.", "support"),
    (["english_modal_auxiliaries-q57"], ["p064-Im11.png"], "photo", "Fotografia histórica de uma manifestação pelo sufrágio feminino.", "support"),
    (["english_modal_auxiliaries-q60"], ["p065-Im11.png"], "figure", "Ilustração com placas e um balão sobre não precisar parar.", "statement"),
    (["english_modal_auxiliaries-q74"], ["p067-Im11.png"], "figure", "Ilustração de um homem sentado em um banco com uma criança.", "support"),
    (["english_active_passive-q70"], ["p075-Im11.png"], "figure", "Tirinha usada para interpretar a forma passiva dragged.", "statement"),
    (["english_direct_indirect-q27"], ["p082-Im11.jpg", "p082-Im12.jpg", "p082-Im13.jpg"], "figure", "Três tirinhas usadas no exercício de discurso indireto.", "statement"),
    (["english_direct_indirect-q29"], ["p083-Im11.png"], "figure", "Tirinha com uma menina pedindo que o pai desenhe uma aranha.", "statement"),
    (["english_conditionals-q28"], ["p088-Im11.png"], "figure", "Imagem de Nikita Khrushchev acompanhada de uma citação.", "support"),
    (["english_plural_nouns-q9"], ["p097-Im11.png"], "figure", "Tirinha de Garfield usada no exercício de plural.", "statement"),
    (["english_conjunctions-q46"], ["p118-Im11.png"], "figure", "Charge sobre a Grande Depressão e o uso de conjunções.", "statement"),
    (["english_conjunctions-q110"], ["p126-Im11.png"], "figure", "Charge sobre a Grande Depressão e suas relações de causa e efeito.", "statement"),
    (["english_subjunctive_imperative_infinitive_gerund-q15"], ["p130-Im11.png"], "figure", "Charge sobre a proibição de fumar na Casa Branca.", "statement"),
    ([f"english_mixed_topics-q{n}" for n in range(19, 24)], ["p138-Im11.png"], "figure", "Tirinha A 90s Vacation com balões para completar.", "support"),
    (["english_mixed_topics-q12"], ["p137-Im11.png", "p137-Im12.png"], "figure", "Duas tirinhas usadas na questão sobre construções adequadas.", "statement"),
    (["english_idioms_vocabulary-q29"], ["p142-Im11.png", "p142-Im12.png"], "figure", "Tirinha sobre alcançar um pote e a expressão hit the sack.", "statement"),
    (["english_synonyms_antonyms-q6"], ["p143-Im11.png"], "figure", "Charge sobre frango grelhado e o verbo to broil.", "statement"),
    (["english_synonyms_antonyms-q32"], ["p147-Im11.png"], "figure", "Charge sobre avanços tecnológicos e a palavra breakthrough.", "statement"),
    (["english_reading_review-q13"], ["p151-Im11.png"], "figure", "Anúncio ilustrado da New Mexico State University.", "support"),
    (["english_reading_review-q29"], ["p155-Im11.png"], "figure", "Mapa satírico dos impérios do futebol.", "statement"),
    ([f"english_reading_review-q{n}" for n in range(31, 34)], ["p155-Im12.png", "p155-Im13.png"], "figure", "Tirinha sobre futebol, tarefas e a escolha de times.", "statement"),
    ([f"english_reading_review-q{n}" for n in range(34, 37)], ["p156-Im11.png"], "figure", "Ilustração televisiva que acompanha o texto TV Will Save the World.", "support"),
    ([f"english_reading_review-q{n}" for n in range(37, 42)], ["p157-Im11.png"], "photo", "Fotografia de mãe e filha lendo, que acompanha o texto sobre educação domiciliar.", "support"),
    ([f"english_reading_review-q{n}" for n in range(42, 46)], ["p158-ad-panel.png"], "figure", "Recorte do anúncio da DHL para a Fórmula 1, incluindo a chamada e o logotipo.", "support"),
    ([f"english_reading_review-q{n}" for n in range(46, 49)], ["p159-Im11.png"], "figure", "Tirinha de Charlie Brown em quatro quadrinhos, incluindo o terceiro quadrinho.", "statement"),
    ([f"english_reading_review-q{n}" for n in range(60, 65)], ["p162-Im11.png"], "photo", "Pintura The Card Players, reproduzida no texto sobre arte digital.", "support"),
    (["english_reading_review-q69"], ["p163-Im11.png", "p163-Im12.png"], "figure", "Tirinha sobre análise de dados e o histórico escolar.", "statement"),
    ([f"english_reading_review-q{n}" for n in range(70, 74)], ["p164-Im11.png"], "figure", "Ilustração que acompanha o texto sobre programas de empatia e bullying.", "support"),
    ([f"english_reading_review-q{n}" for n in range(74, 78)], ["p165-Im11.png"], "photo", "Fotografia de um tubarão híbrido que acompanha o texto científico.", "support"),
    ([f"english_reading_review-q{n}" for n in range(87, 96)], ["p168-Im11.png"], "photo", "Micrografia dos microrganismos do texto da NASA sobre arsênio.", "support"),
    ([f"english_reading_review-q{n}" for n in range(96, 104)], ["p170-Im11.png"], "photo", "Fotografia de uma impressão digital que acompanha o texto Sticky Fingers.", "support"),
    ([f"english_reading_review-q{n}" for n in range(104, 111)], ["p171-Im11.png"], "photo", "Fotografia de militares que acompanha o texto sobre a guerra no Afeganistão.", "support"),
    (["english_reading_review-q111"], ["p173-Im11.png"], "figure", "Charge de soldados usada na questão sobre a imagem.", "statement"),
    ([f"english_reading_review-q{n}" for n in range(112, 115)], ["p173-Im12.png"], "chart", "Gráficos circulares da pesquisa sobre a opinião dos norte-americanos.", "support"),
    ([f"english_reading_review-q{n}" for n in range(115, 117)], ["p174-Im11.png"], "photo", "Imagem de um robô que acompanha o texto sobre robótica.", "support"),
    ([f"english_reading_review-q{n}" for n in range(117, 122)], ["p174-Im12.png"], "figure", "Imagem do Gorillaz que acompanha o texto sobre o álbum feito em iPad.", "support"),
    ([f"english_reading_review-q{n}" for n in range(123, 125)], ["p176-Im11.png"], "photo", "Fotografia da estudante que acompanha o estudo sobre rótulos de baixo teor de gordura.", "support"),
]


def source_crop(page_number: int, filename: str, source_crops: dict[str, dict[str, float]]) -> dict[str, float]:
    if filename == "p158-ad-panel.png":
        return {"x": 0.503, "y": 0.232, "width": 0.439, "height": 0.472}
    match = re.match(r"p(\d+)-([^.]+)\.", filename)
    if not match:
        return {"x": 0, "y": 0, "width": 1, "height": 1}
    pno = int(match.group(1))
    image_name = match.group(2)
    if f"p{pno:03d}-{image_name}" in source_crops:
        return source_crops[f"p{pno:03d}-{image_name}"]
    return {"x": 0, "y": 0, "width": 1, "height": 1}


def main() -> None:
    if not ASSET_DIR.exists():
        raise SystemExit(f"Asset directory not found: {ASSET_DIR}")
    source_crops: dict[str, dict[str, float]] = {}
    if PDF.exists():
        try:
            import pdfplumber

            with pdfplumber.open(PDF) as pdf:
                for page_number, page in enumerate(pdf.pages, 1):
                    for image in page.images:
                        name = str(image.get("name", "")).split(".")[0]
                        if not name:
                            continue
                        source_crops[f"p{page_number:03d}-{name}"] = {
                            "x": round(float(image["x0"]) / page.width, 6),
                            "y": round(float(image["top"]) / page.height, 6),
                            "width": round(float(image["x1"] - image["x0"]) / page.width, 6),
                            "height": round(float(image["bottom"] - image["top"]) / page.height, 6),
                        }
        except Exception:
            source_crops = {}
    assets: dict[str, dict] = {}
    for path in ASSET_DIR.iterdir():
        if not path.is_file():
            continue
        data = path.read_bytes()
        ext = path.suffix.lower()
        mime = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp"}.get(ext)
        if not mime:
            continue
        try:
            from PIL import Image
            with Image.open(path) as image:
                width, height = image.size
        except Exception as exc:
            raise SystemExit(f"Cannot inspect {path}: {exc}") from exc
        assets[path.name] = {
            "hash": hashlib.sha256(data).hexdigest(),
            "width": width,
            "height": height,
            "mimeType": mime,
        }

    rows: dict[str, list[dict]] = {}
    for question_ids, files, kind, alt, placement in GROUPS:
        for question_id in question_ids:
            descriptors = rows.setdefault(question_id, [])
            for index, filename in enumerate(files, 1):
                meta = assets.get(filename)
                if not meta:
                    raise SystemExit(f"Missing visual asset: {filename}")
                page_match = re.match(r"p(\d+)-", filename)
                page = int(page_match.group(1)) if page_match else 158
                asset_id = f"english-{meta['hash'][:16]}"
                descriptors.append({
                    "id": f"{question_id}-media-{index}",
                    "assetId": asset_id,
                    "assetUrl": f"/assets/questions/english/{filename}",
                    "kind": kind,
                    "placement": placement,
                    "page": page,
                    "crop": source_crop(page, filename, source_crops),
                    "width": meta["width"],
                    "height": meta["height"],
                    "mimeType": meta["mimeType"],
                    "altText": alt,
                    # Keep the UI caption neutral.  A source is added only
                    # when a specific artist/site credit has been verified;
                    # the compilation PDF is provenance, not image credit.
                    "caption": "Recorte visual da questão",
                    "hash": meta["hash"],
                    "confidence": 0.99,
                })

    OUT.write_text(
        "// Gerado por src/scratch/generate_english_visual_media.py — recortes visuais auditados.\n"
        "import type { QuestionMediaDescriptor } from '../types/importPipeline';\n\n"
        f"export const ENGLISH_QUESTION_MEDIA: Record<string, QuestionMediaDescriptor[]> = {json.dumps(rows, ensure_ascii=False, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"generated {sum(len(value) for value in rows.values())} descriptors for {len(rows)} questions")


if __name__ == "__main__":
    main()
