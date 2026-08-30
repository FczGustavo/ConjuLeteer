import type { VerbEntry, MilitaryRank } from '../types/verbs';
import { EXPANDED_CANONICAL_VERBS } from './expandedVerbs';

const PERSON_KEYS = ['1s', '2s', '3s', '1p', '2p', '3p'] as const;

function regularForms(forms: string[]): Record<'1s' | '2s' | '3s' | '1p' | '2p' | '3p' | 'na', string | null> {
  return { ...Object.fromEntries(PERSON_KEYS.map((person, index) => [person, forms[index]])), na: null } as Record<'1s' | '2s' | '3s' | '1p' | '2p' | '3p' | 'na', string | null>;
}

function createRegularVerb(infinitive: string): VerbEntry {
  const ending = infinitive.slice(-2) as 'ar' | 'er' | 'ir';
  const root = infinitive.slice(0, -2);
  const group = ending === 'ar' ? 1 : ending === 'er' ? 2 : 3;
  const endings = ending === 'ar'
    ? {
        present: ['o', 'as', 'a', 'amos', 'ais', 'am'],
        perfect: ['ei', 'aste', 'ou', 'amos', 'astes', 'aram'],
        imperfect: ['ava', 'avas', 'ava', 'ávamos', 'áveis', 'avam'],
        pluperfect: ['ara', 'aras', 'ara', 'áramos', 'áreis', 'aram'],
        subjPresent: ['e', 'es', 'e', 'emos', 'eis', 'em'],
        subjImperfect: ['asse', 'asses', 'asse', 'ássemos', 'ásseis', 'assem'],
        imperative2p: 'ai'
      }
    : ending === 'er'
      ? {
          present: ['o', 'es', 'e', 'emos', 'eis', 'em'],
          perfect: ['i', 'este', 'eu', 'emos', 'estes', 'eram'],
          imperfect: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
          pluperfect: ['era', 'eras', 'era', 'êramos', 'êreis', 'eram'],
          subjPresent: ['a', 'as', 'a', 'amos', 'ais', 'am'],
          subjImperfect: ['esse', 'esses', 'esse', 'êssemos', 'êsseis', 'essem'],
          imperative2p: 'ei'
        }
      : {
          present: ['o', 'es', 'e', 'imos', 'is', 'em'],
          perfect: ['i', 'iste', 'iu', 'imos', 'istes', 'iram'],
          imperfect: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
          pluperfect: ['ira', 'iras', 'ira', 'íramos', 'íreis', 'iram'],
          subjPresent: ['a', 'as', 'a', 'amos', 'ais', 'am'],
          subjImperfect: ['isse', 'isses', 'isse', 'íssemos', 'ísseis', 'issem'],
          imperative2p: 'i'
        };
  const build = (suffixes: string[]) => regularForms(suffixes.map(suffix => root + suffix));
  const subjPresent = build(endings.subjPresent);
  const indicativePresent = build(endings.present);
  const future = regularForms(['ei', 'ás', 'á', 'emos', 'eis', 'ão'].map(suffix => infinitive + suffix));
  const conditional = regularForms(['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'].map(suffix => infinitive + suffix));
  const subjFuture = regularForms([
    infinitive,
    infinitive + 'es',
    infinitive,
    infinitive + 'mos',
    infinitive + 'des',
    infinitive + 'em'
  ]);
  return {
    id: infinitive,
    infinitive,
    primitiveRoot: infinitive,
    conjugationGroup: group,
    isIrregular: false,
    isDefective: false,
    isAbundant: false,
    classification: 'regular',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn', 'epcar'],
    conjugations: {
      indicativo_presente: indicativePresent,
      indicativo_pret_perfeito: build(endings.perfect),
      indicativo_pret_imperfeito: build(endings.imperfect),
      indicativo_pret_mais_que_perfeito: build(endings.pluperfect),
      indicativo_futuro_presente: future,
      indicativo_futuro_preterito: conditional,
      subjuntivo_presente: subjPresent,
      subjuntivo_pret_imperfeito: build(endings.subjImperfect),
      subjuntivo_futuro_subjuntivo: subjFuture,
      imperativo_af_presente: {
        '1s': null,
        '2s': indicativePresent['3s'],
        '3s': subjPresent['3s'],
        '1p': subjPresent['1p'],
        '2p': root + endings.imperative2p,
        '3p': subjPresent['3p'],
        na: null
      },
      imperativo_neg_presente: {
        '1s': null,
        '2s': `não ${subjPresent['2s']}`,
        '3s': `não ${subjPresent['3s']}`,
        '1p': `não ${subjPresent['1p']}`,
        '2p': `não ${subjPresent['2p']}`,
        '3p': `não ${subjPresent['3p']}`,
        na: null
      }
    }
  };
}

const REGULAR_VERBS = [
  'falar', 'estudar', 'trabalhar', 'cantar', 'amar', 'chamar',
  'viver', 'vender', 'beber', 'aprender', 'correr', 'receber',
  'partir', 'decidir', 'cumprir', 'permitir', 'assistir', 'dividir'
].map(createRegularVerb);

