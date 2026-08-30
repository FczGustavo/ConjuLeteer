const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.join(__dirname, '..', 'src', 'data', 'canonicalVerbs.ts');
const compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 };
const loadTsModule = filePath => {
  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions }).outputText;
  const moduleRef = { exports: {} };
  const localRequire = request => {
    if (request === './expandedVerbs') {
      return loadTsModule(path.join(path.dirname(filePath), 'expandedVerbs.ts'));
    }
    return require(request);
  };
  vm.runInNewContext(compiled, { module: moduleRef, exports: moduleRef.exports, require: localRequire, crypto });
  return moduleRef.exports;
};

const { CANONICAL_VERBS } = loadTsModule(sourcePath);

if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(CANONICAL_VERBS));
  process.exit(0);
}

const persons = ['1s', '2s', '3s', '1p', '2p', '3p', 'na'];
const tenseKeys = [
  'indicativo_presente', 'indicativo_pret_perfeito', 'indicativo_pret_imperfeito',
  'indicativo_pret_mais_que_perfeito', 'indicativo_futuro_presente',
  'indicativo_futuro_preterito', 'subjuntivo_presente', 'subjuntivo_pret_imperfeito',
  'subjuntivo_futuro_subjuntivo', 'imperativo_af_presente', 'imperativo_neg_presente',
];
const failures = [];
const fail = message => failures.push(message);

if (CANONICAL_VERBS.length < 100) fail(`esperados pelo menos 100 verbos; encontrados ${CANONICAL_VERBS.length}`);
if (new Set(CANONICAL_VERBS.map(verb => verb.id)).size !== CANONICAL_VERBS.length) fail('há IDs de verbos duplicados');
for (const verb of CANONICAL_VERBS) {
  if (verb.pdfFrequency !== undefined && (!Number.isInteger(verb.pdfFrequency) || verb.pdfFrequency < 0)) {
    fail(`${verb.id}: frequência PDF inválida`);
  }
  if (verb.pdfDocumentCount !== undefined && (!Number.isInteger(verb.pdfDocumentCount) || verb.pdfDocumentCount < 0 || verb.pdfDocumentCount > 9)) {
    fail(`${verb.id}: quantidade de PDFs inválida`);
  }
}

for (const verb of CANONICAL_VERBS) {
  for (const tense of tenseKeys) {
    const forms = verb.conjugations[tense];
    if (!forms) {
      fail(`${verb.id}: tempo ausente (${tense})`);
      continue;
    }
    for (const person of persons) {
      if (!(person in forms)) fail(`${verb.id}/${tense}: pessoa ausente (${person})`);
    }
  }

  const indicative = verb.conjugations.indicativo_presente;
  const subjunctive = verb.conjugations.subjuntivo_presente;
  const affirmative = verb.conjugations.imperativo_af_presente;
  const negative = verb.conjugations.imperativo_neg_presente;
  // A handful of high-frequency verbs have lexical imperatives (sê, vá,
  // dê...) that cannot be derived by the regular rule.  They are checked by
  // goldens below; all other verbs follow the deterministic derivation.
  const lexicalImperatives = new Set(['ser', 'ir', 'dar', 'estar', 'haver', 'ouvir', 'construir', 'querer']);
  if (!lexicalImperatives.has(verb.id)) {
    const expectedAffirmative = {
      '1s': null,
      '2s': verb.isIrregular
        ? indicative['3s']
        : (indicative['2s']?.endsWith('s') ? indicative['2s'].slice(0, -1) : indicative['2s']),
      '3s': subjunctive['3s'],
      '1p': subjunctive['1p'],
      '2p': indicative['2p']?.slice(0, -1) ?? null,
      '3p': subjunctive['3p'],
    };
    for (const [person, expected] of Object.entries(expectedAffirmative)) {
      if (affirmative[person] !== expected) {
        fail(`${verb.id}/imperativo afirmativo/${person}: “${affirmative[person]}” deveria ser “${expected}”`);
      }
    }
  }
  for (const person of ['2s', '3s', '1p', '2p', '3p']) {
    const expected = subjunctive[person] === null ? null : `não ${subjunctive[person]}`;
    if (negative[person] !== expected) {
      fail(`${verb.id}/imperativo negativo/${person}: “${negative[person]}” deveria ser “${expected}”`);
    }
  }
}

