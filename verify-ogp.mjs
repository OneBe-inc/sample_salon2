import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {load} from 'cheerio';
const root=path.dirname(fileURLToPath(import.meta.url));
const base='https://onebe-inc.github.io/sample_salon2/';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
async function get(url){const r=await fetch(url,{cache:'no-store'});assert.equal(r.status,200,url);return r;}
export async function verifyOgp({live=false,sourceFile}={}){
 const p=JSON.parse(await fs.readFile(path.join(root,'assets/ogp-provenance.json'),'utf8'));
 const local=await fs.readFile(path.join(root,'dist/assets',p.file));
 const image=live?Buffer.from(await(await get(p.public_url)).arrayBuffer()):local;
 assert.equal(image.subarray(0,3).toString('hex'),'ffd8ff','JPEG signature');
 assert.equal(image.length,p.bytes);assert.equal(hash(image),p.sha256);assert.equal(hash(local),p.sha256);
 if(sourceFile)assert.equal(hash(await fs.readFile(sourceFile)),p.sha256);
 const pages=[];
 for(const file of (await fs.readdir(path.join(root,'dist'))).filter(f=>f.endsWith('.html')&&f!=='404.html')){
  const url=base+(file==='index.html'?'':file),localHtml=await fs.readFile(path.join(root,'dist',file),'utf8');
  const html=live?await(await get(url)).text():localHtml;
  if(live)assert.equal(html,localHtml,`${file}: live HTML matches build`);
  const $=load(html),meta=new Map();
  $('head meta[name],head meta[property]').each((_,el)=>{const k=$(el).attr('property')||$(el).attr('name');assert(!meta.has(k),`${file}: duplicate ${k}`);meta.set(k,$(el).attr('content'));});
  const expected={'og:image':p.public_url,'og:image:secure_url':p.public_url,'og:image:type':p.mime_type,'og:image:width':String(p.width),'og:image:height':String(p.height),'twitter:image':p.public_url,'twitter:card':'summary_large_image','og:url':url,'og:site_name':'OneBe salon'};
  for(const [k,v]of Object.entries(expected))assert.equal(meta.get(k),v,`${file}: ${k}`);
  assert.equal(meta.get('og:title'),$('title').text());assert.equal(meta.get('twitter:title'),$('title').text());
  assert.equal(meta.get('og:description'),meta.get('description'));assert.equal(meta.get('twitter:description'),meta.get('description'));assert(meta.get('og:image:alt'));
  assert.equal(meta.get('robots'),'noindex,nofollow',`${file}: noindex policy`);
  pages.push({url,status:'PASS'});
 }
 assert.equal(pages.length,9);
 const notFoundHtml=live?await(await get(base+'404.html')).text():await fs.readFile(path.join(root,'dist/404.html'),'utf8');
 assert.equal(load(notFoundHtml)('meta[name=robots]').attr('content'),'noindex','404 noindex policy');
 return {checkedAt:new Date().toISOString(),scope:live?'public GitHub Pages':'local build',image:{...p,matchesRecordedScreenshot:true},pages,noindexPages:pages.length+1,result:'PASS'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const option=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
 const report=await verifyOgp({live:process.argv.includes('--live'),sourceFile:option('--source')});
 if(option('--report'))await fs.writeFile(option('--report'),JSON.stringify(report,null,2));
 console.log(`PASS: ${report.pages.length} pages, OGP ${report.image.width}×${report.image.height}, screenshot SHA-256; noindex on ${report.noindexPages} pages; ${report.scope}`);
}
