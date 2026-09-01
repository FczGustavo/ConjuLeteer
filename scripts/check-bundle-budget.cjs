const { readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');
const { gzipSync } = require('node:zlib');
const dir=join(process.cwd(),'dist','assets');
const entry=readdirSync(dir).filter(file=>/^index-.*\.js$/.test(file)).map(file=>({file,path:join(dir,file)})).sort((a,b)=>statSync(b.path).size-statSync(a.path).size)[0];
if(!entry) throw new Error('Chunk inicial não encontrado. Rode o build antes.');
const gzip=gzipSync(require('node:fs').readFileSync(entry.path)).length;
console.log(`Chunk inicial ${entry.file}: ${(gzip/1024).toFixed(2)} KiB gzip.`);
if(gzip>250*1024){console.error('Orçamento de 250 KiB gzip excedido.');process.exit(1);}
