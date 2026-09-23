// Run after npm run build when site copy changes; then rebuild to publish.
import fs from 'node:fs/promises';
import {load} from 'cheerio';
const root=new URL('./',import.meta.url);
let characters='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:/&¥© →×▷Ⅱ';
for(const file of (await fs.readdir(new URL('dist/',root))).filter(f=>f.endsWith('.html'))){
 const $=load(await fs.readFile(new URL(`dist/${file}`,root),'utf8'));
 $('script').remove();characters+=$('body').text();
}
characters=[...new Set(characters)].sort().join('');
const families=[
 ['Shippori Mincho','shippori-mincho-regular','shipporimincho'],
 ['EB Garamond','eb-garamond-regular','ebgaramond'],
 ['Noto Sans JP','noto-sans-jp-regular','notosansjp']
];
for(const [family,filename,directory]of families){
 const text=family==='EB Garamond'?characters.replace(/[^\x20-\x7f¥©]/g,''):characters;
 const url='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family)+':wght@400&text='+encodeURIComponent(text);
 const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}});
 if(!response.ok)throw new Error(`${family}: ${response.status}`);
 const css=await response.text(),fontUrl=css.match(/url\(([^)]+)\)/)?.[1];
 if(!fontUrl)throw new Error(`${family}: missing download URL`);
 const fontResponse=await fetch(fontUrl);if(!fontResponse.ok)throw new Error('Font download failed');
 const bytes=Buffer.from(await fontResponse.arrayBuffer());
 if(bytes.toString('ascii',0,4)!=='wOF2')throw new Error(`${family}: expected WOFF2`);
 const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${directory}/OFL.txt`);
 if(!license.ok)throw new Error(`${family}: license download failed`);
 await fs.writeFile(new URL(`assets/${filename}.woff2`,root),bytes);
 await fs.writeFile(new URL(`assets/${filename}-OFL.txt`,root),await license.text());
 console.log(`${family}: Regular, ${bytes.length} bytes, OFL bundled`);
}
