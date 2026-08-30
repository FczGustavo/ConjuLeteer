import re

def deep_clean_portuguese(text):
    if not text:
        return ""

    # Keep URLs opaque while fixing PDF font ligatures. Percent-encoded bytes
    # (e.g. %C3%A7) are valid URL content, not corrupted text.
    protected_urls = []
    protected_footnotes = []
    protected_publishers = []
    def protect_url(match_or_text):
        value = match_or_text.group(0) if hasattr(match_or_text, "group") else match_or_text
        protected_urls.append(value)
        return f"__CONJULETTER_URL_{len(protected_urls) - 1}__"
    # Normalize the common ``< https://...>`` spelling before shielding it.
    # The old inline lambda passed a Match object through another regex, which
    # made the intent hard to audit and could preserve the separating space.
    def normalize_angle_url(match):
        return protect_url(re.sub(r'<\s+(https?://)', r'<\1', match.group(0), flags=re.IGNORECASE))
    text = re.sub(r'<\s*https?://.*?>', normalize_angle_url, text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'https?://[^\s<>]+', protect_url, text, flags=re.IGNORECASE)

    # Asterisks also mark author footnotes in the source (Hamú**, *Rafael),
    # so protect those before interpreting remaining asterisks as ligatures.
    def protect_footnote(match):
        protected_footnotes.append(match.group(0))
        return f"__CONJULETTER_FOOTNOTE_{len(protected_footnotes) - 1}__"
    text = re.sub(r'(?<=[A-Za-zÀ-ÿ])\*{1,2}(?=\s|[,.;:!?)]|$)', protect_footnote, text)
    text = re.sub(r'(?<![A-Za-zÀ-ÿ])\*{1,2}(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ])', protect_footnote, text)

    # Publisher abbreviation present in a few citations.
    def protect_publisher(match):
        protected_publishers.append(match.group(0))
        return f"__CONJULETTER_PUBLISHER_{len(protected_publishers) - 1}__"
    text = re.sub(r'L&PM', protect_publisher, text, flags=re.IGNORECASE)
        
    # 1. Remove all watermark student IDs (e.g. 4000120490, 1385521)
    # Preserve pedagogical blanks such as ``______``. Only a full, very long
    # underscore line is a scanner/watermark separator.
    text = re.sub(r'^\s*_{20,}\s*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'\b\d{6,}\b', '', text)
    text = re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', '', text)
    # PDF text positioning can drop the blank after a punctuation mark. URLs
    # are already protected above, so this is safe for prose and citations.
    text = re.sub(r'([,;:!?])(?=[A-Za-zÀ-ÿ])', r'\1 ', text)
    # PDF positioning can glue a text label to its title (``Texto IA``).
    # Restore the heading boundary so the UI can identify the title cleanly.
    text = re.sub(
        r'\b(Texto|TEXTO|texto)\s*(I{1,3}(?!I)|[0-9]+)(?=[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ])',
        r'\1 \2\n',
        text,
    )
    # Paragraph markers from the source handout may be extracted without the
    # separating blank (``7§Nietzsche``). Keep the marker and restore the
    # readable boundary before the text is rendered in the question card.
    text = re.sub(r'(\d+§)(?=[A-Za-zÀ-ÿ])', r'\1 ', text)
    text = re.sub(r'\s*Essa quest[aã]o possui coment[aá]rio do professor no site\s*', ' ', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*Gustavo Filipe\s*-\s*[^\s]+@gmail\.com\s*-\s*IP:\s*[\d\.]+\s*', ' ', text, flags=re.IGNORECASE)

    # Several PDFs encode the ``fi`` ligature as a colon surrounded by a
    # space (``con: ança``, ``pernas : nas``).  The punctuation pass above
    # intentionally normalizes both ``:ança`` and ``: ança`` to the same
    # shape, so repair only fragments that are attested as split words.  A
    # whitelist is important here: ordinary prose uses ``: a``, ``: o`` and
    # similar punctuation legitimately and must remain unchanged.
    spaced_fi_fragments = [
        'rmativamente', 'cientemente', 'cativamente', 'cativo', 'ccionalizada', 'ccional', 'ccion',
        'nanceiras', 'gurinhas', 'guras', 'cultaria', 'namento', 'scalização',
        'gurando', 'lhinha', 'lha', 'cções', 'cações', 'ciências', 'camente', 'namente',
        'rmadas', 'rmado', 'rmava', 'rmou', 'rmação', 'rmente', 'rmar', 'rma',
        'rmeza', 'rme', 'rmativa', 'cadores', 'cados', 'cado', 'cativa', 'cativas',
        'caram', 'cavelmente', 'cável', 'ciente', 'cientes', 'cial',
        'ciava', 'cência', 'cia', 'cativamente', 'camente', 'camos', 'cava',
        'cam', 'cou', 'caz', 'cador', 'cados', 'cadas', 'ssional', 'ssionais', 'ssões', 'ável', 'cas', 'cante', 'cação', 'cações', 'ca',
        'cos', 'co', 'dências', 'des', 'lam', 'lis', 'lhos', 'lho', 'lhas',
        'los', 'losó', 'm', 'nadas', 'nida', 'nidos', 'nita', 'nitos', 'nição',
        'nições', 'nalidade', 'nal', 'nas', 'nta', 'la', 'lme', 'quei',
        'xas', 'zemos', 'nhos', 'rmeza', 'ança', 'ar', 'ante', 'cará', 'cando', 'car', 'culdades', 'culdade', 'cit', 'rme', 'nito', 'nitivo',
        'nanciava', 'nanciamento',
    ]
    spaced_fi_fragments = sorted(set(spaced_fi_fragments), key=len, reverse=True)
    spaced_fi_alt = '|'.join(re.escape(fragment) for fragment in spaced_fi_fragments)

    # A marker attached to the preceding word: ``con: ança`` -> ``confiança``.
    text = re.sub(
        rf'(?P<prefix>[A-Za-zÀ-ÿ]+):\s*(?P<fragment>{spaced_fi_alt})\b',
        lambda m: m.group('prefix') + 'fi' + m.group('fragment'),
        text,
        flags=re.IGNORECASE,
    )
    # A marker standing between two words: ``com : rmeza`` -> ``com firmeza``.
    text = re.sub(
        rf'(?P<prefix>[A-Za-zÀ-ÿ]+)\s+:\s+(?P<fragment>{spaced_fi_alt})\b',
        lambda m: m.group('prefix') + ' fi' + m.group('fragment'),
        text,
        flags=re.IGNORECASE,
    )
    # A leading marker: ``: nita`` -> ``finita`` / ``: la`` -> ``fila``.
    text = re.sub(
        rf'(?<![A-Za-zÀ-ÿ])(?P<marker>:)\s*(?P<fragment>{spaced_fi_alt})\b',
        lambda m: 'fi' + m.group('fragment'),
        text,
        flags=re.IGNORECASE,
    )

    # ``: o`` is common punctuation, so the few observed word splits with
    # this ending are repaired by their unmistakable lexical prefixes.
    spaced_fi_words = {
        'desa: o': 'desafio',
        'desa: O': 'desafio',
        'aa: rmativa': 'a afirmativa',
        'a: rmação': 'afirmação',
        'a: rmações': 'afirmações',
        'gra: a': 'grafia',
        'Gra: a': 'Grafia',
        'per: l': 'perfil',
        'con: áveis': 'confiáveis',
        'eu: z': 'eu fiz',
        'rá: a': 'ráfia',
        'minha: ta': 'minha fita',
        'único: ador': 'único fiador',
        'a: nalmente': 'a finalmente',
        'agarra: nalmente': 'agarra finalmente',
        'modo: nanceiramente': 'modo financeiramente',
    }
    for bad, good in spaced_fi_words.items():
        text = text.replace(bad, good)
    text = (text.replace('ensaios: losóficos', 'ensaios filosóficos')
                 .replace('Ensaios: losóficos', 'Ensaios filosóficos')
                 .replace('Filoso: a', 'Filosofia')
                 .replace('filoso: a', 'filosofia'))
    
    # 2. Fix specific 'fl' words with * or W
    fl_words = {
        'con*ito': 'conflito', 'con*itos': 'conflitos',
        're*exo': 'reflexo', 're*exos': 'reflexos', 're*exão': 'reflexão',
        'in*uenciou': 'influenciou', 'in*uencia': 'influência', 'in*uência': 'influência',
        'in*uente': 'influente', 'in*uxo': 'influxo',
        'a*ito': 'aflito', 'a*itos': 'aflitos', 'a*ição': 'aflição',
        '*ores': 'flores', '*or': 'flor', '*oresta': 'floresta',
        'inWuenciou': 'influenciou', 'inWuencia': 'influência', 'inWuência': 'influência',
        'inWuente': 'influente', 'inWuxo': 'influxo',
        'conWito': 'conflito', 'conWitos': 'conflitos',
        'ReWexo': 'Reflexo', 'reWexo': 'reflexo', 'reWexos': 'reflexos',
        'aWito': 'aflito', 'aWição': 'aflição',
        'Wores': 'flores', 'Wor': 'flor'
    }
    for bad, good in fl_words.items():
        text = text.replace(bad, good)
        text = text.replace(bad.capitalize(), good.capitalize())

    # A second private-font mapping used ``]`` for the same ``fl`` ligature.
    bracket_ligatures = {
        're]exo': 'reflexo', 're]exão': 'reflexão',
        're]etido': 'refletido', 're]etida': 'refletida',
        'con]ito': 'conflito', 'con]itos': 'conflitos',
        'a]ição': 'aflição', 'a]ito': 'aflito', 'a]itos': 'aflitos',
        ']or': 'flor', ']ores': 'flores', ']oresta': 'floresta',
        ']orestas': 'florestas', ']orezinhas': 'florezinhas',
        ']exionada': 'flexionada', ']exionado': 'flexionado',
    }
    for bad, good in bracket_ligatures.items():
        text = text.replace(bad, good)
        text = text.replace(bad.capitalize(), good.capitalize())

    # Other font-encoding substitutions observed in the source PDFs.
    text = re.sub(r'([A-Za-zÀ-ÿ])[&:7]([A-Za-zÀ-ÿ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\["“])[&:7]([A-Za-zÀ-ÿ]+)', r'\1fi\2', text)
    text = re.sub(r'([A-Za-zÀ-ÿ])5([A-Za-zÀ-ÿ])', r'\1fl\2', text)
    text = re.sub(r'(^|[\s\(\["“])5([A-Za-zÀ-ÿ]+)', r'\1fl\2', text)
    fl_substitutions = {
        'reCetido': 'refletido', 'reCetida': 'refletida',
        'Cores': 'flores', 'Corido': 'florido', 'Coridos': 'floridos',
        'Corescia': 'florescia', 'conEitante': 'conflitante',
        'conEitantes': 'conflitantes',
    }
    for bad, good in fl_substitutions.items():
        text = text.replace(bad, good)

    # The PDFs use several fallback glyphs for the ``fl`` ligature. PDF.js
    # exposes the same glyph as P/W/E/N/C depending on the embedded font.
    # These roots are unambiguous in Portuguese and occur repeatedly in the
    # reading passages (reflexo, refletir, afligir, conflito, influência).
    text = re.sub(r'\bre[PNWEC]ex', 'reflex', text, flags=re.IGNORECASE)
    text = re.sub(r'\bre[PNWEC]et', 'reflet', text, flags=re.IGNORECASE)
    text = re.sub(r'\bre[PNWEC]it', 'reflit', text, flags=re.IGNORECASE)
    text = re.sub(r'\b[PNWEC]ex(?=ibilidade|ibiliza)', 'flex', text, flags=re.IGNORECASE)
    text = re.sub(r'\ba[PNWEC](?=(?:ig|ição|itivo|ige|igiu|igia|itos))', 'afl', text, flags=re.IGNORECASE)
    text = re.sub(r'\bcon[PNWEC]it', 'conflit', text, flags=re.IGNORECASE)
    # ``inflamada`` appears with the ligature glyph between ``in`` and
    # ``fl``; keep this form separate from the ``influ-`` family.
    text = re.sub(r'\bin[PNWEC](?=amada)', 'infl', text, flags=re.IGNORECASE)
    text = re.sub(r'\bin[PNWEC](?=(?:u|uen|uir|uindo|uência|uente))', 'influ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bsupér[PNWEC]uo', 'supérfluo', text, flags=re.IGNORECASE)
    text = re.sub(r'\bEora\b', 'flora', text, flags=re.IGNORECASE)
    text = re.sub(r'\bEor(?:es|ezinhas|esta|estas)?\b', lambda m: 'fl' + m.group(0)[1:], text, flags=re.IGNORECASE)
    text = re.sub(r'\bEutuação\b', 'flutuação', text, flags=re.IGNORECASE)
    text = re.sub(r'\b(?:Net|net)Eix\b', 'Netflix', text)
    text = re.sub(r'\b[WE]uida\b', 'fluida', text, flags=re.IGNORECASE)
    text = re.sub(r'\bEagrante\b', 'flagrante', text, flags=re.IGNORECASE)
    text = re.sub(r'\bWagrante\b', 'flagrante', text, flags=re.IGNORECASE)
    text = re.sub(r'\bCexion(ad[ao]|ar|ão)\b', lambda m: 'flexion' + m.group(1), text, flags=re.IGNORECASE)

    # Repeated OCR/font substitutions from the military question sheets. The
    # hyphen in these words is not punctuation: it replaces the ``fi``
    # ligature (or a missing syllable) in the embedded article text.
    broken_fi_words = {
        'A-nal': 'Afinal', 'a-nal': 'afinal',
        'a-rma': 'afirma', 'a-rmava': 'afirmava',
        'biogra-a': 'biografia', 'catastró-cas': 'catastróficas',
        'cientí-ca': 'científica', 'cientí-cos': 'científicos',
        'cientí.co': 'científico', 'cinegra-stas': 'cinegrafistas',
        'cinematográ-cas': 'cinematográficas',
        'classi-ca': 'classifica', 'classi-cação': 'classificação',
        'classi-cações': 'classificações', 'classi-cados': 'classificados',
        'classi-cam': 'classificam', 'con-dências': 'confidências',
        'con-guração': 'configuração', 'con-rmados': 'confirmados',
        'con-áveis': 'confiáveis', 'di-cultando': 'dificultando',
        'geográ-cas': 'geográficas', 'grati-cado': 'gratificado',
        'identi-cada': 'identificada', 'identi-car': 'identificar',
        'in-nito': 'infinito', 'insu-ciência': 'insuficiência',
        'magni-cência': 'magnificência', 'modi-cador': 'modificador',
        'modi-cação': 'modificação', 'o-cial': 'oficial',
        'o-cialmente': 'oficialmente', 'pro-ssional': 'profissional',
        'pro-ssionais': 'profissionais', 'rea-rmou': 'reafirmou',
        'signi-ca': 'significa', 'signi-cado': 'significado',
        'signi-cativamente': 'significativamente',
        'So-sticado': 'Sofisticado', '-losó-co': 'filosófico',
        'con-rmados': 'confirmados', 'con-guração': 'configuração',
        'Numinense': 'Fluminense', 'influubadores': 'incubadores',
        'influursões': 'incursões', 'A7as': 'Ativas', 'ADsica': 'física',
        'A3o': 'ação', 'AAncias-humanas': 'Ciências-humanas',
        'A1vel': 'ível', 'ADsica-mesmo': 'física mesmo',
        'a*velaram-Ihe': 'afivelarem-lhe',
        # Same private ``fi`` glyph in words whose surrounding letters are
        # too short for the generic rule above.
        'O-ciais': 'Oficiais', 'O-cial': 'Oficial',
        'grá-cos': 'gráficos', 'de-nidas': 'definidas',
        'al-nete': 'alfinete', 'ín-mo': 'ínfimo',
        'en-ou': 'enfiou', 'des-les': 'desfiles',
        'su-xo': 'sufixo', 'de-ciência': 'deficiência',
        'dé-cit': 'déficit', 'en-m': 'enfim',
        'a-rmou': 'afirmou',
        'especí-co': 'específico',
        'especí-cas': 'específicas',
        'bene-ciava': 'beneficiava',
        'corpori-cada': 'corporificada',
        'de-nia': 'definia',
        'descon-ança': 'desconfiança',
        'descon-ar': 'desconfiar',
        'diversi-cadas': 'diversificadas',
        'garra-nha': 'garrafinha',
        '-gurando': 'figurando',
        'inde-níveis': 'indefiníveis',
        '-lmes': 'filmes',
        '-lósofo': 'filósofo',
        '-nalidade': 'finalidade',
        '-sionomia': 'fisionomia',
        'pernas -nas': 'pernas finas',
        'eu -co': 'eu fico',
        'de -carem': 'de ficarem',
        'redes -que': 'redes fique',
    }
    for bad, good in broken_fi_words.items():
        text = text.replace(bad, good)
        text = text.replace(bad.lower(), good.lower())

    # Private-font spacing artifacts that join two ordinary words.
    text = re.sub(r'\b[Ee]o\b', lambda m: ('E o' if m.group(0)[0].isupper() else 'e o'), text)
    text = re.sub(r'\b[Ee]a\b', lambda m: ('E a' if m.group(0)[0].isupper() else 'e a'), text)
    text = re.sub(r'(?<=[A-Za-zÀ-ÿ])[ \t]+ea\b', ' e a', text)
    text = re.sub(r'(?<=[A-Za-zÀ-ÿ])[ \t]+eo\b', ' e o', text)
    text = re.sub(r'\béa\b', 'é a', text, flags=re.IGNORECASE)
    text = re.sub(r'\béo\b', 'é o', text)
    text = re.sub(r'\beéa\b', 'e a', text)
    text = re.sub(r'\beéo\b', 'e o', text)
    text = re.sub(r'\bso\b', 'só', text, flags=re.IGNORECASE)
    text = re.sub(r'\bJa\b', 'Já', text)
    text = re.sub(r'\bas vezes\b', 'às vezes', text, flags=re.IGNORECASE)
    text = re.sub(r'\baguas\b', 'águas', text, flags=re.IGNORECASE)
    text = re.sub(r'\bOque\b', 'O que', text)
    text = text.replace('pai.Ainda', 'pai. Ainda').replace('53.Brasil', '53. Brasil')
    text = (text.replace('influu', 'influ')
                 .replace('Influumbências', 'Incumbências')
                 .replace('influumbências', 'incumbências')
                 .replace('fundamentaispara', 'fundamentais para')
                 .replace('seestabelece', 'se estabelece')
                 .replace('empurrandoo', 'empurrando-o')
                 .replace('ooficial', 'o oficial'))
    text = (text.replace('que: ela sentiu pena', 'que ela sentiu pena')
                 .replace('influênciar', 'influenciar')
                 .replace('influênciadores', 'influenciadores')
                 .replace('difinitivamente', 'definitivamente')
                 .replace('previlégios', 'privilégios')
                 .replace('herbâceas', 'herbáceas')
                 .replace('serumano', 'ser humano')
                 .replace('Cuminense', 'Fluminense')
                 .replace('Balltico', 'Báltico')
                 .replace('Saíamina', 'Salamina')
                 .replace('home oace', 'home office')
                 .replace('home opce', 'home office')
                 .replace('Poresta', 'Floresta')
                 .replace('avi daé uma grande', 'a vida é uma grande')
                 .replace('trecho aqu ese referem', 'trecho a que se referem')
                 .replace('flordes da Noruega', 'fiordes da Noruega')
                 .replace('industria aterradora, galpões e torres, fabrica de monoxido pelas chamines',
                          'indústria aterradora, galpões e torres, fábrica de monóxido pelas chaminés')
                 .replace('pode ser retribuido muitos anos', 'pode ser retribuído muitos anos')
                 .replace('Voltei-me e\nVI. que se tratava', 'Voltei-me e\nvi que se tratava')
                 .replace('— E menino, corrigiu ela', '— É menino, corrigiu ela'))
    text = re.sub(r'\beà\b', 'e à', text, flags=re.IGNORECASE)
    text = text.replace('Nomega', 'Noruega')
    text = text.replace('fime ao cabo', 'fim e ao cabo')
    text = re.sub(r'\bEmu\s+mad\s+as\b', 'Em uma das', text)
    text = re.sub(r'\bpresença\s+deu\s+m\b', 'presença de um', text)
    text = re.sub(r'\bou\s+ae\b', 'ou a e', text)
    text = re.sub(r'\beF\s+\(', 'e F (', text)
    text = re.sub(r'\beA\s+outra\b', 'e A outra', text)
    text = re.sub(r'\beD\.\s+Pedro\b', 'e D. Pedro', text)
    text = re.sub(r'\baR\$', 'a R$', text)
    text = text.replace('filosofiae história', 'filosofia e história')
    text = text.replace('FranklSperber', 'Frankl Sperber')
    text = text.replace('ByungChul', 'Byung-Chul')
    text = text.replace('LfiP', 'L&PM')
    text = (text.replace('filoso-aa', 'filosofia a')
                 .replace('filoso-a', 'filosofia')
                 .replace('Filoso-a', 'Filosofia')
                 .replace('Pací-co', 'Pacífico')
                 .replace('fotográ-ca', 'fotográfica')
                 .replace('esferográ-ca', 'esferográfica')
                 .replace('en-ar', 'enfiar')
                 .replace('descon-ado', 'desconfiado')
                 .replace('-cando', 'ficando')
                 .replace('-zera', 'fizera')
                 .replace('-cou', 'ficou'))
    text = re.sub(r'\beafirmou\b', 'e afirmou', text)
    text = (text.replace('Norescia', 'florescia')
                 .replace('Nores', 'flores')
                 .replace('Noresta', 'floresta')
                 .replace('Nagrante', 'flagrante')
                 .replace('Cexão', 'flexão')
                 .replace('Webste', 'Webster')
                 .replace('oqce', 'office')
                 .replace('reduzindo-aa', 'reduzindo-a a')
                 .replace('sobpseudônimo', 'sob pseudônimo')
                 .replace('trato:-Só', 'trato: — Só')
                 .replace('poderíam', 'poderiam')
                 .replace('Á lvaro', 'Álvaro')
                 .replace('A\u0301 lvaro', 'Álvaro')
                 .replace('Catarina 2a', 'Catarina II')
                 .replace('LATINOS- AMERICANOS', 'LATINOS-AMERICANOS')
                 .replace('Eà noite', 'E à noite')
                 .replace('eà noite', 'e à noite')
                 .replace('Websterr', 'Webster'))
    text = re.sub(r'(?<=[a-záéíóúâêôûãõç])\.(?=[A-ZÁÉÍÓÚÂÊÔÛÃÕÇ])', '. ', text)
    text = text.replace('seleção- natural', 'seleção natural')
    # PDF line wrapping occasionally leaves a space after a hyphen.  Join
    # only multi-letter compounds; one-letter list markers (``I-``/``II-``)
    # and syllabification exercises remain untouched.
    text = re.sub(r'([A-Za-zÀ-ÿ]{2,})-\s+(?=[a-záéíóúâêôûãõç])', r'\1-', text)
    text = re.sub(r'([A-Za-zÀ-ÿ]{2,})-\s+-', r'\1-', text)
    text = text.replace('ajunto...Estavam', 'ajunto... Estavam')
    text = text.replace('TÁVOLA,Artur', 'TÁVOLA, Artur')
    text = text.replace('MEIRELES,Cecília', 'MEIRELES, Cecília')
    text = text.replace('Isabel;Vassalo', 'Isabel; Vassalo')
    text = text.replace('jornal-de-ebates', 'jornal-debates')
    text = text.replace('-losó-ca', 'filosófica')
    text = text.replace('di-culdade', 'dificuldade').replace('di-culdades', 'dificuldades')
    text = text.replace('influumbida', 'incumbida')
    text = text.replace('pior nado estamos', 'pior não estamos')
    text = text.replace('BE, contrariando', 'E, contrariando')
    text = text.replace('texto†', 'texto?').replace('mensagem†', 'mensagem?')
    text = text.replace(' ~ incluindo', ' — incluindo')
    text = text.replace('confortável zinho', 'confortavelzinho')
    text = re.sub(r'(?<![A-Za-zÀ-ÿ])\.lhos\b', 'filhos', text)
    text = re.sub(r'(?<![A-Za-zÀ-ÿ])\.m\b', 'fim', text)
    text = re.sub(r'\bS6\b', 'Só', text, flags=re.IGNORECASE)
    text = re.sub(r'\bSO\b', 'Só', text)
    text = re.sub(r'\bs6\b', 'só', text)
    text = re.sub(r'\bJ&€\s+0\b', 'Já o', text)
    text = text.replace('¢ €', 'é').replace('¢€', 'é').replace('€', 'é')
    text = text.replace(' ¢ ', ' — ')
    text = re.sub(r'\b0(?=\s+(?:afivelaram|afivelarem|termo|Rei|dia|que))', 'O', text, flags=re.IGNORECASE)
    text = re.sub(r'\b0(?=\s+ar\b)', 'O', text, flags=re.IGNORECASE)
    text = text.replace('afivelaram-Ihe', 'afivelarem-lhe')
    text = text.replace('eéa', 'e é a')
    text = text.replace('Respondia-me a todas as perguntas', 'Respondiam-lhe a todas as perguntas')
    text = text.replace('pouco mais de duas horas, O menino', 'pouco mais de duas horas. O menino')
    text = text.replace('implante, explodido', 'impante, explodido')
    text = text.replace('necessidades:[...]', 'necessidades. [...]')
    text = text.replace('desconta-se - certo', 'desconter-se — certo')
    text = text.replace('Amanha', 'Amanhã')
    text = text.replace('circuntristeza: o um horizonte', 'circuntristeza: o horizonte')
    text = text.replace('o velame do-campo', 'o velame-do-campo')
    text = re.sub(r'\bo\s+velame\s+do-campo', 'o velame-do-campo', text, flags=re.IGNORECASE)
    text = text.replace('o encantamento morte e sem pássaros', 'o encantamento morto e sem pássaros')
    text = text.replace('Sé no grão nulo', 'Só no grão nulo')
    text = text.replace('lá um menino', 'Ia um menino')
    text = text.replace('Enquanto mal vacilava de manhã', 'Enquanto mal vacilava a manhã')
    text = text.replace('alguma forma, nele, trabalhava por arraigar raízes, aumentar-lhe a alma', 'alguma força, nele, trabalhava por arraigar raízes, aumentar-lhe alma')
    text = re.sub(r'alguma forma,\s+nele, trabalhava por arraigar\s+raízes, aumentar-lhe a alma', 'alguma força, nele, trabalhava por arraigar raízes, aumentar-lhe alma', text)
    text = re.sub(r'desconta-\s*se\s+-\s*certo', 'desconter-se — certo', text)
    text = text.replace('Movia-o um dedo', 'Movia-o um ódio')
    text = text.replace('eram um monte demais', 'eram um montão demais')
    text = text.replace('um instante sd', 'um instante só')
    text = re.sub(r'reflit(?:ância|ência)\s+[4¢€]?\s*curiosidade', 'renúncia à curiosidade', text, flags=re.IGNORECASE)
    text = text.replace('balança infindável', 'balança infidelíssima')
    text = text.replace('a cabeça possuía laivos', 'a cabeça possuía laivos')
    text = text.replace('Grugulejar, sacudindo', 'Grugulejou, sacudindo')
    text = text.replace('grugulejargrufo', 'grugrulhar grufo')
    text = text.replace('grugrulhargrufo', 'grugrulhar grufo')
    text = text.replace('Mesmo O afivelarem-lhe', 'Mesmo o afivelarem-lhe')
    text = text.replace(', O ar', ', o ar')
    text = (text.replace('Eé assim', 'E assim')
                 .replace('eé assim', 'e é assim')
                 .replace('Eé por', 'É por')
                 .replace('eé por', 'e é por'))
    text = text.replace('o perfume em ativação', 'o perfume em açúcar')
    text = text.replace('a noitinha é sempre e sofrido', 'a noitinha é sempre e sofrido')
    text = text.replace('O silêncio da sala de seus guardados', 'O silêncio saía de seus guardados')
    text = text.replace('tão bis-viu', 'tão bis-viu')
    text = text.replace('afivelaram-Ihe', 'afivelarem-lhe')
    text = text.replace('emq uea', 'em que a').replace('emq ueo', 'em que o').replace('emq ues', 'em que se')
    text = text.replace('aafirmativa', 'a afirmativa')
    text = (text.replace('refletição', 'repetição')
                 .replace('refleticao', 'repeticao')
                 .replace('signi(cativa', 'significativa')
                 .replace('signicativa', 'significativa'))

    # A few URLs inherited the same glyph corruption. These are citations, so
    # repair only the known path fragments rather than altering URL syntax.
    text = text.replace('geogra*a', 'geografia').replace('geogra:a', 'geografia')
    text = text.replace('descon*ar', 'desconfiar').replace('descon:ar', 'desconfiar')
    text = text.replace('/07/*m-', '/07/fim-').replace('/07/:m-', '/07/fim-')

    # Older sheets sometimes emitted the ligature marker as a leading hyphen.
    # These lexical repairs are unambiguous; normal compounds and syllable
    # separators (such as ``trans - a - tlân - ti - co``) remain untouched.
    leading_fi = {
        '-car': 'ficar', '-cam': 'ficam', '-lho': 'filho', '-lhos': 'filhos',
        '-lhas': 'filhas', '-loso-aa': 'filosofia a', '-loso-a': 'filosofia',
        '-loso': 'filoso', '-quei': 'fiquei', '-ca': 'fica',
        '-m': 'fim', '-lme': 'filme', '-ordes': 'fiordes', '-nal': 'final',
        '-nalmente': 'finalmente', '-caria': 'ficaria', '-carias': 'ficarias',
        '-cava': 'ficava', '-namente': 'finamente', '-ninha': 'fininha',
        '-gura': 'figura', '-ntas': 'fintas', '-quem': 'fiquem',
        '-carmos': 'ficarmos', '-nado': 'finado', '-zer': 'fizer',
        '-leiras': 'fileiras', '-z': 'fiz', '-ngir': 'fingir', '-cas': 'ficas',
        '-la': 'fila', '-el': 'fiel',
    }
    for bad, good in leading_fi.items():
        text = re.sub(rf'(?<![A-Za-zÀ-ÿ]){re.escape(bad)}(?=\b)', good, text, flags=re.IGNORECASE)

    # Character substitutions that are unambiguous in the affected sheets.
    text = re.sub(r'\bS6\b', 'Só', text)
    text = re.sub(r'\bSO\b', 'Só', text)
    text = re.sub(r'\bJ&€\s+0\b', 'Já o', text)
    text = re.sub(r'\b0(?=\s+(?:afivelaram|afivelarem|termo|Rei|dia|que))', 'O', text, flags=re.IGNORECASE)
    text = re.sub(r'\b6\s+que\b', 'é que', text, flags=re.IGNORECASE)
    text = re.sub(r'\b6\s*\n\s*sempre\b', 'é\nsempre', text, flags=re.IGNORECASE)
    text = text.replace('reflitância 4 curiosidade', 'renúncia à curiosidade')
    text = text.replace('pensamento.la.', 'pensamento. Ia.')
    text = text.replace('açorçoo', 'acorçôo').replace('Açorçoo', 'Acorçôo')
    text = text.replace('O voo ja ser', 'O voo ia ser').replace('O voo já ser', 'O voo ia ser')
    text = text.replace('construéda', 'construía').replace('Construéda', 'Construía')
    text = text.replace('Salam ainda', 'Saíam ainda').replace('Salam', 'Saíam')
    text = text.replace('confortável zinho', 'confortavelzinho')
    text = text.replace('a magica monotonia', 'a mágica monotonia')
    text = text.replace('curta distancia', 'curta distância')
    text = re.sub(r'\barvores\b', 'árvores', text)

    # A handful of malformed glyphs occur at the beginning of a word where
    # the surrounding letters are not enough for the generic rule below.
    leading_ligatures = {
        '7nalmente': 'finalmente', '7lho': 'filho', '7lhas': 'filhas',
        '7car': 'ficar', '7zera': 'fizera', '7cando': 'ficando',
        '7quei': 'fiquei', '7gura': 'figura', '7lme': 'filme',
        '7nura': 'finura', '7el': 'fiel', '7lote': 'filote',
        '7no': 'fino', '7tinha': 'fitinha',
    }
    for bad, good in leading_ligatures.items():
        text = re.sub(rf'(?<![A-Za-zÀ-ÿ]){re.escape(bad)}\b', good, text, flags=re.IGNORECASE)
        
    # 3. Universal ligature replacement for * inside or starting words (always 'fi')
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])\*([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\[\"\'“])\*([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)
    
    # 4. Universal ligature replacement for % inside words (always 'fi')
    text = re.sub(r'([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])%([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ])', r'\1fi\2', text)
    text = re.sub(r'(^|[\s\(\[\"\'“])%([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)

    # Other private-font ligature fallbacks. Only replace a glyph when it is
    # part of a word; normal punctuation, percentages and footnote numbers
    # remain untouched.
    letters = r'a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ'
    text = re.sub(rf'([{letters}])7(?=[{letters}])', r'\1fi', text)
    text = re.sub(rf'(^|[^\w])7(?=[{letters}])', r'\1fi', text)
    text = re.sub(rf'([{letters}])[:=]([{letters}])', r'\1fi\2', text)
    text = re.sub(rf'(^|[^\w])[:=]([{letters}])', r'\1fi\2', text)
    text = re.sub(rf'([{letters}])&([{letters}])', r'\1fi\2', text)
    text = re.sub(rf'(^|[^\w])&([{letters}])', r'\1fi\2', text)
    
    # 5. Universal ligature replacement for @ inside words (except neutral pronouns like tod@s)
    def clean_at(match):
        w = match.group(0)
        if w.lower() in ['tod@s', 'el@s', 'amig@s', 'menin@s']:
            return w
        return w.replace('@', 'fi')
        
    text = re.sub(r'\b[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+@[a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+\b', clean_at, text)
    text = re.sub(r'(^|[\s\(\[\"\'“])@([a-zA-ZáéíóúâêîôûãõçÁÉÍÓÚÂÊÎÔÛÃÕÇ]+)', r'\1fi\2', text)
    
    # 6. Fix broken split letters at start of word
    text = re.sub(r'\ba\s+s\s+eguinte\b', 'a seguinte', text, flags=re.IGNORECASE)
    text = re.sub(r'\bs\s+eguinte\b', 'seguinte', text, flags=re.IGNORECASE)
    text = re.sub(r'\bc\s+lassi', 'classi', text, flags=re.IGNORECASE)
    text = re.sub(r'\bp\s+roparox', 'proparox', text, flags=re.IGNORECASE)
    text = re.sub(r'\bp\s+arox', 'parox', text, flags=re.IGNORECASE)
    text = re.sub(r'\bo\s+xítona', 'oxítona', text, flags=re.IGNORECASE)
    text = re.sub(r'\bd\s+erivação', 'derivação', text, flags=re.IGNORECASE)
    text = re.sub(r'\bp\s+refix', 'prefix', text, flags=re.IGNORECASE)
    text = re.sub(r'\bs\s+ufix', 'sufix', text, flags=re.IGNORECASE)
    text = re.sub(r'\bc\s+omposição', 'composição', text, flags=re.IGNORECASE)
    text = re.sub(r'\bs\s+ubstantiv', 'substantiv', text, flags=re.IGNORECASE)
    text = re.sub(r'\ba\s+djetiv', 'adjetiv', text, flags=re.IGNORECASE)
    text = re.sub(r'\bp\s+ronome', 'pronome', text, flags=re.IGNORECASE)
    text = re.sub(r'\bq\s+ue\b', 'que', text, flags=re.IGNORECASE)
    text = re.sub(r'\bp\s+ara\b', 'para', text, flags=re.IGNORECASE)
    text = re.sub(r'\bd\s+e\b', 'de', text, flags=re.IGNORECASE)

    # 7. Clean spacing
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()
    for index, url in enumerate(protected_urls):
        # A URL may contain a line wrap in the PDF and can also carry the
        # same private-font glyph used in prose. Join its wrapped pieces and
        # repair only the known citation slugs.
        url = re.sub(r'\s+', '', url)
        url = (url.replace('geogra*a', 'geografia').replace('geogra:a', 'geografia')
               .replace('descon*ar', 'desconfiar').replace('descon:ar', 'desconfiar')
               .replace('/07/*m-', '/07/fim-').replace('/07/:m-', '/07/fim-'))
        text = text.replace(f"__CONJULETTER_URL_{index}__", url)
    for index, marker in enumerate(protected_footnotes):
        text = text.replace(f"__CONJULETTER_FOOTNOTE_{index}__", marker)
    for index, publisher in enumerate(protected_publishers):
        text = text.replace(f"__CONJULETTER_PUBLISHER_{index}__", publisher)
    # Plain URLs that were split by a PDF line break are only partially
    # shielded by the tokeniser; apply the same narrow repair after restore.
    text = (text.replace('geogra*a', 'geografia').replace('geogra:a', 'geografia')
            .replace('descon*ar', 'desconfiar').replace('descon:ar', 'desconfiar')
            .replace('/07/*m-', '/07/fim-').replace('/07/:m-', '/07/fim-')
            .replace('jornal-de-ebates', 'jornal-debates'))
    # The one-letter spacing normalizer can turn ``a a*rmativa`` into
    # ``aa*rmativa`` before the ligature pass.  Normalize that specific
    # construction after all glyph substitutions so it cannot reappear.
    text = text.replace('aa*rmativa', 'a afirmativa').replace('aafirmativa', 'a afirmativa')
    # A publisher token repaired before the universal ``&`` ligature pass can
    # be transformed back into ``LfiPM``; restore its canonical spelling last.
    text = text.replace('LfiPM', 'L&PM')
    # Final-stage repairs for forms produced only after the generic private-
    # glyph passes above. They must remain here so an earlier substitution
    # cannot recreate the corruption later in the pipeline.
    text = (text.replace('ensaios: losóficos', 'ensaios filosóficos')
                 .replace('Ensaios: losóficos', 'Ensaios filosóficos')
                 .replace('ooficial', 'o oficial')
                 .replace('Saíamina', 'Salamina')
                 .replace('monoxido', 'monóxido')
                 .replace('chamines', 'chaminés')
                 .replace('retribuido', 'retribuído')
                 .replace('Mobilidade Sustentáve\n', 'Mobilidade Sustentável\n'))
    text = re.sub(r':\s*loso:\s*a\b', ' filosofia', text, flags=re.IGNORECASE)
    text = re.sub(r':\s*lósofo\b', 'filósofo', text, flags=re.IGNORECASE)
    # Remove author footnote markers that otherwise leak as literal Markdown
    # delimiters in the rendered support text. These are source annotations,
    # not emphasis (the corresponding author names are already present).
    text = (text.replace('Denise Hamú**', 'Denise Hamú')
                 .replace('**Denise Hamú', 'Denise Hamú')
                 .replace('Rafael Zavala*', 'Rafael Zavala')
                 .replace('*Rafael Zavala', 'Rafael Zavala'))
    # PDF.js maps the line-reference glyph (ℓ.) to four asterisks in one
    # scanned item. Restore the conventional reference notation.
    text = text.replace('(****. 34-36)', '(ℓ. 34-36)')
    # PDF.js can leave one isolated bold delimiter when a highlighted run
    # crosses a line or an option marker. Remove only the unmatched delimiter
    # so it never leaks as literal ``**`` in the rendered question.
    while text.count('**') % 2:
        stray = re.search(r'\*\*(?=\s|$)', text)
        if stray is None:
            stray = re.search(r'(?<!\S)\*\*', text)
        if stray is None:
            break
        text = text[:stray.start()] + text[stray.end():]
    return text
