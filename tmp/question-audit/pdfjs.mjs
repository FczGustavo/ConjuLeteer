import fs from 'node:fs'; import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const data=new Uint8Array(fs.readFileSync('lists/1. Fonética e Fonologia.pdf')); const doc=await pdfjsLib.getDocument({data,disableWorker:true}).promise; let all='';
for(let n=1;n<=doc.numPages;n++){const p=await doc.getPage(n);const c=await p.getTextContent();let t='';for(const it of c.items){if(!('str' in it))continue;t+=it.str+(it.hasEOL?'\n':' ')} all+=`\n---PAGE ${n}---\n`+t;}
let s=all.indexOf('Questão 6 ');console.log(all.slice(s,s+7000));
