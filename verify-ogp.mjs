import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const base='https://onebe-inc.github.io/sample_salon2/';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

export async function verifyOgp({live=false,sourceFile}={}){
  const provenance=JSON.parse(await fs.readFile(path.join(root,'assets/ogp-provenance.json'),'utf8'));
  const imagePath=path.join(root,'dist/assets',provenance.file);
  const localImage=await fs.readFile(imagePath);
  const image=live?Buffer.from(await (await get(provenance.public_url)).arrayBuffer()):localImage;
  assert.equal(image.subarray(0,8).toString('hex'),'89504e470d0a1a0a','Real PNG signature');
  const width=image.readUInt32BE(16),height=image.readUInt32BE(20);
  assert.equal(width,provenance.width);assert.equal(height,provenance.height);
  assert.equal(image.length,provenance.bytes);assert.equal(hash(image),provenance.sha256,'Image must be unmodified');
  assert.equal(hash(localImage),provenance.sha256);
  if(sourceFile)assert.equal(hash(await fs.readFile(sourceFile)),provenance.sha256,'Original source file must be unchanged');
  const pages=[];
  for(const file of (await fs.readdir(path.join(root,'dist'))).filter(n=>n.endsWith('.html'))){
    const url=base+(file==='index.html'?'':file);
    const localHtml=await fs.readFile(path.join(root,'dist',file),'utf8');
    const html=live?await(await get(url)).text():localHtml;
    if(live)assert.equal(html,localHtml,`${file}: live HTML matches build`);
    const head=html.match(/<head>([\s\S]*?)<\/head>/)[1];
    const meta=new Map();
    for(const tag of head.matchAll(/<meta\s+[^>]*>/g)){
      const attrs=Object.fromEntries([...tag[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
      const key=attrs.property||attrs.name;if(!key)continue;
      assert(!meta.has(key),`${file}: duplicate metadata ${key}`);meta.set(key,attrs.content);
    }
    const expected={
      'og:image':provenance.public_url,'og:image:secure_url':provenance.public_url,
      'og:image:type':'image/png','og:image:width':String(width),'og:image:height':String(height),
      'twitter:image':provenance.public_url,'twitter:card':'summary_large_image','og:url':url
    };
    for(const [key,value] of Object.entries(expected))assert.equal(meta.get(key),value,`${file}: ${key}`);
    const title=head.match(/<title>(.*?)<\/title>/)[1];
    assert.equal(meta.get('og:title'),title);assert.equal(meta.get('twitter:title'),title);
    assert.equal(meta.get('og:description'),meta.get('description'));
    assert.equal(meta.get('twitter:description'),meta.get('description'));
    assert(meta.get('og:image:alt'));assert.equal(meta.get('twitter:image:alt'),meta.get('og:image:alt'));
    pages.push({file,url,metadata:Object.fromEntries(meta),matchesBuild:true});
  }
  assert.equal(pages.length,7);
  return{checkedAt:new Date().toISOString(),scope:live?'public GitHub Pages':'local build',image:{url:provenance.public_url,type:'image/png',width,height,bytes:image.length,sha256:hash(image),matchesUserOriginal:true,sourceFileRechecked:!!sourceFile},pages,result:'PASS'};
}
async function get(url){const response=await fetch(url,{cache:'no-store'});assert.equal(response.status,200,url);if(url.endsWith('.png'))assert.match(response.headers.get('content-type')||'',/^image\/png(?:;|$)/);return response;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const option=name=>{const i=process.argv.indexOf(name);return i<0?undefined:process.argv[i+1];};
  const report=await verifyOgp({live:process.argv.includes('--live'),sourceFile:option('--source')});
  if(option('--report'))await fs.writeFile(option('--report'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({result:report.result,scope:report.scope,pages:report.pages.length,image:report.image,report:option('--report')},null,2));
}
