/**
 * Canonical URL directory for exam boards and universities in ConjuLetter.
 * Maps boards/institutions to their official past exams repository (provas antigas / vestibulares anteriores)
 * or institutional exam portal.
 */

export const BOARD_EXAM_URLS: Record<string, string> = {
  // Military Academies & Armed Forces
  ITA: 'https://www.vestibular.ita.br/provas.htm',
  IME: 'https://www.ime.eb.mil.br/',
  EsPCEx: 'https://www.espcex.eb.mil.br/index.php/concurso',
  AFA: 'https://ingresso.fab.mil.br/',
  EEAr: 'https://ingresso.fab.mil.br/',
  EFOMM: 'https://www.marinha.mil.br/ciaga/',
  EN: 'https://www.marinha.mil.br/sspm/',

  // Public & State Universities / Vestibulares
  FUVEST: 'https://www.fuvest.br/vestibular-da-usp/',
  UNESP: 'https://www.vunesp.com.br/',
  FATEC: 'https://vestibular.fatec.sp.gov.br/home/',
  UERJ: 'https://www.vestibular.uerj.br/',
  UFF: 'https://www.uff.br/',
  UFMG: 'https://www.ufmg.br/copeve/',
  UFPE: 'https://www.ufpe.br/',
  UFPR: 'https://nc.ufpr.br/',
  UFRGS: 'https://www.ufrgs.br/coperse/',
  UFRS: 'https://www.ufrgs.br/coperse/',
  UFSC: 'https://coperve.ufsc.br/',
  UFSCar: 'https://www.ufscar.br/',
  UFC: 'https://ccv.ufc.br/',
  UFAL: 'https://copeve.ufal.br/',
  UFG: 'https://institutoverbena.ufg.br/',
  UFMA: 'https://concursos.ufma.br/',
  UFPB: 'https://www.ufpb.br/',
  UFPEL: 'https://wp.ufpel.edu.br/cra/processos-seletivos/',
  UFRN: 'https://comperve.ufrn.br/',
  UFRRJ: 'https://portal.ufrrj.br/',
  UFSM: 'https://www.ufsm.br/',
  UFV: 'https://www.ufv.br/',
  UEL: 'https://www.uel.br/',
  UECE: 'https://www.cev.uece.br/',
  UDESC: 'https://www.udesc.br/vestibular',
  UNIFESP: 'https://www.unifesp.br/',
  UNIOESTE: 'https://www.unioeste.br/portal/vestibular',
  UNIRIO: 'https://www.unirio.br/',
  UNITAU: 'https://unitau.br/vestibular/',
  FURG: 'https://coperse.furg.br/',
  FMTM: 'https://www.uftm.edu.br/',

  // Private & Community Universities
  MACKENZIE: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/',
  'PUC-Rio': 'https://www.puc-rio.br/vestibular/',
  'PUC-SP': 'https://nucvest.com.br/',
  'PUC-RS': 'https://portal.pucrs.br/ensino/',
  'PUC-PR': 'https://www.pucpr.br/',
  'PUC-MG': 'https://www.pucminas.br/',
  PUCCAMP: 'https://vestibular.puc-campinas.edu.br/',
  PUC: 'https://nucvest.com.br/',
  FGV: 'https://vestibular.fgv.br/',
  FAAP: 'https://www.faap.br/vestibular/',
  FEI: 'https://fei.edu.br/vestibular/',
  FASM: 'https://www.santamarcelina.edu.br/faculdade/',
  OSEC: 'https://www.unisa.br/',
  UNIT: 'https://www.unit.br/vestibular',

  // Concurso Organizers
  CESGRANRIO: 'https://www.cesgranrio.org.br/',
};

/**
 * Returns the official past exams or institution portal URL for a given board code.
 */
export function getBoardExamUrl(board?: string): string | undefined {
  if (!board) return undefined;
  const normalized = board.trim();
  if (BOARD_EXAM_URLS[normalized]) {
    return BOARD_EXAM_URLS[normalized];
  }
  // Case-insensitive lookup fallback
  const upper = normalized.toUpperCase();
  const match = Object.entries(BOARD_EXAM_URLS).find(
    ([key]) => key.toUpperCase() === upper
  );
  return match ? match[1] : undefined;
}
