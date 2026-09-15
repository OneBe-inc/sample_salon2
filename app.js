// Native dialogs support focus containment and Escape without third-party code.
let opener=null;
document.addEventListener('click',event=>{
 const trigger=event.target.closest('[data-dialog]');
 if(trigger){const dialog=document.getElementById(trigger.dataset.dialog);if(!dialog)return;opener=trigger;dialog.showModal();if(trigger.hasAttribute('aria-expanded'))trigger.setAttribute('aria-expanded','true');return;}
 const close=event.target.closest('.close-dialog');if(close){close.closest('dialog').close();return;}
 const link=event.target.closest('dialog a');if(link)link.closest('dialog').close();
});
document.querySelectorAll('dialog').forEach(dialog=>{
 dialog.addEventListener('close',()=>{if(opener){if(opener.hasAttribute('aria-expanded'))opener.setAttribute('aria-expanded','false');opener.focus();}});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
});
if(location.pathname.endsWith('/story.html')){const id=new URLSearchParams(location.search).get('article');if(id==='0')location.replace('./announcement.html');if(id==='2')location.replace('./recruit.html');}
