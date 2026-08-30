import fs from 'node:fs'; import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
const d=new Uint8Array(fs.readFileSync('lists/2. Acentuação.pdf'));const doc=await pdfjsLib.getDocument({data:d,disableWorker:true}).promise;
for(let n=50;n<=51;n++){const p=await doc.getPage(n);const c=await p.getTextContent();let t='';let prev=null;for(const it of c.items){if(!('str'in it))continue;const v=it.str;if(v){if(prev&&!/^\s*$/.test(v)&&!/^\s*$/.test(prev.str)){const gap=it.transform[4]-(prev.transform[4]+(prev.width||0));if(gap>2.5)t+=' ';}t+=v;}if(it.hasEOL)t+='\n';prev=it;}if(t.includes('Denise Ham'))console.log(repr(t.slice(t.indexOf('Denise Ham')-100,t.indexOf('Denise Ham')+100)));}
function repr(x){return JSON.stringify(x)}