function prefixedForm(form, prefix) {
  if (form === null) return null;
  return form.startsWith('não ') ? `não ${prefix}${form.slice(4)}` : `${prefix}${form}`;
}

for (const [derivedId, primitiveId, prefix] of [
  ['compor', 'por', 'com'],
  ['repor', 'por', 're'],
  ['intervir', 'vir', 'inter'],
  ['prever', 'ver', 'pre'],
]) {
  const derived = CANONICAL_VERBS.find(verb => verb.id === derivedId);
  const primitive = CANONICAL_VERBS.find(verb => verb.id === primitiveId);
  for (const tense of tenseKeys) {
    for (const person of persons) {
      const accentExceptions = {
        'intervir/indicativo_presente/2s': 'intervéns',
        'intervir/indicativo_presente/3s': 'intervém',
        'intervir/imperativo_af_presente/2s': 'intervém',
      };
      const address = `${derivedId}/${tense}/${person}`;
      const expected = accentExceptions[address] ?? prefixedForm(primitive.conjugations[tense][person], prefix);
      const actual = derived.conjugations[tense][person];
      if (actual !== expected) fail(`${derivedId}/${tense}/${person}: “${actual}” deveria ser “${expected}”`);
    }
  }
}

const goldenForms = {
  'reaver/indicativo_presente/1p': 'reavemos',
  'precaver/indicativo_presente/2p': 'precaveis',
  'precaver/indicativo_pret_perfeito/1s': 'precavi',
  'prover/indicativo_pret_perfeito/1s': 'provi',
  'caber/subjuntivo_presente/1s': 'caiba',
  'valer/indicativo_presente/1s': 'valho',
  'imprimir/indicativo_presente/1s': 'imprimo',
  'abolir/imperativo_af_presente/2p': 'aboli',
  'ser/indicativo_presente/1s': 'sou',
  'ter/indicativo_pret_perfeito/1s': 'tive',
  'haver/indicativo_presente/1s': 'hei',
  'fazer/indicativo_pret_perfeito/1s': 'fiz',
  'dizer/indicativo_pret_perfeito/1s': 'disse',
  'trazer/indicativo_pret_perfeito/1s': 'trouxe',
  'querer/indicativo_pret_perfeito/1s': 'quis',
  'poder/indicativo_pret_perfeito/1s': 'pude',
  'saber/indicativo_pret_perfeito/1s': 'soube',
  'dar/indicativo_pret_perfeito/1s': 'dei',
  'dar/subjuntivo_presente/1p': 'demos',
  'dar/subjuntivo_presente/3p': 'deem',
  'ir/indicativo_pret_perfeito/1s': 'fui',
  'ler/indicativo_presente/3p': 'leem',
  'crer/indicativo_presente/3p': 'creem',
  'produzir/imperativo_af_presente/2s': 'produze',
  'estar/indicativo_futuro_presente/3p': 'estarão',
  'ouvir/indicativo_pret_perfeito/3s': 'ouviu',
  'pedir/indicativo_futuro_presente/1s': 'pedirei',
};
for (const [address, expected] of Object.entries(goldenForms)) {
  const [verbId, tense, person] = address.split('/');
  const actual = CANONICAL_VERBS.find(verb => verb.id === verbId).conjugations[tense][person];
  if (actual !== expected) fail(`${address}: “${actual}” deveria ser “${expected}”`);
}

if (failures.length) {
  console.error(`Auditoria verbal falhou (${failures.length} problema(s)):\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Auditoria verbal aprovada: ${CANONICAL_VERBS.length} verbos, ${tenseKeys.length} paradigmas e derivações prefixais validados.`);
