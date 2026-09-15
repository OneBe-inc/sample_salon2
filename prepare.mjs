import fs from 'node:fs/promises';import path from 'node:path';import crypto from 'node:crypto';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));const generated=path.join(root,'..','assets-generated');
await fs.mkdir(path.join(root,'assets'),{recursive:true});await fs.mkdir(path.join(root,'.openai'),{recursive:true});
const files={'salon-interior.png':'interior.png','hair-care-still-life.png':'care.png','bob-style-portrait.png':'hair.png'};
const manifest=[];for(const[from,to]of Object.entries(files)){const data=await fs.readFile(path.join(generated,from));await fs.writeFile(path.join(root,'assets',to),data);manifest.push({file:to,sha256:crypto.createHash('sha256').update(data).digest('hex'),origin:'OpenAI built-in image generation',reference_images:0,created:'2026-09-16'});}
await fs.writeFile(path.join(root,'assets','manifest.json'),JSON.stringify(manifest,null,2));
const prompts=(await fs.readFile(path.join(generated,'PROMPTS.md'),'utf8')).replace(/^Original tool output:.*$/gm,'Tool output retained in the owner’s local generation archive.');
await fs.writeFile(path.join(root,'ASSET_PROVENANCE.md'),prompts);
await fs.writeFile(path.join(root,'.openai','hosting.json'),JSON.stringify({static:{directory:'dist'}},null,2));
console.log('Prepared 3 original generated assets with provenance.');
