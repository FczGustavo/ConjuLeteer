const fs = require('fs');

const content = fs.readFileSync('src/data/englishQuestionBank.ts', 'utf8');
const startIdx = content.indexOf('JSON.parse(');
if (startIdx !== -1) {
  const jsonLiteral = content.substring(startIdx + 'JSON.parse('.length, content.lastIndexOf(');'));
  // evaluate or parse the string literal
  const jsonStr = JSON.parse(jsonLiteral);
  const questions = JSON.parse(jsonStr);
  console.log('Total 1500 questions:', questions.length);
  
  const jfs = questions.filter(q => 
    (q.banca && /jfs|germano|jefferson|jerfeson/i.test(q.banca)) ||
    (q.examMetadata && /jfs|germano|jefferson|jerfeson/i.test(q.examMetadata.board)) ||
    (q.statement && /germano|jefferson|jerfeson/i.test(q.statement))
  );
  console.log('Authorial total in 1500 bank:', jfs.length);
  
  const statuses = {};
  for (const q of jfs) {
    const s = q.quality?.status || 'none';
    statuses[s] = (statuses[s] || 0) + 1;
  }
  console.log('Statuses of authorial questions:', statuses);
  
  const unquarantined = jfs.filter(q => q.quality?.status !== 'quarantined');
  console.log('Unquarantined count:', unquarantined.length);
  if (unquarantined.length > 0) {
    console.log('Example unquarantined:', unquarantined[0].id, unquarantined[0].banca);
  }
} else {
  console.log('JSON.parse not found');
}
