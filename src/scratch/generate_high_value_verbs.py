"""Compatibilidade para o antigo comando de expansão de verbos.

O gerador oficial foi movido para ``scripts/build_expanded_verbs.py`` para
manter a saída dentro de ``src/data`` e incluir a frequência observada nos
PDFs. Este wrapper preserva o caminho histórico sem criar uma segunda fonte
de paradigmas.
"""

from pathlib import Path
import runpy


ROOT = Path(__file__).resolve().parents[2]
runpy.run_path(str(ROOT / "scripts" / "build_expanded_verbs.py"), run_name="__main__")
