import re
import json

# Gabaritos Oficiais
GABARITO_PDF_7 = {
    1: 'E', 2: 'C', 3: 'C', 4: 'A', 5: 'A', 6: 'B', 7: 'C', 8: 'B',
    9: 'C', 10: 'C', 11: 'D', 12: 'B', 13: 'B', 14: 'C', 15: 'A', 16: 'A',
    17: 'A', 18: 'B', 19: 'D', 20: 'B', 21: 'A', 22: 'A', 23: 'A', 24: 'B',
    25: 'C', 26: 'A', 27: 'D', 28: 'B', 29: 'D', 30: 'D', 31: 'A', 32: 'B',
    33: 'B', 34: 'C', 35: 'C', 36: 'E', 37: 'A', 38: 'D', 39: 'C', 40: 'E',
    41: 'A', 42: 'C', 43: 'A', 44: 'A', 45: 'B', 46: 'E', 47: 'D', 48: 'D',
    49: 'C', 50: 'E', 51: 'E', 52: 'A', 53: 'D', 54: 'A', 55: 'D', 56: 'C',
    57: 'E', 58: 'A', 59: 'A', 60: 'E', 61: 'E', 62: 'B', 63: 'E', 64: 'E',
    65: 'D', 66: 'D', 67: 'B', 68: 'A', 69: 'E', 70: 'D', 71: 'A', 72: 'D',
    73: 'E', 74: 'A', 75: 'E', 76: 'B', 77: 'A', 78: 'D', 79: 'B', 80: 'B',
    81: 'D', 82: 'A', 83: 'A', 84: 'D', 85: 'A', 86: 'E', 87: 'A', 88: 'C',
    89: 'D', 90: 'D', 91: 'E', 92: 'C'
}

GABARITO_PDF_16 = {
    1: 'D', 2: 'D', 3: 'D', 4: 'B', 5: 'A', 6: 'A', 7: 'C', 8: 'B',
    9: 'D', 10: 'A', 11: 'A', 12: 'B', 13: 'D', 14: 'D', 15: 'B', 16: 'B',
    17: 'C', 18: 'C', 19: 'B', 20: 'B', 21: 'D', 22: 'D', 23: 'D', 24: 'D',
    25: 'D', 26: 'C', 27: 'A', 28: 'B', 29: 'B', 30: 'D'
}

GABARITO_PDF_17 = {
    1: 'C', 2: 'A', 3: 'A', 4: 'B', 5: 'A', 6: 'A', 7: 'A', 8: 'D',
    9: 'A', 10: 'D', 11: 'B', 12: 'D', 13: 'C', 14: 'A', 15: 'D', 16: 'C',
    17: 'C', 18: 'C', 19: 'E', 20: 'A', 21: 'B', 22: 'C', 23: 'D', 24: 'C',
    25: 'B', 26: 'B', 27: 'B', 28: 'B', 29: 'B', 30: 'B'
}

