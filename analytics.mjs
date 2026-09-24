// GA4: 株式会社OneBe / DEMO_salon1 / DEMO_salon1 Web.
export const measurementId = 'G-6QQ7DF747M';
export const tagUrl = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
export const analyticsTag = `<!-- Google tag (gtag.js) -->
<script async src="${tagUrl}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}');
</script>`;
