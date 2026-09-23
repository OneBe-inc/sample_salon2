// Site-wide social card uses the unmodified image expressly supplied by the user.
export const siteUrl='https://onebe-inc.github.io/sample_salon2/';
export const socialImage={
  file:'onebe-ogp-20260924.jpg',
  url:siteUrl+'assets/onebe-ogp-20260924.jpg',
  type:'image/jpeg',width:1672,height:941,
  alt:'One Beの定額Webサービスと、限定30社のモニター特別価格を案内する広告画像。'
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
