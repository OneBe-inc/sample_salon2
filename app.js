const root = document.documentElement;
const finishLoading = () => { root.classList.add('is-ready'); document.querySelector('.loading-screen')?.remove(); };
if (document.body.classList.contains('home-page')) setTimeout(finishLoading, Math.max(0, 1500 - (performance.now() - (window.salonStart || 0))));
else finishLoading();
let lastTrigger;
document.querySelectorAll('[data-dialog]').forEach(trigger => trigger.addEventListener('click', () => {
 const dialog = document.getElementById(trigger.dataset.dialog);
 if (!dialog) return;
 document.querySelectorAll('dialog[open]').forEach(open => open.close());
 lastTrigger = trigger;
 dialog.showModal();
 document.body.classList.add('dialog-open');
 document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', String(dialog.id === 'navigation'));
}));
document.querySelectorAll('dialog').forEach(dialog => {
 dialog.querySelectorAll('.dialog-close, .dialog-close-button').forEach(button => button.addEventListener('click', () => dialog.close()));
 dialog.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => dialog.close()));
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const r=dialog.getBoundingClientRect();
  if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
 });
 dialog.addEventListener('close', () => {
  if (!document.querySelector('dialog[open]')) {
   document.body.classList.remove('dialog-open');
   document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
   if(lastTrigger?.isConnected && !lastTrigger.closest('dialog:not([open])')) lastTrigger.focus({preventScroll:true});
   else document.querySelector('.menu-toggle')?.focus({preventScroll:true});
  }
 });
});
const motionButton = document.querySelector('.motion-toggle');
motionButton?.addEventListener('click', () => {
 const paused=root.classList.toggle('motion-paused');
 motionButton.setAttribute('aria-pressed',String(paused));
 motionButton.setAttribute('aria-label',paused?'写真の動きを再開':'写真の動きを一時停止');
 motionButton.firstElementChild.textContent=paused?'▷':'Ⅱ';
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});
 document.querySelectorAll('.reveal').forEach(element=>{element.classList.add('will-reveal');observer.observe(element);});
}
