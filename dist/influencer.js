(() => {
 const tabs=[...document.querySelectorAll('[data-hub-tab]')];
 const panels=[...document.querySelectorAll('.hub-panel')];
 const names=['agency','creator','brand'];
 const motionAllowed=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.body.classList.contains('motion-paused');
 function choose(name,{scroll=false,focus=false,update=true}={}){
  if(!names.includes(name))name='brand';
  tabs.forEach(tab=>{const selected=tab.dataset.hubTab===name;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
  panels.forEach(panel=>panel.hidden=panel.id!==name);
  if(update)history.replaceState(null,'','#'+name);
  if(focus)document.querySelector('#tab-'+name).focus({preventScroll:true});
  if(scroll)document.querySelector('#join').scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'start'});
 }
 document.body.classList.add('hub-ready');
 choose(location.hash.slice(1),{update:false});
 tabs.forEach(tab=>{
  tab.addEventListener('click',()=>choose(tab.dataset.hubTab));
  tab.addEventListener('keydown',e=>{
   const index=tabs.indexOf(tab);let next;
   if(e.key==='ArrowRight')next=(index+1)%tabs.length;
   else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
   else if(e.key==='Home')next=0;
   else if(e.key==='End')next=tabs.length-1;
   else return;
   e.preventDefault();choose(tabs[next].dataset.hubTab,{focus:true});
  });
 });
 document.querySelectorAll('[data-hub-choice]').forEach(link=>link.addEventListener('click',e=>{
  if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
  e.preventDefault();const mobileMenu=document.querySelector('#mobile-menu');if(mobileMenu?.open)mobileMenu.close();document.querySelectorAll('.nav-dropdown[open]').forEach(menu=>menu.open=false);choose(link.dataset.hubChoice,{scroll:true,focus:true});
 }));
 addEventListener('hashchange',()=>{if(names.includes(location.hash.slice(1)))choose(location.hash.slice(1),{update:false});});
 if(names.includes(location.hash.slice(1)))requestAnimationFrame(()=>document.querySelector('#join').scrollIntoView({behavior:'instant',block:'start'}));
 const forms=[...document.querySelectorAll('.hub-form')];
 const flight=document.querySelector('.send-flight');
 let sending=false,submitTimer,fallbackTimer;
 function reset(){
  clearTimeout(submitTimer);clearTimeout(fallbackTimer);sending=false;flight?.classList.remove('active');
  forms.forEach(form=>{form.removeAttribute('aria-busy');form.querySelector('button[type=submit]').disabled=false;const status=form.querySelector('.hub-form-status');status.classList.remove('error');status.textContent='We’ll review your details and get in touch.';});
 }
 forms.forEach(form=>{
  const phone=form.elements.namedItem('phone');
  function validatePhone(){const digits=phone.value.replace(/\D/g,'');const valid=/^[+()0-9.\s-]+$/.test(phone.value)&&digits.length>=7&&digits.length<=15;phone.setCustomValidity(phone.value.trim()&&!valid?'Enter a valid phone number with 7 to 15 digits.':'');}
  phone.addEventListener('input',validatePhone);
  form.noValidate=true;
  form.addEventListener('submit',e=>{
   e.preventDefault();if(sending)return;
   validatePhone();
   const invalid=[...form.querySelectorAll('input,select,textarea')].find(el=>!el.checkValidity());
   const status=form.querySelector('.hub-form-status');
   if(invalid){status.textContent='Please complete the required fields and check your details.';status.classList.add('error');invalid.reportValidity();return;}
   sending=true;forms.forEach(f=>f.querySelector('button[type=submit]').disabled=true);form.setAttribute('aria-busy','true');status.classList.remove('error');status.textContent='Opening secure submission…';
   if(motionAllowed()&&flight){
    const plane=flight.querySelector('.flying-plane'),w=innerWidth,h=innerHeight;
    plane.style.offsetPath=`path("M -100 ${h*.8} C ${w*.1} ${h*.3} ${w*.5} ${h*.05} ${w*.7} ${h*.4} C ${w*.95} ${h*.8} ${w*.1} ${h*.9} ${w*.3} ${h*.35} C ${w*.45} ${h*.02} ${w*.8} ${h*.1} ${w+150} -150")`;
    flight.classList.add('active');
   }
   submitTimer=setTimeout(()=>{
    HTMLFormElement.prototype.submit.call(form);
    fallbackTimer=setTimeout(()=>{reset();status.textContent='If submission did not open, try again or email connectadkea@gmail.com.';status.classList.add('error');},15000);
   },motionAllowed()?1800:0);
  });
 });
 addEventListener('pageshow',reset);
})();