def clean_portuguese(text):
    text = re.sub(r'--- PAGE \d+ ---', '', text)
    text = re.sub(r'Gustavo Filipe\s*-\s*gustavofilipe021@gmail\.com\s*-\s*IP:\s*[\d\.]+', '', text)
    text = re.sub(r'Essa quest[aã\uFFFD]o possui coment[aá\uFFFD]rio do professor no site\s*\d*', '', text)
    text = re.sub(r'Verbos AFA EN EFOMM\s+Acessar Lista', '', text)
    
    rep = [
        ('&cando', 'ficando'), ('&quei', 'fiquei'), ('&zera', 'fizera'), ('&cam', 'ficam'),
        ('&ca', 'fica'), ('&cou', 'ficou'), ('&car', 'ficar'), ('&caria', 'ficaria'),
        ('&cava', 'ficava'), ('&nais', 'finais'), ('&nal', 'final'), ('&nalmente', 'finalmente'),
        ('&m', 'fim'), ('&nos', 'finos'), ('&no', 'fino'), ('&nura', 'finura'),
        ('&ninha', 'fininha'), ('&nas', 'finas'), ('&nório', 'finório'), ('&nória', 'finória'),
        ('&ninho', 'fininho'), ('&lhos', 'filhos'), ('&lho', 'filho'), ('&lhas', 'filhas'),
        ('&lha', 'filha'), ('&lhote', 'filhote'), ('&lhotes', 'filhotes'), ('&leira', 'fileira'),
        ('&leiras', 'fileiras'), ('&la', 'fila'), ('&las', 'filas'), ('&gura', 'figura'),
        ('&guras', 'figuras'), ('&gurares', 'figurares'), ('&gurando', 'figurando'),
        ('&gurei', 'figurei'), ('&xar', 'fixar'), ('&xo', 'fixo'), ('&lólogo', 'filólogo'),
        ('&losó&co', 'filosófico'), ('&losó&cos', 'filosóficos'), ('&loso&a', 'filosofia'),
        ('&el', 'fiel'), ('&vela', 'fivela'), ('&ndava', 'findava'), ('&ndável', 'findável'),
        ('&ordes', 'fiordes'), ('&zeram', 'fizeram'), ('&zer', 'fizer'), ('&ssura', 'fissura'),
        ('&ccionalizada', 'ficcionalizada'), ('&ltros', 'filtros'), ('&nta', 'finta'),
        ('aCição', 'aflição'), ('aCitivo', 'aflitivo'), ('aCigiu', 'afligiu'),
        ('Cagrante', 'flagrante'), ('Cagelação', 'flagelação'), ('Cexibilidade', 'flexibilidade'),
        ('Cexão', 'flexão'), ('Cexionar', 'flexionar'), ('Cexionado', 'flexionado'),
        ('Cuminense', 'fluminense'), ('Corescia', 'florescia'), ('Cores', 'flores'),
        ('Coridos', 'floridos'), ('Coresta', 'floresta'), ('inCuente', 'influente'),
        ('inCuenciou', 'influenciou'), ('reCetido', 'refletido'), ('reCetem', 'refletem'),
        ('reCetir', 'refletir'), ('reCexos', 'reflexos'), ('descon&ança', 'desconfiança'),
        ('descon&ar', 'desconfiar'), ('descon&ado', 'desconfiado'), ('signi&ca', 'significa'),
        ('signi&cado', 'significado'), ('signi&cante', 'significante'),
        ('signi&cativamente', 'significativamente'), ('signi&cação', 'significação'),
        ('signi&cações', 'significações'), ('esferográ&ca', 'esferográfica'),
        ('fotográ&ca', 'fotográfica'), ('cinematográ&cas', 'cinematográficas'),
        ('historiográ&cas', 'historiográficas'), ('grá&cos', 'gráficos'),
        ('cientí&ca', 'científica'), ('cientí&cas', 'científicas'), ('cientí&co', 'científico'),
        ('cientí&cos', 'científicos'), ('cientí.co', 'científico'), ('especí&cas', 'específicas'),
        ('pro&ssional', 'profissional'), ('pro&ssionais', 'profissionais'), ('pro&ssão', 'profissão'),
        ('o&cio', 'ofício'), ('o&cial', 'oficial'), ('O&ciais', 'Oficiais'),
        ('o&cialmente', 'oficialmente'), ('su&ciente', 'suficiente'), ('insu&ciência', 'insuficiência'),
        ('di&culdade', 'dificuldade'), ('di&culdades', 'dificuldades'), ('di&cultada', 'dificultada'),
        ('inde&níveis', 'indefiníveis'), ('inde&nido', 'indefinido'), ('de&nido', 'definido'),
        ('de&nir', 'definir'), ('de&nição', 'definição'), ('de&nidora', 'definidora'),
        ('de&nitivo', 'definitivo'), ('de&nitivos', 'definitivos'), ('de&nitivas', 'definitivas'),
        ('bene&ciava', 'beneficiava'), ('grati&cado', 'gratificado'), ('grati&cante', 'gratificante'),
        ('glori&cados', 'glorificados'), ('glori&cada', 'glorificada'), ('magni&cência', 'magnificência'),
        ('magní&cas', 'magníficas'), ('catastró&cas', 'catastróficas'), ('desa&o', 'desafio'),
        ('desa&os', 'desafios'), ('con&ança', 'confiança'), ('con&ou', 'confiou'),
        ('con&rmados', 'confirmados'), ('con&rmar', 'confirmar'), ('certi&car', 'certificar'),
        ('identi&quei', 'identifiquei'), ('identi&cada', 'identificada'), ('identi&cação', 'identificação'),
        ('identi&car', 'identificar'), ('in&nito', 'infinito'), ('in&nita', 'infinita'),
        ('in&ndável', 'infindável'), ('in&nita', 'infinita'), ('ín&mos', 'ínfimos'),
        ('ín&mo', 'ínfimo'), ('ín&ma', 'ínfima'), ('so&sticado', 'sofisticado'),
        ('dél&cit', 'déficit'), ('dé&cit', 'déficit'), ('o&ício', 'ofício'),
        ('oqce', 'office'), ('home oqce', 'home office'),
        ('pequenos pai néis', 'pequenos painéis'), ('fati gado', 'fatigado'),
        ('fidalga', 'fidalga'), ('traços &nos', 'traços finos'), ('\ufffd', 'ã')
    ]
    for o, n in rep:
        text = text.replace(o, n)
    return text

def extract_options_from_bottom(block):
    # Match the last sequence of options: A, B, C, D, (E)
    # Strategy: Find lines matching ^([A-E])\s+ or ^([a-e])\)\s+ near the end of block
    lines = block.split('\n')
    
    opt_indices = []
    for idx, line in enumerate(lines):
        line_s = line.strip()
        m = re.match(r'^([A-Ea-e])[\)\.\s]\s*(.*)', line_s)
        if m:
            let = m.group(1).upper()
            opt_indices.append((idx, let, m.group(2)))
            
    # We want the longest contiguous or sequential subset of A, B, C, D, (E) ending near the bottom
    best_seq = []
    # Find last occurrence of 'A' that is followed by 'B', 'C', 'D'
    for i in range(len(opt_indices)):
        if opt_indices[i][1] == 'A':
            candidate = [opt_indices[i]]
            expected_next = 'B'
            for j in range(i+1, len(opt_indices)):
                if opt_indices[j][1] == expected_next:
                    candidate.append(opt_indices[j])
                    if expected_next == 'B': expected_next = 'C'
                    elif expected_next == 'C': expected_next = 'D'
                    elif expected_next == 'D': expected_next = 'E'
                    elif expected_next == 'E': expected_next = None
            if len(candidate) >= 4:
                best_seq = candidate
                
    if not best_seq:
        return None, None
        
    start_line_opt = best_seq[0][0]
    pre_text = "\n".join(lines[:start_line_opt]).strip()
    
    # Build options
    options = []
    for k in range(len(best_seq)):
        cur_line_idx = best_seq[k][0]
        cur_letter = best_seq[k][1]
        next_line_idx = best_seq[k+1][0] if k+1 < len(best_seq) else len(lines)
        opt_text = "\n".join(lines[cur_line_idx:next_line_idx]).strip()
        # strip leading letter
        opt_text = re.sub(r'^[A-Ea-e][\)\.\s]\s*', '', opt_text).strip()
        options.append((cur_letter, opt_text))
        
    return pre_text, options

print("Extract options from bottom defined")
