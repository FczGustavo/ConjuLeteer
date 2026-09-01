/**
 * Canonical URL directory for exam boards and universities in ConjuLetter.
 * Maps boards/institutions to their official past exams repository (provas antigas / vestibulares anteriores)
 * or institutional exam portal.
 */

export const BOARD_EXAM_URLS: Record<string, string> = {
  // Military Academies & Armed Forces
  ITA: 'http://www.vestibular.ita.br/provas.htm',
  IME: 'http://www.ime.eb.mil.br/provas-anteriores.html',
  EsPCEx: 'http://www.espcex.eb.mil.br/index.php/provas-anteriores',
  AFA: 'https://ingresso.fab.mil.br/',
  EEAr: 'https://ingresso.fab.mil.br/',
  EFOMM: 'https://www.marinha.mil.br/ciaga/efomm-processo-seletivo',
  EN: 'https://www.marinha.mil.br/ensino/',

  // Public & State Universities / Vestibulares
  FUVEST: 'https://www.fuvest.br/provas-e-gabaritos/',
  UNESP: 'https://www.vunesp.com.br/',
  FATEC: 'https://www.vestibularfatec.com.br/provas-gabaritos/',
  UERJ: 'https://www.vestibular.uerj.br/',
  UFF: 'http://www.coseac.uff.br/',
  UFMG: 'https://www.ufmg.br/copeve/',
  UFPE: 'https://www.ufpe.br/vestibular',
  UFPR: 'http://www.nc.ufpr.br/',
  UFRGS: 'http://www.ufrgs.br/coperse/concurso-vestibular/provas-e-gabaritos',
  UFRS: 'http://www.ufrgs.br/coperse/concurso-vestibular/provas-e-gabaritos',
  UFSC: 'https://coperve.ufsc.br/',
  UFSCar: 'https://www.vestibular.ufscar.br/',
  UFC: 'https://ccv.ufc.br/',
  UFAL: 'https://copeve.ufal.br/',
  UFG: 'https://centrodeselecao.ufg.br/',
  UFMA: 'https://concursos.ufma.br/',
  UFPB: 'http://www.comvest.ufpb.br/',
  UFPEL: 'http://wp.ufpel.edu.br/cra/processos-seletivos/',
  UFRN: 'https://comperve.ufrn.br/',
  UFRRJ: 'https://portal.ufrrj.br/',
  UFSM: 'https://www.ufsm.br/pro-reitorias/prograd/coperves',
  UFV: 'https://www.vestibular.ufv.br/',
  UEL: 'http://www.cops.uel.br/',
  UECE: 'http://www.cev.uece.br/',
  UDESC: 'https://www.udesc.br/vestibular',
  UNIFESP: 'https://vestibular.unifesp.br/',
  UNIOESTE: 'https://www.unioeste.br/portal/vestibular',
  UNIRIO: 'http://www.unirio.br/prograd/processo-seletivo',
  UNITAU: 'https://unitau.br/vestibular/',
  FURG: 'https://coperse.furg.br/',
  FMTM: 'http://www.uftm.edu.br/',

  // Private & Community Universities
  MACKENZIE: 'https://www.mackenzie.br/processos-seletivos/vestibular-graduacao/',
  'PUC-Rio': 'http://www.puc-rio.br/vestibular/provas.html',
  'PUC-SP': 'https://www.pucsp.br/vestibular/provas-anteriores',
  'PUC-RS': 'https://estude.pucrs.br/provas-anteriores',
  'PUC-PR': 'https://multiversa.pucpr.br/vestibular/',
  'PUC-MG': 'https://www.pucminas.br/destaques/Paginas/Vestibular.aspx',
  PUCCAMP: 'https://www.puc-campinas.edu.br/vestibular/',
  PUC: 'https://www.pucsp.br/vestibular/provas-anteriores',
  FGV: 'https://vestibular.fgv.br/',
  FAAP: 'https://www.faap.br/vestibular/',
  FEI: 'https://fei.edu.br/vestibular/',
  FASM: 'https://www.fasm.edu.br/',
  OSEC: 'https://unisa.br/',
  UNIT: 'https://www.unit.br/vestibular',

  // Concurso Organizers & Author Portals
  CESGRANRIO: 'https://www.cesgranrio.org.br/',
  JFS: 'https://jeffersoncelestino.wordpress.com/',
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
