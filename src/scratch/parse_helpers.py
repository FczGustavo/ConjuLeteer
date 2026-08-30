import pypdf
import os
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Import helper functions from our existing parser
sys.path.insert(0, r"C:\Users\gusta\Documents\ConjuLetter\src\scratch")
from fix_spaces import fix_broken_spaces

pdf_dir = r"c:\Users\gusta\Documents\ConjuLetter\lists"

def clean_portuguese(text):
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    return text

def parse_gabarito(text):
    # Restrict parsing to the official answer block. Looking at entire pages can
    # capture references such as "17 A" before the real answer table.
    marker_matches = list(re.finditer(r'\b(?:Respostas|GABARITO)\s*(?::|[-–—].*)?', text, re.IGNORECASE))
    if marker_matches:
        text = text[marker_matches[-1].start():]

    # Matches patterns like "1 C 2 D" or "01. A" or "1. A" or "1 - C".
    gab = {}
    matches = re.findall(r'(\d{1,3})\s*[\.\-\)]?\s*([A-E])\b', text)
    for num_str, letter in matches:
        num = int(num_str)
        if num not in gab:
            gab[num] = letter
    return gab

def smart_split_reading_statement(pre_text):
    pre_text = re.sub(r'^Questão\s+\d+[^\n]*\n*', '', pre_text).strip()
    # The verb-mode sheets number the prompt as ``3)`` instead of using the
    # ``Questão 3`` heading used by the other PDFs.
    pre_text = re.sub(r'^\d+\s*[\)\.\-]\s*', '', pre_text).strip()
    pre_text = re.sub(r'^(?:Flexão verbal|Verbos|Português|Morfologia|Correlação de tempos e modos|Sintaxe do período simples|Significação a partir de construções verbais|Empregos do infinitivo|Sujeito classificações e identificação|Separação silábica|Acentuação|Encontros consonantais|Sílaba e fonemas|Estrutura da palavra|Classes variáveis|Classes invariáveis|Pronomes|referenciação)\s*', '', pre_text).strip()
    # PDF text extraction occasionally separates every letter of a word
    # (``M a s cuidados t ê m``). Rejoin only adjacent one-letter chunks;
    # ordinary word spacing is left intact.
    pre_text = re.sub(r'\b([A-Za-zÀ-ÿ])\s+([A-Za-zÀ-ÿ])\s+([A-Za-zÀ-ÿ])\b', r'\1\2\3', pre_text)
    pre_text = re.sub(r'\b([A-Za-zÀ-ÿ])\s+([A-Za-zÀ-ÿ])\b', r'\1\2', pre_text)
    
    command_triggers = [
        r'A sequência',
        r'Um mesmo',
        r'As palavras',
        r'As expressões',
        r'A seguir',
        r'Ao observar',
        r'Aponte',
        r'Indique',
        r'Observando',
        r'Complete',
        r'Identifique',
        r'Classifique',
        r'Relacione',
        r'Considere',
        r'Segundo',
        r'De acordo',
        r'Pode-se',
        r'É correto',
        r'É possível',
        r'Considerando',
        r'Tendo em vista',
        r'No texto',
        r'No trecho',
        r'No fragmento',
        r'Neste texto',
        r'Neste fragmento',
        r'Nas questões',
        r'Nas palavras',
        r'Nos períodos',
        r'No período',
        r'A respeito',
        r'Em relação',
        r'No que concerne',
        r'No decorrer',
        r'Dentre',
        r'Qual(?!\w)',
        r'Leia(?!\w)',
        r'Analise(?!\w)',
        r'Quanto à',
        r'Quanto ao',
        r'Como se',
        r'O autor',
        r'A autora',
        r'O termo',
        r'A palavra',
        r'A forma',
        r'A oração',
        r'A expressão',
        r'As frases',
        r'A afirmativa',
        r'A alternativa',
        r'Os termos',
        r'Os vocábulos',
        r'O trecho',
        r'É oração',
        r'A mesma regra',
        r'Não ocorre',
        r'A partir',
        r'Em qual',
        r'Em que',
        r'Em “',
        r'Observe a conjugação',
        r'Observe o trecho',
        r'Observe os verbos',
        r'Assinale a opção',
        r'Assinale a alternativa',
        r'Assinale a única alternativa',
        r'Assinale, a seguir',
        r'Assinale, dentre',
        r'Assinale o',
        r'Assinale a',
        r'Marque a opção',
        r'Marque a alternativa',
        r'Marque o',
        r'Com base no texto',
        r'Com base ainda',
        r'Com base na letra',
        r'Com relação',
        r'Em relação à composição',
        r'Em relação ao texto',
        r'Em qual das alternativas',
        r'Em qual das opções',
        r'Em qual das orações',
        r'Em que opção',
        r'Em uma das passagens',
        r'Em “[^”]+”',
        r'Qual das alternativas',
        r'Que afirmativa',
        r'Qual sequência',
        r'Dentre as frases',
        r'Dentre as alternativas',
        r'Há frase na voz',
        r'Há verbo na',
        r'A forma verbal',
        r'A palavra “[^”]+”',
        r'O termo “[^”]+”',
        r'O vocábulo “[^”]+”',
        r'Quanto à acentuação',
        r'Quanto à tonicidade',
        r'Quanto à formação',
        r'Quanto aos',
        r'No trecho a seguir',
        r'No trecho “',
        r'O uso',
        r'Levando em consideração',
        r'O pronome',
        r'A organização discursiva',
        r'A transposição',
        r'No trecho acima',
        r'No período composto',
        r'Lido o texto',
        r'Considere o trecho',
        r'Considere as seguintes',
        r'Acerca da música',
        r'Leia atentamente e assinale',
        r'Leia o trecho a seguir',
        r'Leia o fragmento seguinte',
        r'Leia a frase',
        r'Leia:',
        r'Analise os trechos a seguir',
        r'Analise o trecho abaixo',
        r'Após a leitura atenta'
    ]
    
    best_pos = -1
    for trigger in command_triggers:
        for m in re.finditer(r'(?:\n|^)\s*\*{0,2}\s*(' + trigger + r')', pre_text, re.IGNORECASE):
            # A lowercase match at the start of a wrapped line is usually a
            # continuation (``..., as palavras``), not a new command. Keep
            # the original capitalization as a lightweight boundary signal.
            if m.start() > 30 and m.group(1)[:1].isupper():
                best_pos = max(best_pos, m.start())
                
    if best_pos != -1:
        reading = pre_text[:best_pos].strip()
        statement = pre_text[best_pos:].strip()
    else:
        # Some PDFs put the final command in a line without a stable phrase
        # (e.g. “O mesmo fonema...”); for an evidently long block, keep the
        # last few lines as the command and the preceding material as support.
        lines = [line for line in pre_text.splitlines() if line.strip()]
        if len(pre_text) > 700 and len(lines) >= 3:
            split_at = max(1, len(lines) - 3)
            reading = "\n".join(lines[:split_at]).strip()
            statement = "\n".join(lines[split_at:]).strip()
        else:
            reading = ""
            statement = pre_text
        
    # Format reading text
    if reading:
        reading = fix_broken_spaces(reading)
        reading = re.sub(r'(\d+§|\d+º§|\d+°§)', r'\n\n\1', reading)
        reading = re.sub(r'\n{3,}', '\n\n', reading).strip()

    # Keep an opening instruction in the question field when a long support
    # text follows it. This is common in the verb sheets (the article is the
    # support and the final sentence is the actual command).
    lead_match = re.match(
        r'^((?:Leia(?:\s+atentamente)?|Após a leitura atenta)[^\n]*[.!?:])\s*\n',
        reading,
        flags=re.IGNORECASE,
    ) if reading else None
    if lead_match and (len(reading) > 280 or re.fullmatch(r'Leia\s*:', lead_match.group(1), re.IGNORECASE)):
        lead = lead_match.group(1).strip()
        reading = reading[lead_match.end():].strip()
        statement = f'{lead}\n{statement}'.strip()

    # A few sheets append the generic instruction after the citation and
    # excerpt (``Com base no texto, responda à questão``). It is a command,
    # not part of the source, so move it into the statement field while
    # retaining every preceding support paragraph.
    if reading and statement:
        reading_lines = [line.strip() for line in reading.splitlines() if line.strip()]
        trailing_command = re.compile(
            r'^Com base no texto,\s*responda\s+(?:à|às|a)\s+quest(?:ão|ões?)\.?$',
            re.IGNORECASE,
        )
        command_at = next(
            (index for index, line in enumerate(reading_lines)
             if index > 0 and trailing_command.match(line)),
            None,
        )
        if command_at is not None:
            command = '\n'.join(reading_lines[command_at:]).strip()
            reading = '\n'.join(reading_lines[:command_at]).strip()
            statement = f'{command}\n{statement}'.strip()

    # If a question starts with its command and places only the citation on
    # the next line (common when an image/text is not embedded), expose that
    # citation as support rather than mixing it into the command.
    if not reading and statement:
        lines = [line.strip() for line in statement.splitlines() if line.strip()]
        if len(lines) >= 2 and re.match(r'^(Assinale|Leia|Considere|Observe)', lines[0], re.IGNORECASE):
            source_at = next((i for i, line in enumerate(lines[1:], 1)
                              if re.match(r'^(?:\(?\s*(?:Disponível|Fonte|Adaptado)|https?://|<https?://|www\.)', line, re.IGNORECASE)), None)
            if source_at == 1:
                reading = '\n'.join(lines[source_at:]).strip()
                statement = lines[0]

    # A number of sheets begin with a one-line instruction and place the
    # excerpt immediately below it. When the excerpt is long enough to be
    # unambiguous, expose it as support text. If a second command appears at
    # the end (``Os verbos...``, ``As consoantes...``), keep that command in
    # the question field as well.
    if not reading and statement:
        lines = [line.strip() for line in statement.splitlines() if line.strip()]
        starts_with_leading_instruction = re.match(
            r'^(?:Leia(?: atentamente)?|Após a leitura atenta)', lines[0], re.IGNORECASE
        )
        starts_with_assinale_excerpt = re.match(r'^Assinale', lines[0], re.IGNORECASE) and len('\n'.join(lines[1:])) >= 250 and re.search(r'\b(?:trecho|texto|fragmento)\b', ' '.join(lines[:3]), re.IGNORECASE)
        if len(lines) >= 2 and (starts_with_leading_instruction or starts_with_assinale_excerpt):
            # A wrapped instruction may end on the second line (for example,
            # ``...número de encontros vocálicos nele / presentes.``).
            instruction_end = 1
            while instruction_end < len(lines) - 1 and not re.search(r'[.!?:;]$', lines[instruction_end - 1]):
                instruction_end += 1
            instruction = ' '.join(lines[:instruction_end]).strip()
            trailing_command = re.compile(
                r'^\s*\*{0,2}\s*(?:Os verbos|As formas verbais|A forma verbal|O verbo|Na palavra|'
                r'As consoantes|Os encontros vocálicos|Entre as ocorrências|'
                r'Passe os verbos|Mantendo-se|Optando-se|Complete|Em qual|Com relação|Quanto ao)',
                re.IGNORECASE,
            )
            trailing_index = next(
                (index for index, line in enumerate(lines[instruction_end:], instruction_end) if trailing_command.match(line)),
                None,
            )
            if trailing_index is not None and trailing_index > instruction_end:
                reading = '\n'.join(lines[instruction_end:trailing_index]).strip()
                statement = '\n'.join([instruction, *lines[trailing_index:]]).strip()
            elif len('\n'.join(lines[instruction_end:])) >= 180:
                reading = '\n'.join(lines[instruction_end:]).strip()
                statement = instruction

    # If a support block was already detected before the command (for example,
    # ``Texto I``), the PDF can still repeat a long quoted excerpt immediately
    # after an ``Assinale`` instruction. Move that excerpt into the support
    # field so the command and its evidence are rendered as separate sections.
    if reading and statement:
        lines = [line.strip() for line in statement.splitlines() if line.strip()]
        if len(lines) >= 2 and re.match(r'^Assinale', lines[0], re.IGNORECASE):
            instruction_end = 1
            while instruction_end < len(lines) - 1 and not re.search(r'[.!?:;]$', lines[instruction_end - 1]):
                instruction_end += 1
            instruction = ' '.join(lines[:instruction_end]).strip()
            excerpt = '\n'.join(lines[instruction_end:]).strip()
            if len(excerpt) >= 250 and re.search(r'\b(?:trecho|texto|fragmento)\b', instruction, re.IGNORECASE):
                reading = f'{reading}\n\n{excerpt}'.strip()
                statement = instruction

    # A line-based fallback can cut a question at a lowercase continuation
    # (``... em qual`` / ``... assinale a alternativa``), or leave a citation
    # fragment before the actual command. Reattach those fragments using the
    # first clearly capitalized command line when one exists; otherwise move
    # the final support line back to the statement.
    if reading and statement and re.match(r'^[a-zà-ÿ]', statement.strip()):
        statement_lines = [line.strip() for line in statement.splitlines() if line.strip()]
        command_line_re = re.compile(
            r'^(?:A seguir|Além de|Ao observar|A partir|Após a leitura|Assinale|'
            r'Com base|Considere|Dentre|Em qual|Em que|Há |Leia|Marque|No fragmento|'
            r'No período|No trecho|No que|O verbo|Qual|Que afirmativa|Quanto aos|'
            r'Segundo|Tendo em vista|Observe|Relacione|Analise|Chama-se)',
        )
        command_index = next(
            (index for index, line in enumerate(statement_lines[1:], 1) if command_line_re.match(line)),
            None,
        )

        def append_to_reading(prefix: str) -> None:
            nonlocal reading
            if not prefix:
                return
            if reading and reading[-1].isalnum() and prefix[0].islower():
                reading = f'{reading.rstrip()} {prefix.lstrip()}'
            else:
                reading = f'{reading.rstrip()}\n{prefix.lstrip()}'.strip()

        if command_index is not None:
            append_to_reading('\n'.join(statement_lines[:command_index]))
            statement = '\n'.join(statement_lines[command_index:]).strip()
        else:
            reading_lines = [line.strip() for line in reading.splitlines() if line.strip()]
            if reading_lines:
                append_to_statement = reading_lines[-1]
                reading = '\n'.join(reading_lines[:-1]).strip()
                statement = f'{append_to_statement}\n{statement}'.strip()

    # The first pass above may need more than one line when a command was
    # split at several lowercase continuations. Keep reattaching until the
    # statement begins with a real command (or the support is exhausted).
    for _ in range(8):
        if not reading or not statement or not re.match(r'^[a-zà-ÿ]', statement.strip()):
            break
        statement_lines = [line.strip() for line in statement.splitlines() if line.strip()]
        command_line_re = re.compile(
            r'^(?:A seguir|Além de|Ao observar|A partir|Após a leitura|Assinale|'
            r'Com base|Considere|Dentre|Em qual|Em que|Há |Leia|Marque|No fragmento|'
            r'No trecho|No período|No que|O verbo|Qual|Que afirmativa|Quanto aos|'
            r'Segundo|Tendo em vista|Observe|Relacione|Analise|Chama-se)',
        )
        command_index = next(
            (index for index, line in enumerate(statement_lines[1:], 1) if command_line_re.match(line)),
            None,
        )
        if command_index is not None:
            prefix = '\n'.join(statement_lines[:command_index]).strip()
            if prefix:
                if reading and reading[-1].isalnum() and prefix[0].islower():
                    reading = f'{reading.rstrip()} {prefix.lstrip()}'
                else:
                    reading = f'{reading.rstrip()}\n{prefix.lstrip()}'.strip()
            statement = '\n'.join(statement_lines[command_index:]).strip()
        else:
            reading_lines = [line.strip() for line in reading.splitlines() if line.strip()]
            if not reading_lines:
                break
            moved = reading_lines.pop()
            reading = '\n'.join(reading_lines).strip()
            statement = f'{moved}\n{statement}'.strip()

    # Keep author/source attributions with the support excerpt when a fallback
    # placed them immediately before the question command.
    if reading and statement:
        lines = [line.strip() for line in statement.splitlines() if line.strip()]
        citation_line = re.match(r'^\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^)]{2,}\)$', lines[0]) if lines else None
        if citation_line and len(lines) >= 2 and (
            lines[1].startswith(('“', '"', "'", '[...'))
            or re.match(r'^(?:Chama-se|Analisando|Assinale|A palavra|No trecho|No período)', lines[1])
        ):
            reading = f'{reading.rstrip()}\n{lines[0]}'.strip()
            statement = '\n'.join(lines[1:]).strip()

    # The verb worksheets occasionally start a prompt with a lowercase
    # article after the numeric question marker; normalize that first letter.
    if statement and re.match(r'^o verbo\b', statement, re.IGNORECASE):
        statement = 'O' + statement[1:]

    return reading, fix_broken_spaces(statement)

