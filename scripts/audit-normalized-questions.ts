import { writeFileSync } from 'node:fs';
import { QUESTION_BANK } from '../src/data/questionBank';
import { ENGLISH_QUESTION_BANK } from '../src/data/englishQuestionBank';
import { normalizeQuestionSupport } from '../src/utils/questionSupport';

const source=[...QUESTION_BANK,...ENGLISH_QUESTION_BANK];
const changes: Array<{id:string;fields:string[]}>=[]; const failures:string[]=[];
for(const question of source){
  const normalized=normalizeQuestionSupport(question); const fields:string[]=[];
  for(const field of ['statement','readingText','support','quality'] as const){if(JSON.stringify(question[field])!==JSON.stringify(normalized[field])) fields.push(field);}
  if(fields.length) changes.push({id:question.id,fields});
  if(normalized.id!==question.id||normalized.correctLetter!==question.correctLetter||normalized.options.length!==question.options.length||normalized.options.some((option,index)=>option.correct!==question.options[index]?.correct)) failures.push(question.id);
}
writeFileSync('reports/normalized-question-audit.json',JSON.stringify({generatedAt:new Date().toISOString(),questions:source.length,changed:changes.length,changes,failures},null,2));
if(failures.length){console.error(`Falha: ${failures.length} questões tiveram estrutura/gabarito alterado.`);process.exit(1);} console.log(`Normalização aprovada: ${source.length} questões; ${changes.length} alterações editoriais registradas.`);
