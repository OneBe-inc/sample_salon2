import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {fileURLToPath} from 'node:url';
import {verifyOgp} from './verify-ogp.mjs';
import {measurementId, tagUrl} from './analytics.mjs';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'dist');
const files=(await fs.readdir(out)).filter(f=>f.endsWith('.html')&&f!=='404.html');
const docs=new Map();let links=0;
for(const file of files){
 const $=load(await fs.readFile(path.join(out,file),'utf8'));docs.set(file,$);
 assert.equal($('html').attr('lang'),'ja');assert.equal($('h1').length,1,file);
 assert.equal($('title').length,1);assert.equal($('meta[name=description]').length,1);
 const ids=$('[id]').map((_,e)=>$(e).attr('id')).get();assert.equal(new Set(ids).size,ids.length,`${file}: unique IDs`);
 assert.equal($('link[rel=canonical]').attr('href'),'https://onebe-inc.github.io/sample_salon2/'+(file==='index.html'?'':file));
 assert.equal($('meta[name=robots]').attr('content'),'noindex,nofollow',`${file}: preserve sample index policy`);
 assert($('body').text().includes('デザインサンプル'));assert($('body').text().includes('OneBe.inc'));
 $('script[type="application/ld+json"]').each((_,e)=>assert.equal(JSON.parse($(e).text())['@type'],'WebPage'));
 let level=0;$('main h1,main h2,main h3,main h4,main h5,main h6').each((_,e)=>{const current=Number(e.tagName[1]);assert(current<=level+1,`${file}: heading order`);assert($(e).text().trim());level=current;});
 $('img').each((_,e)=>{assert($(e).attr('alt')!==undefined);assert($(e).attr('width'));assert($(e).attr('height'));});
 $('[data-dialog]').each((_,e)=>assert($(`[id="${$(e).attr('data-dialog')}"]`).length));
 const consultation=$('a.web-consultation');
 assert.equal(consultation.length,1,`${file}: one studio consultation link`);
 assert.equal(consultation.attr('href'),'https://lin.ee/QeJVRgH');
 assert.equal(consultation.find('.web-consultation-label').text(),'Web制作を相談する');
 assert.equal(consultation.attr('target'),'_blank');
 assert(consultation.attr('rel').split(/\s+/).includes('noopener'));
}
for(const [file,$]of docs){for(const e of $('[href],[src]').toArray()){
 const ref=$(e).attr('href')||$(e).attr('src');if(/^https?:/.test(ref)){assert($(e).is('link[rel=canonical]')||($(e).is('a.web-consultation')&&ref==='https://lin.ee/QeJVRgH')||($(e).is('script[async]')&&ref===tagUrl));continue;}
 const url=new URL(ref,'https://site.invalid/'+file);let target=url.pathname.slice(1);if(!target||target.endsWith('/'))target+='index.html';
 await fs.access(path.join(out,target));if(url.hash)assert(docs.get(target)?.(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).length,`${file} → ${ref}`);links++;
}}
await verifyOgp();
for(const file of [...files,'404.html']){
 const $=load(await fs.readFile(path.join(out,file),'utf8'));
 const tags=$('head script[src*="googletagmanager.com/gtag/js"]');
 assert.equal(tags.length,1,`${file}: exactly one Google tag`);
 assert.equal(tags.attr('src'),tagUrl);assert(tags.is('[async]'));
 const configuration=$('head script:not([src])').toArray().filter(e=>$(e).text().includes(`gtag('config', '${measurementId}')`));
 assert.equal(configuration.length,1,`${file}: exactly one GA4 configuration`);
}
console.log(`PASS: GA4 ${measurementId} on all 10 pages, including 404.`);
assert.equal(files.length,9);console.log(`PASS: 9 HTML pages, ${links} internal links/assets, heading order, metadata, screenshot OGP hash, noindex policy.`);