def extract_options_from_bottom(question_block):
    lines = question_block.split('\n')
    opt_indices = []
    
    for i in range(len(lines) - 1, -1, -1):
        line_clean = lines[i].strip()
        if re.match(r'^[A-E]\s+[^\s]', line_clean, re.IGNORECASE) or re.match(r'^[A-E]\)\s+[^\s]', line_clean, re.IGNORECASE) or re.match(r'^[A-E]\.\s+[^\s]', line_clean, re.IGNORECASE):
            opt_indices.append(i)
            
    opt_indices.reverse()
    
    if len(opt_indices) >= 3:
        first_opt_line = opt_indices[0]
        statement_part = "\n".join(lines[:first_opt_line]).strip()
        options_text = "\n".join(lines[first_opt_line:]).strip()
        
        parsed_opts = []
        current_letter = None
        current_text = []
        
        for line in options_text.split('\n'):
            m = re.match(r'^([A-E])[\s\)\.](.*)', line.strip(), re.IGNORECASE)
            if m:
                if current_letter:
                    parsed_opts.append((current_letter, " ".join(current_text).strip()))
                current_letter = m.group(1).upper()
                current_text = [m.group(2).strip()]
            else:
                if current_letter:
                    current_text.append(line.strip())
                    
        if current_letter:
            parsed_opts.append((current_letter, " ".join(current_text).strip()))
            
        return statement_part, parsed_opts
    else:
        return question_block, [('A', 'Opção A'), ('B', 'Opção B'), ('C', 'Opção C'), ('D', 'Opção D')]

print("Helper functions ready for bulk extraction.")
