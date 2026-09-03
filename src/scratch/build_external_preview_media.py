"""Generate the two externally recovered Preview crops used by the importer.

The source PDFs are downloaded to the OS temp directory during an audit.  The
resulting WebP files are committed under public/assets so normal builds remain
offline and deterministic.
"""

from __future__ import annotations

from pathlib import Path

import pdfplumber


ROOT = Path(__file__).resolve().parents[2]
TEMP = Path.home() / "AppData" / "Local" / "Temp"
OUT = ROOT / "public" / "assets" / "english-preview"

ASSETS = [
    {
        "pdf": TEMP / "epcar-2022-official.pdf",
        "page": 4,
        "box": (28.4399985, 92.28000275, 296.76000600000003, 305.999996),
        "name": "ep-029a154daaf7-preview_reading_epcar-q83-external-epcar-2022.webp",
        "expected": (537, 427),
    },
    {
        "pdf": TEMP / "eear-2022-cod01.pdf",
        "page": 8,
        "box": (46.5, 372.0, 273.78, 491.28),
        "name": "ep-029a154daaf7-preview_adjectives-q25-external-eear-2022.webp",
        "expected": (455, 239),
    },
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item in ASSETS:
        if not item["pdf"].exists():
            raise SystemExit(f"PDF externo ausente: {item['pdf']}")
        with pdfplumber.open(str(item["pdf"])) as document:
            page = document.pages[item["page"] - 1]
            rendered = page.to_image(resolution=144).original
            scale_x = rendered.width / page.width
            scale_y = rendered.height / page.height
            x0, top, x1, bottom = item["box"]
            crop = rendered.crop((
                round(x0 * scale_x), round(top * scale_y),
                round(x1 * scale_x), round(bottom * scale_y),
            )).convert("RGB")
            if crop.size != item["expected"]:
                raise RuntimeError(f"Recorte inesperado para {item['name']}: {crop.size}")
            crop.save(OUT / item["name"], format="WEBP", quality=82, method=6)
            print(f"{item['name']}: {crop.width}x{crop.height}")


if __name__ == "__main__":
    main()
