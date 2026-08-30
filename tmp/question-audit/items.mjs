import fs from 'node:fs'; import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const d=new Uint8Array(fs.readFileSync('lists/1. Fonética e Fonologia.pdf')); const doc=await pdfjsLib.getDocument({data:d,disableWorker:true}).promise;
const p=await doc.getPage(18); const c=await p.getTextContent(); let show=false;
for(const it of c.items){if(!('str' in it))continue; if(it.str.includes('homem')||it.str.includes('ex')||it.str.includes('sud')||it.str.includes('cabis')) show=true; if(show) console.log(JSON.stringify({str:it.str,x:it.transform?.[4],y:it.transform?.[5],w:it.width,h:it.height,eol:it.hasEOL})); if(show && it.str.includes('sol')) break;}