export const MILITARY_RANKS: MilitaryRank[] = [
  { level: 1, title: 'Recruta Gramatical', abbreviation: 'REC', minMasteryScore: 0, badgeColor: 'text-zinc-400 bg-zinc-800/80 border-zinc-700', description: 'Início da instrução básica em morfologia verbal.' },
  { level: 2, title: 'Soldado de Infantaria', abbreviation: 'SD', minMasteryScore: 15, badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', description: 'Domina os verbos regulares e regras fundamentais do indicativo.' },
  { level: 3, title: 'Cabo Especialista', abbreviation: 'CB', minMasteryScore: 30, badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800', description: 'Reconhece verbos de duplo particípio e desinências modo-temporais.' },
  { level: 4, title: '3º Sargento', abbreviation: '3º SGT', minMasteryScore: 45, badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-800', description: 'Mestre na formação do imperativo e correlações simples.' },
  { level: 5, title: '2º Sargento', abbreviation: '2º SGT', minMasteryScore: 60, badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-800', description: 'Domina os derivados perigosos de PÔR, TER e VIR.' },
  { level: 6, title: '1º Sargento', abbreviation: '1º SGT', minMasteryScore: 72, badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-800', description: 'Identifica defectivos e anomalias de VER vs VIR e PREVER vs PROVER.' },
  { level: 7, title: 'Subtenente', abbreviation: 'S TEN', minMasteryScore: 80, badgeColor: 'text-pink-400 bg-pink-950/60 border-pink-800', description: 'Precisão cirúrgica em vozes verbais e transposição com partícula "se".' },
  { level: 8, title: 'Aspirante a Oficial', abbreviation: 'ASP', minMasteryScore: 88, badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800', description: 'Rigor absoluto no padrão EsPCEx / EFOMM / AFA.' },
  { level: 9, title: 'Oficial de Estado-Maior', abbreviation: 'CAP', minMasteryScore: 94, badgeColor: 'text-orange-400 bg-orange-950/60 border-orange-800', description: 'Taxa de acerto superior a 95% em qualquer prova militar.' },
  { level: 10, title: 'Marechal da Língua', abbreviation: 'MAR', minMasteryScore: 99, badgeColor: 'text-yellow-300 bg-yellow-950/80 border-yellow-500 shadow-lg shadow-yellow-500/20', description: 'Maestria total e inquestionável em verbos portugueses.' }
];

export const CANONICAL_VERBS: VerbEntry[] = [
  // 1. PÔR (e derivados)
  {
    id: 'por',
    infinitive: 'pôr',
    primitiveRoot: 'pôr',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'anomalo',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn', 'epcar'],
    criticalTrapDescription: '2ª conjugação (antigo "poer"). Raiz irregular "pus-" no pretérito perfeito e subjuntivo.',
    conjugations: {
      'indicativo_presente': { '1s': 'ponho', '2s': 'pões', '3s': 'põe', '1p': 'pomos', '2p': 'pondes', '3p': 'põem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'pus', '2s': 'puseste', '3s': 'pôs', '1p': 'pusemos', '2p': 'pusestes', '3p': 'puseram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'punha', '2s': 'punhas', '3s': 'punha', '1p': 'púnhamos', '2p': 'púnheis', '3p': 'punham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'pusera', '2s': 'puseras', '3s': 'pusera', '1p': 'puséramos', '2p': 'puséreis', '3p': 'puseram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'porei', '2s': 'porás', '3s': 'porá', '1p': 'poremos', '2p': 'poreis', '3p': 'porão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'poria', '2s': 'porias', '3s': 'poria', '1p': 'poríamos', '2p': 'poríeis', '3p': 'poriam', 'na': null },
      'subjuntivo_presente': { '1s': 'ponha', '2s': 'ponhas', '3s': 'ponha', '1p': 'ponhamos', '2p': 'ponhais', '3p': 'ponham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'pusesse', '2s': 'pusesses', '3s': 'pusesse', '1p': 'puséssemos', '2p': 'pusésseis', '3p': 'pusessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'puser', '2s': 'puseres', '3s': 'puser', '1p': 'pusermos', '2p': 'puserdes', '3p': 'puserem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'põe', '3s': 'ponha', '1p': 'ponhamos', '2p': 'ponde', '3p': 'ponham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não ponhas', '3s': 'não ponha', '1p': 'não ponhamos', '2p': 'não ponhais', '3p': 'não ponham', 'na': null }
    }
  },
  {
    id: 'compor',
    infinitive: 'compor',
    primitiveRoot: 'pôr',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'Segue estritamente PÔR: "compusera", "compusesse", "compuser", "compusestes".',
    conjugations: {
      'indicativo_presente': { '1s': 'componho', '2s': 'compões', '3s': 'compõe', '1p': 'compomos', '2p': 'compondes', '3p': 'compõem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'compus', '2s': 'compuseste', '3s': 'compôs', '1p': 'compusemos', '2p': 'compusestes', '3p': 'compuseram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'compunha', '2s': 'compunhas', '3s': 'compunha', '1p': 'compúnhamos', '2p': 'compúnheis', '3p': 'compunham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'compusera', '2s': 'compuseras', '3s': 'compusera', '1p': 'compuséramos', '2p': 'compuséreis', '3p': 'compuseram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'comporei', '2s': 'comporás', '3s': 'comporá', '1p': 'comporemos', '2p': 'comporeis', '3p': 'comporão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'comporia', '2s': 'comporias', '3s': 'comporia', '1p': 'comporíamos', '2p': 'comporíeis', '3p': 'comporiam', 'na': null },
      'subjuntivo_presente': { '1s': 'componha', '2s': 'componhas', '3s': 'componha', '1p': 'componhamos', '2p': 'componhais', '3p': 'componham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'compusesse', '2s': 'compusesses', '3s': 'compusesse', '1p': 'compuséssemos', '2p': 'compusésseis', '3p': 'compusessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'compuser', '2s': 'compuseres', '3s': 'compuser', '1p': 'compusermos', '2p': 'compuserdes', '3p': 'compuserem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'compõe', '3s': 'componha', '1p': 'componhamos', '2p': 'componde', '3p': 'componham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não componhas', '3s': 'não componha', '1p': 'não componhamos', '2p': 'não componhais', '3p': 'não componham', 'na': null }
    }
  },
  {
    id: 'repor',
    infinitive: 'repor',
    primitiveRoot: 'pôr',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'cn'],
    criticalTrapDescription: 'Derivado de PÔR: "quando nós repusermos", "se eles repusessem", "ele repôs".',
    conjugations: {
      'indicativo_presente': { '1s': 'reponho', '2s': 'repões', '3s': 'repõe', '1p': 'repomos', '2p': 'repondes', '3p': 'repõem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'repus', '2s': 'repuseste', '3s': 'repôs', '1p': 'repusemos', '2p': 'repusestes', '3p': 'repuseram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'repunha', '2s': 'repunhas', '3s': 'repunha', '1p': 'repúnhamos', '2p': 'repúnheis', '3p': 'repunham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'repusera', '2s': 'repuseras', '3s': 'repusera', '1p': 'repuséramos', '2p': 'repuséreis', '3p': 'repuseram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'reporei', '2s': 'reporás', '3s': 'reporá', '1p': 'reporemos', '2p': 'reporeis', '3p': 'reporão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'reporia', '2s': 'reporias', '3s': 'reporia', '1p': 'reporíamos', '2p': 'reporíeis', '3p': 'reporiam', 'na': null },
      'subjuntivo_presente': { '1s': 'reponha', '2s': 'reponhas', '3s': 'reponha', '1p': 'reponhamos', '2p': 'reponhais', '3p': 'reponham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'repusesse', '2s': 'repusesses', '3s': 'repusesse', '1p': 'repuséssemos', '2p': 'repusésseis', '3p': 'repusessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'repuser', '2s': 'repuseres', '3s': 'repuser', '1p': 'repusermos', '2p': 'repuserdes', '3p': 'repuserem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'repõe', '3s': 'reponha', '1p': 'reponhamos', '2p': 'reponde', '3p': 'reponham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não reponhas', '3s': 'não reponha', '1p': 'não reponhamos', '2p': 'não reponhais', '3p': 'não reponham', 'na': null }
    }
  },

  // 2. VER vs VIR (O Clássico de Oposição)
  {
    id: 'ver',
    infinitive: 'ver',
    primitiveRoot: 'ver',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn', 'epcar'],
    criticalTrapDescription: 'Futuro do Subjuntivo: "quando eu vir, vires, vir, virmos, virdes, virem". Pretérito Perfeito: "vi, viste, viu, vimos, vistes, viram".',
    conjugations: {
      'indicativo_presente': { '1s': 'vejo', '2s': 'vês', '3s': 'vê', '1p': 'vemos', '2p': 'vedes', '3p': 'veem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'vi', '2s': 'viste', '3s': 'viu', '1p': 'vimos', '2p': 'vistes', '3p': 'viram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'via', '2s': 'vias', '3s': 'via', '1p': 'víamos', '2p': 'víeis', '3p': 'viam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'vira', '2s': 'viras', '3s': 'vira', '1p': 'víramos', '2p': 'víreis', '3p': 'viram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'verei', '2s': 'verás', '3s': 'verá', '1p': 'veremos', '2p': 'vereis', '3p': 'verão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'veria', '2s': 'verias', '3s': 'veria', '1p': 'veríamos', '2p': 'veríeis', '3p': 'veriam', 'na': null },
      'subjuntivo_presente': { '1s': 'veja', '2s': 'vejas', '3s': 'veja', '1p': 'vejamos', '2p': 'vejais', '3p': 'vejam', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'visse', '2s': 'visses', '3s': 'visse', '1p': 'víssemos', '2p': 'vísseis', '3p': 'vissem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'vir', '2s': 'vires', '3s': 'vir', '1p': 'virmos', '2p': 'virdes', '3p': 'virem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'vê', '3s': 'veja', '1p': 'vejamos', '2p': 'vede', '3p': 'vejam', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não vejas', '3s': 'não veja', '1p': 'não vejamos', '2p': 'não vejais', '3p': 'não vejam', 'na': null }
    }
  },
  {
    id: 'vir',
    infinitive: 'vir',
    primitiveRoot: 'vir',
    conjugationGroup: 3,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'anomalo',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn', 'epcar'],
    criticalTrapDescription: 'Futuro do Subjuntivo: "quando eu vier, vieres, vier, viermos, vierdes, vierem". Não confunda com "vir" (ver)!',
    conjugations: {
      'indicativo_presente': { '1s': 'venho', '2s': 'vens', '3s': 'vem', '1p': 'vimos', '2p': 'vindes', '3p': 'vêm', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'vim', '2s': 'vieste', '3s': 'veio', '1p': 'viemos', '2p': 'viestes', '3p': 'vieram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'vinha', '2s': 'vinhas', '3s': 'vinha', '1p': 'vínhamos', '2p': 'vínheis', '3p': 'vinham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'viera', '2s': 'vieras', '3s': 'viera', '1p': 'viéramos', '2p': 'viéreis', '3p': 'vieram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'virei', '2s': 'virás', '3s': 'virá', '1p': 'viremos', '2p': 'vireis', '3p': 'virão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'viria', '2s': 'virias', '3s': 'viria', '1p': 'viríamos', '2p': 'viríeis', '3p': 'viriam', 'na': null },
      'subjuntivo_presente': { '1s': 'venha', '2s': 'venhas', '3s': 'venha', '1p': 'venhamos', '2p': 'venhais', '3p': 'venham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'viesse', '2s': 'viesses', '3s': 'viesse', '1p': 'viéssemos', '2p': 'viésseis', '3p': 'viessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'vier', '2s': 'vieres', '3s': 'vier', '1p': 'viermos', '2p': 'vierdes', '3p': 'vierem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'vem', '3s': 'venha', '1p': 'venhamos', '2p': 'vinde', '3p': 'venham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não venhas', '3s': 'não venha', '1p': 'não venhamos', '2p': 'não venhais', '3p': 'não venham', 'na': null }
    }
  },
  {
    id: 'intervir',
    infinitive: 'intervir',
    primitiveRoot: 'vir',
    conjugationGroup: 3,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'Derivado de VIR: "se ele interviesse" (NUNCA "intervisse"!), "eles intervêm", "ele interveio".',
    conjugations: {
      'indicativo_presente': { '1s': 'intervenho', '2s': 'intervéns', '3s': 'intervém', '1p': 'intervimos', '2p': 'intervindes', '3p': 'intervêm', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'intervim', '2s': 'intervieste', '3s': 'interveio', '1p': 'interviemos', '2p': 'interviestes', '3p': 'intervieram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'intervinha', '2s': 'intervinhas', '3s': 'intervinha', '1p': 'intervínhamos', '2p': 'intervínheis', '3p': 'intervinham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'interviera', '2s': 'intervieras', '3s': 'interviera', '1p': 'interviéramos', '2p': 'interviéreis', '3p': 'intervieram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'intervirei', '2s': 'intervirás', '3s': 'intervirá', '1p': 'interviremos', '2p': 'intervireis', '3p': 'intervirão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'interviria', '2s': 'intervirias', '3s': 'interviria', '1p': 'interviríamos', '2p': 'interviríeis', '3p': 'interviriam', 'na': null },
      'subjuntivo_presente': { '1s': 'intervenha', '2s': 'intervenhas', '3s': 'intervenha', '1p': 'intervenhamos', '2p': 'intervenhais', '3p': 'intervenham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'interviesse', '2s': 'interviesses', '3s': 'interviesse', '1p': 'interviéssemos', '2p': 'interviésseis', '3p': 'interviessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'intervier', '2s': 'intervieres', '3s': 'intervier', '1p': 'interviermos', '2p': 'intervierdes', '3p': 'intervierem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'intervém', '3s': 'intervenha', '1p': 'intervenhamos', '2p': 'intervinde', '3p': 'intervenham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não intervenhas', '3s': 'não intervenha', '1p': 'não intervenhamos', '2p': 'não intervenhais', '3p': 'não intervenham', 'na': null }
    }
  },

  // 3. PREVER vs PROVER (A Maior Pegadinha de Militares)
  {
    id: 'prever',
    infinitive: 'prever',
    primitiveRoot: 'ver',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn'],
    criticalTrapDescription: 'Segue VER: "quando nós previrmos", "se nós prevíssemos", "ele previu", "eles previram".',
    conjugations: {
      'indicativo_presente': { '1s': 'prevejo', '2s': 'prevês', '3s': 'prevê', '1p': 'prevemos', '2p': 'prevedes', '3p': 'preveem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'previ', '2s': 'previste', '3s': 'previu', '1p': 'previmos', '2p': 'previstes', '3p': 'previram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'previa', '2s': 'previas', '3s': 'previa', '1p': 'prevíamos', '2p': 'prevíeis', '3p': 'previam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'previra', '2s': 'previras', '3s': 'previra', '1p': 'prevíramos', '2p': 'prevíreis', '3p': 'previram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'preverei', '2s': 'preverás', '3s': 'preverá', '1p': 'preveremos', '2p': 'prevereis', '3p': 'preverão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'preveria', '2s': 'preverias', '3s': 'preveria', '1p': 'preveríamos', '2p': 'preveríeis', '3p': 'preveriam', 'na': null },
      'subjuntivo_presente': { '1s': 'preveja', '2s': 'prevejas', '3s': 'preveja', '1p': 'prevejamos', '2p': 'prevejais', '3p': 'prevejam', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'previsse', '2s': 'previsses', '3s': 'previsse', '1p': 'prevíssemos', '2p': 'prevísseis', '3p': 'previssem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'previr', '2s': 'previres', '3s': 'previr', '1p': 'previrmos', '2p': 'previrdes', '3p': 'previrem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'prevê', '3s': 'preveja', '1p': 'prevejamos', '2p': 'prevede', '3p': 'prevejam', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não prevejas', '3s': 'não preveja', '1p': 'não prevejamos', '2p': 'não prevejais', '3p': 'não prevejam', 'na': null }
    }
  },
  {
    id: 'prover',
    infinitive: 'prover',
    primitiveRoot: 'ver',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'NÃO segue ver no pretérito! "provi, proveu, proveram", "provesse", "quando eu prover" (regular).',
    conjugations: {
      'indicativo_presente': { '1s': 'provejo', '2s': 'provês', '3s': 'provê', '1p': 'provemos', '2p': 'provedes', '3p': 'proveem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'provi', '2s': 'proveste', '3s': 'proveu', '1p': 'provemos', '2p': 'provestes', '3p': 'proveram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'provia', '2s': 'provias', '3s': 'provia', '1p': 'províamos', '2p': 'províeis', '3p': 'proviam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'provera', '2s': 'proveras', '3s': 'provera', '1p': 'provêramos', '2p': 'provêreis', '3p': 'proveram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'proverei', '2s': 'proverás', '3s': 'proverá', '1p': 'proveremos', '2p': 'provereis', '3p': 'proverão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'proveria', '2s': 'proverias', '3s': 'proveria', '1p': 'proveríamos', '2p': 'proveríeis', '3p': 'proveriam', 'na': null },
      'subjuntivo_presente': { '1s': 'proveja', '2s': 'provejas', '3s': 'proveja', '1p': 'provejamos', '2p': 'provejais', '3p': 'provejam', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'provesse', '2s': 'provesses', '3s': 'provesse', '1p': 'provêssemos', '2p': 'provêsseis', '3p': 'provessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'prover', '2s': 'proveres', '3s': 'prover', '1p': 'provermos', '2p': 'proverdes', '3p': 'proverem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'provê', '3s': 'proveja', '1p': 'provejamos', '2p': 'provede', '3p': 'provejam', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não provejas', '3s': 'não proveja', '1p': 'não provejamos', '2p': 'não provejais', '3p': 'não provejam', 'na': null }
    }
  },

  // 4. TER e Derivados (MANTER, RETER, DETER)
  {
    id: 'manter',
    infinitive: 'manter',
    primitiveRoot: 'ter',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn', 'epcar'],
    criticalTrapDescription: 'Acentuação diferencial: "ele mantém" vs "eles mantêm". Subjuntivo: "se ele mantivesse", "quando ele mantiver".',
    conjugations: {
      'indicativo_presente': { '1s': 'mantenho', '2s': 'manténs', '3s': 'mantém', '1p': 'mantemos', '2p': 'mantendes', '3p': 'mantêm', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'mantive', '2s': 'mantiveste', '3s': 'manteve', '1p': 'mantivemos', '2p': 'mantivestes', '3p': 'mantiveram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'mantinha', '2s': 'mantinhas', '3s': 'mantinha', '1p': 'mantínhamos', '2p': 'mantínheis', '3p': 'mantinham', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'mantivera', '2s': 'mantiveras', '3s': 'mantivera', '1p': 'mantivéramos', '2p': 'mantivéreis', '3p': 'mantiveram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'manterei', '2s': 'manterás', '3s': 'manterá', '1p': 'manteremos', '2p': 'mantereis', '3p': 'manterão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'manteria', '2s': 'manterias', '3s': 'manteria', '1p': 'manteríamos', '2p': 'manteríeis', '3p': 'manteriam', 'na': null },
      'subjuntivo_presente': { '1s': 'mantenha', '2s': 'mantenhas', '3s': 'mantenha', '1p': 'mantenhamos', '2p': 'mantenhais', '3p': 'mantenham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'mantivesse', '2s': 'mantivesses', '3s': 'mantivesse', '1p': 'mantivéssemos', '2p': 'mantivésseis', '3p': 'mantivessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'mantiver', '2s': 'mantiveres', '3s': 'mantiver', '1p': 'mantivermos', '2p': 'mantiverdes', '3p': 'mantiverem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'mantém', '3s': 'mantenha', '1p': 'mantenhamos', '2p': 'mantende', '3p': 'mantenham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não mantenhas', '3s': 'não mantenha', '1p': 'não mantenhamos', '2p': 'não mantenhais', '3p': 'não mantenham', 'na': null }
    }
  },

  // 5. DEFECTIVOS NOTÓRIOS: REAVER e PRECAVER
  {
    id: 'reaver',
    infinitive: 'reaver',
    primitiveRoot: 'haver',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: true,
    isAbundant: false,
    classification: 'defectivo',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'Defectivo: Só existe onde HAVER tem V! Não tem presente do subjuntivo nem imperativo negativo. "reouve", "reouvesse", "reaverá".',
    conjugations: {
      'indicativo_presente': { '1s': null, '2s': null, '3s': null, '1p': 'reavemos', '2p': 'reaveis', '3p': null, 'na': null },
      'indicativo_pret_perfeito': { '1s': 'reouve', '2s': 'reouveste', '3s': 'reouve', '1p': 'reouvemos', '2p': 'reouvestes', '3p': 'reouveram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'reavia', '2s': 'reavias', '3s': 'reavia', '1p': 'reavíamos', '2p': 'reavíeis', '3p': 'reaviam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'reouvera', '2s': 'reouveras', '3s': 'reouvera', '1p': 'reouvéramos', '2p': 'reouvéreis', '3p': 'reouveram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'reaverei', '2s': 'reaverás', '3s': 'reaverá', '1p': 'reaveremos', '2p': 'reavereis', '3p': 'reaverão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'reaveria', '2s': 'reaverias', '3s': 'reaveria', '1p': 'reaveríamos', '2p': 'reaveríeis', '3p': 'reaveriam', 'na': null },
      'subjuntivo_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'reouvesse', '2s': 'reouvesses', '3s': 'reouvesse', '1p': 'reouvéssemos', '2p': 'reouvésseis', '3p': 'reouvessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'reouver', '2s': 'reouveres', '3s': 'reouver', '1p': 'reouvermos', '2p': 'reouverdes', '3p': 'reouverem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': 'reavei', '3p': null, 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null }
    }
  },
  {
    id: 'precaver',
    infinitive: 'precaver',
    primitiveRoot: undefined,
    conjugationGroup: 2,
    isIrregular: false,
    isDefective: true,
    isAbundant: false,
    classification: 'defectivo',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'Defectivo arrizotônico no presente: só existem "precavemos" e "precaveis". NÃO tem presente do subjuntivo!',
    conjugations: {
      'indicativo_presente': { '1s': null, '2s': null, '3s': null, '1p': 'precavemos', '2p': 'precaveis', '3p': null, 'na': null },
      'indicativo_pret_perfeito': { '1s': 'precavi', '2s': 'precaveste', '3s': 'precaveu', '1p': 'precavemos', '2p': 'precavestes', '3p': 'precaveram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'precavia', '2s': 'precavias', '3s': 'precavia', '1p': 'precavíamos', '2p': 'precavíeis', '3p': 'precaviam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'precavera', '2s': 'precaveras', '3s': 'precavera', '1p': 'precavêramos', '2p': 'precavêreis', '3p': 'precaveram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'precaverei', '2s': 'precaverás', '3s': 'precaverá', '1p': 'precaveremos', '2p': 'precavereis', '3p': 'precaverão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'precaveria', '2s': 'precaverias', '3s': 'precaveria', '1p': 'precaveríamos', '2p': 'precaveríeis', '3p': 'precaveriam', 'na': null },
      'subjuntivo_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'precavesse', '2s': 'precavesses', '3s': 'precavesse', '1p': 'precavêssemos', '2p': 'precavêsseis', '3p': 'precavessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'precaver', '2s': 'precaveres', '3s': 'precaver', '1p': 'precavermos', '2p': 'precaverdes', '3p': 'precaverem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': 'precavei', '3p': null, 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null }
    }
  },

  // 6. CABER, VALER, SABER (Anomalias de 1ª Pessoa)
  {
    id: 'caber',
    infinitive: 'caber',
    primitiveRoot: 'caber',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['espcex', 'eear', 'afa', 'efomm', 'cn'],
    criticalTrapDescription: 'Presente: "eu caibo". Pretérito Perfeito: "coube, coubeste, coube, coubemos, coubestes, couberam". Subjuntivo: "se eu coubesse".',
    conjugations: {
      'indicativo_presente': { '1s': 'caibo', '2s': 'cabes', '3s': 'cabe', '1p': 'cabemos', '2p': 'cabeis', '3p': 'cabem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'coube', '2s': 'coubeste', '3s': 'coube', '1p': 'coubemos', '2p': 'coubestes', '3p': 'couberam', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'cabia', '2s': 'cabias', '3s': 'cabia', '1p': 'cabíamos', '2p': 'cabíeis', '3p': 'cabiam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'coubera', '2s': 'couberas', '3s': 'coubera', '1p': 'coubéramos', '2p': 'coubéreis', '3p': 'couberam', 'na': null },
      'indicativo_futuro_presente': { '1s': 'caberei', '2s': 'caberás', '3s': 'caberá', '1p': 'caberemos', '2p': 'cabereis', '3p': 'caberão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'caberia', '2s': 'caberias', '3s': 'caberia', '1p': 'caberíamos', '2p': 'caberíeis', '3p': 'caberiam', 'na': null },
      'subjuntivo_presente': { '1s': 'caiba', '2s': 'caibas', '3s': 'caiba', '1p': 'caibamos', '2p': 'caibais', '3p': 'caibam', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'coubesse', '2s': 'coubesses', '3s': 'coubesse', '1p': 'coubéssemos', '2p': 'coubésseis', '3p': 'coubessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'couber', '2s': 'couberes', '3s': 'couber', '1p': 'coubermos', '2p': 'couberdes', '3p': 'couberem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'cabe', '3s': 'caiba', '1p': 'caibamos', '2p': 'cabei', '3p': 'caibam', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não caibas', '3s': 'não caiba', '1p': 'não caibamos', '2p': 'não caibais', '3p': 'não caibam', 'na': null }
    }
  },
  {
    id: 'valer',
    infinitive: 'valer',
    primitiveRoot: 'valer',
    conjugationGroup: 2,
    isIrregular: true,
    isDefective: false,
    isAbundant: false,
    classification: 'irregular',
    examTags: ['eear', 'espcex', 'cn'],
    criticalTrapDescription: 'Presente: "eu valho". Subjuntivo: "valha, valhas, valha, valhamos, valhais, valham".',
    conjugations: {
      'indicativo_presente': { '1s': 'valho', '2s': 'vales', '3s': 'vale', '1p': 'valemos', '2p': 'valeis', '3p': 'valem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'vali', '2s': 'valeste', '3s': 'valeu', '1p': 'valemos', '2p': 'valestes', '3p': 'valeram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'valia', '2s': 'valias', '3s': 'valia', '1p': 'valíamos', '2p': 'valíeis', '3p': 'valiam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'valera', '2s': 'valeras', '3s': 'valera', '1p': 'valêramos', '2p': 'valêreis', '3p': 'valeram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'valerei', '2s': 'valerás', '3s': 'valerá', '1p': 'valeremos', '2p': 'valereis', '3p': 'valerão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'valeria', '2s': 'valerias', '3s': 'valeria', '1p': 'valeríamos', '2p': 'valeríeis', '3p': 'valeriam', 'na': null },
      'subjuntivo_presente': { '1s': 'valha', '2s': 'valhas', '3s': 'valha', '1p': 'valhamos', '2p': 'valhais', '3p': 'valham', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'valesse', '2s': 'valesses', '3s': 'valesse', '1p': 'valêssemos', '2p': 'valêsseis', '3p': 'valessem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'valer', '2s': 'valeres', '3s': 'valer', '1p': 'valermos', '2p': 'valerdes', '3p': 'valerem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'vale', '3s': 'valha', '1p': 'valhamos', '2p': 'valei', '3p': 'valham', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não valhas', '3s': 'não valha', '1p': 'não valhamos', '2p': 'não valhais', '3p': 'não valham', 'na': null }
    }
  },

  // 7. ABUNDANTES (Duplo Particípio)
  {
    id: 'imprimir',
    infinitive: 'imprimir',
    primitiveRoot: undefined,
    conjugationGroup: 3,
    isIrregular: false,
    isDefective: false,
    isAbundant: true,
    classification: 'abundante',
    examTags: ['espcex', 'eear', 'afa', 'efomm'],
    criticalTrapDescription: 'Duplo Particípio: "havia imprimido" (ter/haver) vs "foi impresso" (ser/estar).',
    doubleParticiple: {
      regular: 'imprimido',
      irregular: 'impresso'
    },
    conjugations: {
      'indicativo_presente': { '1s': 'imprimo', '2s': 'imprimes', '3s': 'imprime', '1p': 'imprimimos', '2p': 'imprimis', '3p': 'imprimem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'imprimi', '2s': 'imprimiste', '3s': 'imprimiu', '1p': 'imprimimos', '2p': 'imprimistes', '3p': 'imprimiram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'imprimia', '2s': 'imprimias', '3s': 'imprimia', '1p': 'imprimíamos', '2p': 'imprimíeis', '3p': 'imprimiam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'imprimira', '2s': 'imprimiras', '3s': 'imprimira', '1p': 'imprimíramos', '2p': 'imprimíreis', '3p': 'imprimiram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'imprimirei', '2s': 'imprimirás', '3s': 'imprimirá', '1p': 'imprimiremos', '2p': 'imprimireis', '3p': 'imprimirão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'imprimiria', '2s': 'imprimirias', '3s': 'imprimiria', '1p': 'imprimiríamos', '2p': 'imprimiríeis', '3p': 'imprimiriam', 'na': null },
      'subjuntivo_presente': { '1s': 'imprima', '2s': 'imprimas', '3s': 'imprima', '1p': 'imprimamos', '2p': 'imprimais', '3p': 'imprimam', 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'imprimisse', '2s': 'imprimisses', '3s': 'imprimisse', '1p': 'imprimíssemos', '2p': 'imprimísseis', '3p': 'imprimissem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'imprimir', '2s': 'imprimires', '3s': 'imprimir', '1p': 'imprimirmos', '2p': 'imprimirdes', '3p': 'imprimirem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'imprime', '3s': 'imprima', '1p': 'imprimamos', '2p': 'imprimi', '3p': 'imprimam', 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': 'não imprimas', '3s': 'não imprima', '1p': 'não imprimamos', '2p': 'não imprimais', '3p': 'não imprimam', 'na': null }
    }
  },

  // 8. DEFECTIVOS EM 1ª PESSOA: ABOLIR, COLORIR, FALIR
  {
    id: 'abolir',
    infinitive: 'abolir',
    primitiveRoot: undefined,
    conjugationGroup: 3,
    isIrregular: false,
    isDefective: true,
    isAbundant: false,
    classification: 'defectivo',
    examTags: ['eear', 'espcex', 'epcar', 'cn'],
    criticalTrapDescription: 'Defectivo: não possui 1ª pessoa do singular do presente ("eu abolo" NÃO existe). Consequentemente, não tem presente do subjuntivo!',
    conjugations: {
      'indicativo_presente': { '1s': null, '2s': 'aboles', '3s': 'abole', '1p': 'abolimos', '2p': 'abolis', '3p': 'abolem', 'na': null },
      'indicativo_pret_perfeito': { '1s': 'aboli', '2s': 'aboliste', '3s': 'aboliu', '1p': 'abolimos', '2p': 'abolistes', '3p': 'aboliram', 'na': null },
      'indicativo_pret_imperfeito': { '1s': 'abolia', '2s': 'abolias', '3s': 'abolia', '1p': 'abolíamos', '2p': 'abolíeis', '3p': 'aboliam', 'na': null },
      'indicativo_pret_mais_que_perfeito': { '1s': 'abolira', '2s': 'aboliras', '3s': 'abolira', '1p': 'abolíramos', '2p': 'abolíreis', '3p': 'aboliram', 'na': null },
      'indicativo_futuro_presente': { '1s': 'abolirei', '2s': 'abolirás', '3s': 'abolirá', '1p': 'aboliremos', '2p': 'abolireis', '3p': 'abolirão', 'na': null },
      'indicativo_futuro_preterito': { '1s': 'aboliria', '2s': 'abolirias', '3s': 'aboliria', '1p': 'aboliríamos', '2p': 'aboliríeis', '3p': 'aboliriam', 'na': null },
      'subjuntivo_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null },
      'subjuntivo_pret_imperfeito': { '1s': 'abolisse', '2s': 'abolisses', '3s': 'abolisse', '1p': 'abolíssemos', '2p': 'abolísseis', '3p': 'abolissem', 'na': null },
      'subjuntivo_futuro_subjuntivo': { '1s': 'abolir', '2s': 'abolires', '3s': 'abolir', '1p': 'abolirmos', '2p': 'abolirdes', '3p': 'abolirem', 'na': null },
      'imperativo_af_presente': { '1s': null, '2s': 'abole', '3s': null, '1p': null, '2p': 'aboli', '3p': null, 'na': null },
      'imperativo_neg_presente': { '1s': null, '2s': null, '3s': null, '1p': null, '2p': null, '3p': null, 'na': null }
    }
  },
  ...REGULAR_VERBS,
  ...EXPANDED_CANONICAL_VERBS
];

export const PRONOUN_LABELS: Record<string, string> = {
  '1s': 'Eu',
  '2s': 'Tu',
  '3s': 'Ele / Ela',
  '1p': 'Nós',
  '2p': 'Vós',
  '3p': 'Eles / Elas'
};

export const TENSE_PRETTY_NAMES: Record<string, string> = {
  'indicativo_presente': 'Presente do Indicativo',
  'indicativo_pret_perfeito': 'Pretérito Perfeito do Indicativo',
  'indicativo_pret_imperfeito': 'Pretérito Imperfeito do Indicativo',
  'indicativo_pret_mais_que_perfeito': 'Pret. Mais-que-Perfeito (Simples)',
  'indicativo_futuro_presente': 'Futuro do Presente do Indicativo',
  'indicativo_futuro_preterito': 'Futuro do Pretérito do Indicativo',
  'subjuntivo_presente': 'Presente do Subjuntivo',
  'subjuntivo_pret_imperfeito': 'Pretérito Imperfeito do Subjuntivo',
  'subjuntivo_futuro_subjuntivo': 'Futuro do Subjuntivo',
  'imperativo_af_presente': 'Imperativo Afirmativo',
  'imperativo_neg_presente': 'Imperativo Negativo'
};
