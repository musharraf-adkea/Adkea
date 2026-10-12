(() => {
 const root=document.documentElement;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const dropDuration=600;
 const navigationKey='adkea.loader.navigation';
 let recoveryTimer,finishTimer,navigationTimer,minUntil=Infinity,navigating=false;
 let pageReady=document.readyState!=='loading';
 const overlay=()=>document.querySelector('.page-loader');
 const duration=()=>motion.matches||document.body?.classList.contains('motion-paused')?0:dropDuration;
 const path=value=>value.replace(/\/index\.html$/,'/').replace(/\.html$/,'').replace(/\/$/,'')||'/';
 const pageKey=url=>path(url.pathname)+url.search;
 let completedNavigation=false;
 try {
  const previous=JSON.parse(sessionStorage.getItem(navigationKey)||'null');
  sessionStorage.removeItem(navigationKey);
  completedNavigation=previous?.page===pageKey(new URL(location.href))&&Date.now()-previous.at<8000;
 } catch {}
 function hide(){
  clearTimeout(recoveryTimer);clearTimeout(finishTimer);
  root.classList.remove('page-loading','loader-running','loader-complete');
  overlay()?.setAttribute('aria-hidden','true');
 }
 function showBackdrop(){
  clearTimeout(recoveryTimer);clearTimeout(finishTimer);
  root.classList.add('page-loading');
  overlay()?.setAttribute('aria-hidden','false');
  recoveryTimer=setTimeout(()=>{if(!navigating)hide();},8000);
 }
 function finishWhenReady(){
  if(navigating||!pageReady||!Number.isFinite(minUntil))return;
  clearTimeout(finishTimer);
  const remaining=Math.max(0,minUntil-performance.now());
  if(remaining)finishTimer=setTimeout(hide,remaining);
  else hide();
 }
 function startDrop(){
  showBackdrop();
  root.classList.remove('loader-running','loader-complete');
  // Paint each letter from above the logo without clipping its movement.
  void overlay()?.offsetWidth;
  root.classList.add('loader-running');
  minUntil=performance.now()+duration();
  finishWhenReady();
 }
 showBackdrop();
 if(completedNavigation)root.classList.add('loader-complete');
 function ready(){
  pageReady=true;
  if(completedNavigation){minUntil=performance.now();finishWhenReady();}
  else startDrop();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
 else ready();
 addEventListener('pageshow',event=>{
  if(event.persisted){navigating=false;completedNavigation=false;pageReady=true;startDrop();}
 });
 addEventListener('pagehide',()=>{
  clearTimeout(recoveryTimer);clearTimeout(finishTimer);clearTimeout(navigationTimer);
 });
 motion.addEventListener('change',()=>{if(motion.matches){minUntil=performance.now();finishWhenReady();}});
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest?.('a[href]');
  if(!link||link.hasAttribute('download')||(link.target&&link.target.toLowerCase()!=='_self'))return;
  let url;try{url=new URL(link.href,location.href);}catch{return;}
  if(url.origin!==location.origin||!/^https?:$/.test(url.protocol))return;
  if(pageKey(url)===pageKey(new URL(location.href)))return;
  if(/\.[a-z0-9]+$/i.test(url.pathname)&&!url.pathname.endsWith('.html'))return;
  event.preventDefault();
  if(navigating)return;
  navigating=true;
  startDrop();
  navigationTimer=setTimeout(()=>{
   // The destination keeps the completed logo only until its HTML is ready.
   // One click plays one drop, rather than a second drop after navigation.
   try{sessionStorage.setItem(navigationKey,JSON.stringify({page:pageKey(url),at:Date.now()}));}catch{}
   try{location.assign(url.href);}catch{navigating=false;hide();}
   recoveryTimer=setTimeout(()=>{navigating=false;hide();},8000);
  },duration());
 });
})();
