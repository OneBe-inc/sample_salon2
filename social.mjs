// Site-wide social card captures the current first view at the requested OGP size.
export const siteUrl='https://onebe-inc.github.io/sample_salon2/';
export const socialImage={
  file:'onebe-salon-fv-ogp-20260924.jpg',
  url:siteUrl+'assets/onebe-salon-fv-ogp-20260924.jpg',
  type:'image/jpeg',width:1200,height:630,
  alt:'OneBe salonのファーストビュー。「髪が整うと、わたしが整う。」の見出しと、自然光に包まれた店内。'
};
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function socialMetadata(title,description,page){
  const properties={
    'og:type':['story','announcement','recruit'].includes(page)?'article':'website',
    'og:locale':'ja_JP','og:site_name':'OneBe salon',
    'og:title':title,'og:description':description,
    'og:url':siteUrl+(page==='index'?'':page+'.html'),
    'og:image':socialImage.url,'og:image:secure_url':socialImage.url,
    'og:image:type':socialImage.type,'og:image:width':socialImage.width,
    'og:image:height':socialImage.height,'og:image:alt':socialImage.alt
  };
  const names={
    'twitter:card':'summary_large_image','twitter:title':title,
    'twitter:description':description,'twitter:image':socialImage.url,
    'twitter:image:alt':socialImage.alt
  };
  return Object.entries(properties).map(([key,value])=>`<meta property="${key}" content="${esc(value)}">`).join('')
    +Object.entries(names).map(([key,value])=>`<meta name="${key}" content="${esc(value)}">`).join('');
}
