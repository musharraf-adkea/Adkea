const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const motionToggle = document.querySelector('#motion-toggle');
function syncMotion(){document.body.classList.toggle('motion-paused',paused);if(motionToggle){motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.innerHTML=paused?'Resume motion <span aria-hidden="true">▷</span>':'Pause motion <span aria-hidden="true">Ⅱ</span>';}}
syncMotion();motionToggle?.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});
if(!reduced.matches && 'IntersectionObserver' in window){document.body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});},{threshold:.12});document.querySelectorAll('.reveal,.process-grid article').forEach(el=>observer.observe(el));}
const menu=document.querySelector('#mobile-menu');const menuToggle=document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');});
function closeMenu(){if(menu?.open)menu.close();menuToggle?.setAttribute('aria-expanded','false');}
document.querySelector('.menu-close')?.addEventListener('click',closeMenu);menu?.addEventListener('close',()=>menuToggle?.setAttribute('aria-expanded','false'));
matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
dropdowns.forEach(drop=>drop.addEventListener('toggle',()=>{if(drop.open)dropdowns.forEach(other=>{if(other!==drop)other.open=false;});}));
document.addEventListener('click',e=>{if(!e.target.closest('.nav-dropdown'))dropdowns.forEach(d=>d.open=false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')dropdowns.forEach(d=>{if(d.open){d.open=false;d.querySelector('summary').focus();}});});
// Desktop menus open on hover and retain click / keyboard access.
const hoverNavigation=matchMedia('(min-width:761px)');
dropdowns.forEach(drop=>{
 let closeTimer;
 const cancelClose=()=>clearTimeout(closeTimer);
 const openOnHover=()=>{if(!hoverNavigation.matches)return;cancelClose();if(drop.open)return;dropdowns.forEach(other=>{if(other!==drop)other.open=false;});drop.open=true;};
 drop.addEventListener('mouseenter',openOnHover);
 drop.addEventListener('mousemove',openOnHover);
 drop.addEventListener('mouseleave',()=>{if(!hoverNavigation.matches)return;cancelClose();closeTimer=setTimeout(()=>drop.open=false,180);});
 drop.addEventListener('focusin',cancelClose);
 drop.addEventListener('focusout',e=>{if(!drop.contains(e.relatedTarget)){cancelClose();drop.open=false;}});
 drop.querySelector('summary').addEventListener('click',e=>{if(e.detail>0&&hoverNavigation.matches){e.preventDefault();cancelClose();dropdowns.forEach(other=>{if(other!==drop)other.open=false;});drop.open=true;}});
 drop.querySelector('summary').addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();cancelClose();dropdowns.forEach(other=>{if(other!==drop)other.open=false;});drop.open=true;drop.querySelector('a')?.focus();}});
 drop.querySelector('.mega-close')?.addEventListener('click',()=>{cancelClose();drop.open=false;drop.querySelector('summary').focus();});
});
const wipe=document.querySelector('.navigation-wipe');
document.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',e=>{if(link.dataset.hubChoice||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const href=link.getAttribute('href');if(!href.includes('#'))return;const url=new URL(href,location.href);if(url.origin!==location.origin||url.pathname.replace(/\.html$/,'').replace(/\/$/,'')!==location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||url.search!==location.search)return;const hash=url.hash||'#';const target=hash==='#'?document.body:document.querySelector(hash);if(!target)return;e.preventDefault();if(target instanceof HTMLDetailsElement)target.open=true;if(link.dataset.service){document.querySelectorAll('.service-options input').forEach(input=>{if(input.value===link.dataset.service)input.checked=true;});}closeMenu();dropdowns.forEach(d=>d.open=false);if(wipe&&!paused){wipe.classList.remove('active');requestAnimationFrame(()=>{void wipe.offsetWidth;wipe.classList.add('active');});}history.pushState(null,'',hash);target.scrollIntoView({behavior:paused?'instant':'smooth',block:'start'});}));
const progress=document.querySelector('.scroll-progress');let scrollQueued=false;
const aboutArt=document.querySelector('.about-hero-art strong');
aboutArt?.closest('.about-hero-art')?.addEventListener('pointermove',e=>{
 if(paused||e.pointerType!=='mouse')return;
 const r=e.currentTarget.getBoundingClientRect();
 aboutArt.style.transform=`translate(${((e.clientX-r.left)/r.width-.5)*18}px,${((e.clientY-r.top)/r.height-.5)*13}px)`;
});
aboutArt?.closest('.about-hero-art')?.addEventListener('pointerleave',()=>{aboutArt.style.transform='';});
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=`${max>0?scrollY/max*100:0}%`;scrollQueued=false;}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
// Spark responds quickly to the pointer; each part has its own follow speed.
const mascot=document.querySelector('.mascot-stage');
if(mascot){
 const rig=mascot.querySelector('.mascot-rig'),head=mascot.querySelector('.mascot-head'),pupils=[...mascot.querySelectorAll('.mascot-pupil')];
 const leftArm=mascot.querySelector('.left-arm'),rightArm=mascot.querySelector('.right-arm');
 let targetX=0,targetY=0,x=0,y=0,faceX=0,faceY=0,eyeX=0,eyeY=0,energy=0,frame=0,previousTime=0,visible=true,touchReset;
 const clamp=v=>Math.max(-1,Math.min(1,v));
 function draw(time=0){
  rig.style.transform=`translate(${x*7}px,${y*3}px) rotateX(${-y*10}deg) rotateY(${x*24}deg) rotateZ(${x*8}deg)`;
  head.setAttribute('transform',`translate(${faceX*13} ${faceY*8}) rotate(${faceX*10} 300 295)`);
  pupils.forEach(p=>p.setAttribute('transform',`translate(${eyeX*11} ${eyeY*12})`));
  const lift=Math.max(0,-y)*32,gesture=Math.sin(time*.018)*energy*9;
  const left=Math.max(0,-x)*58+lift+energy*12+gesture;
  const right=-(Math.max(0,x)*58+lift+energy*12-gesture);
  leftArm?.setAttribute('transform',`rotate(${Math.min(90,left)} 225 350)`);
  rightArm?.setAttribute('transform',`rotate(${Math.max(-90,right)} 378 350)`);
 }
 function tick(time){
  frame=0;
  if(paused){x=y=faceX=faceY=eyeX=eyeY=targetX=targetY=energy=0;previousTime=0;draw();return;}
  const delta=previousTime?Math.min(50,time-previousTime):16.67;previousTime=time;
  const follow=speed=>1-Math.pow(1-speed,delta/16.67);
  x+=(targetX-x)*follow(.4);y+=(targetY-y)*follow(.4);
  faceX+=(targetX-faceX)*follow(.65);faceY+=(targetY-faceY)*follow(.65);
  eyeX+=(targetX-eyeX)*follow(.88);eyeY+=(targetY-eyeY)*follow(.88);
  energy*=Math.pow(.86,delta/16.67);draw(time);
  if(Math.abs(targetX-x)+Math.abs(targetY-y)+energy>.003)frame=requestAnimationFrame(tick);else previousTime=0;
 }
 function start(){if(!frame)frame=requestAnimationFrame(tick);}
 function neutral(){targetX=targetY=energy=0;start();}
 function look(e){
  if(paused||!visible)return;
  const r=mascot.getBoundingClientRect();
  const nextX=clamp((e.clientX-(r.left+r.width*.5))/Math.max(innerWidth*.32,160));
  const nextY=clamp((e.clientY-(r.top+r.height*.33))/Math.max(innerHeight*.32,140));
  energy=Math.min(1,energy+(Math.abs(nextX-targetX)+Math.abs(nextY-targetY))*.85);
  targetX=nextX;targetY=nextY;start();
 }
 document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')look(e);},{passive:true});
 mascot.closest('.hero')?.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){look(e);clearTimeout(touchReset);touchReset=setTimeout(neutral,1400);}},{passive:true});
 document.documentElement.addEventListener('pointerleave',neutral);addEventListener('blur',neutral);
 motionToggle?.addEventListener('click',neutral);reduced.addEventListener('change',neutral);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)neutral();}).observe(mascot);
 draw();
}
document.querySelectorAll('.cap-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();card.style.setProperty('--tilt-x',`${(e.clientX-r.left-r.width/2)/r.width*8}deg`);card.style.setProperty('--tilt-y',`${-(e.clientY-r.top-r.height/2)/r.height*8}deg`);});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});});
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
const form=document.querySelector('#enquiry-form');
if(form){
 const requestedServices={"social-media-marketing": "Social Media Marketing", "graphic-design": "Artistic Graphic Design", "website-development": "Website Design & Development", "search-engine-optimization": "Search Engine Optimization", "email-marketing": "Email Marketing", "photography": "Photography", "videos-animation": "Videos & Animation", "whatsapp-marketing": "WhatsApp Marketing", "marketing-advertising": "Marketing & Advertising", "marketing-strategy": "Marketing Strategy", "sms-marketing": "SMS Marketing", "branding": "Branding", "influencer-marketing": "Influencer Marketing", "pr-management": "PR Management", "brand-communication": "Brand Communication", "packaging-art-direction": "Packaging & Art Direction", "content-marketing": "Content Marketing", "answer-engine-optimization": "AEO / AI Search", "generative-engine-optimization": "GEO / AI Visibility", "performance-marketing": "Performance Marketing", "specialist-seo": "Specialist SEO", "conversion-analytics": "Conversion & Analytics", "search-social-advertising": "Search & Social Ads", "ugc-content": "UGC & Creator Content", "platform-marketing": "Platform Marketing", "online-reputation": "Online Reputation", "ecommerce-websites": "E-commerce Websites", "apps-development": "Web & Mobile Apps", "website-revamp": "Website Revamp", "marketing-automation": "Marketing Automation", "media-buying": "Media Buying", "events-outdoor": "Events & Outdoor"};
 const requestedService=requestedServices[new URLSearchParams(location.search).get("service")];
 if(requestedService){const input=document.createElement("input");input.type="hidden";input.name="Requested service";input.value=requestedService;form.append(input);const intro=form.querySelector(".form-step > p");if(intro)intro.textContent="Let’s talk "+requestedService+". First, a little about you.";}

 const phone=form.elements.namedItem('phone');
 function validatePhone(){if(!(phone instanceof HTMLInputElement))return;const digits=phone.value.replace(/\D/g,'');const looksValid=/^[+()0-9.\s-]+$/.test(phone.value)&&digits.length>=7&&digits.length<=15;phone.setCustomValidity(phone.value.trim()&&!looksValid?'Enter a valid phone number with 7 to 15 digits.':'');}
 phone?.addEventListener('input',validatePhone);
 const steps=[...form.querySelectorAll('.form-step')];const back=form.querySelector('.form-back');const next=form.querySelector('.form-next');const send=form.querySelector('.send-button');const note=form.querySelector('.form-note');const flight=document.querySelector('.send-flight');let current=0;let submitting=false;let fallbackTimer;
 form.noValidate=true;form.classList.add('form-enhanced');
 function showStep(index,focus=false){current=index;steps.forEach((step,i)=>{step.classList.toggle('current',i===index);});form.querySelector('.step-counter').textContent=`0${index+1} / 03`;form.querySelectorAll('.form-progress i').forEach((el,i)=>el.classList.toggle('active',i<=index));back.hidden=index===0;next.hidden=index===steps.length-1;send.hidden=index!==steps.length-1;note.textContent='Only good conversations. No mailing lists.';if(focus){const legend=steps[index].querySelector('legend');legend.tabIndex=-1;legend.focus({preventScroll:true});}}
 function firstInvalid(step){if(step.contains(phone))validatePhone();return [...step.querySelectorAll('input,textarea,select')].find(el=>!el.checkValidity());}
 function advance(){const invalid=firstInvalid(steps[current]);if(invalid){invalid.reportValidity();return;}showStep(Math.min(current+1,steps.length-1),true);}
 next.addEventListener('click',advance);back.addEventListener('click',()=>showStep(Math.max(0,current-1),true));showStep(0);
 function resetSubmission(){clearTimeout(fallbackTimer);submitting=false;send.disabled=false;back.disabled=false;flight?.classList.remove('active');form.removeAttribute('aria-busy');note.textContent='Only good conversations. No mailing lists.';}
 form.addEventListener('submit',e=>{e.preventDefault();if(submitting)return;if(current<steps.length-1){advance();return;}for(let i=0;i<steps.length;i++){const invalid=firstInvalid(steps[i]);if(invalid){showStep(i);invalid.reportValidity();return;}}submitting=true;send.disabled=true;back.disabled=true;form.setAttribute('aria-busy','true');note.textContent='Opening secure submission…';if(!paused&&flight){const w=innerWidth,h=innerHeight;const plane=flight.querySelector('.flying-plane');plane.style.offsetPath=`path("M -100 ${h*.8} C ${w*.1} ${h*.3} ${w*.5} ${h*.05} ${w*.7} ${h*.4} C ${w*.95} ${h*.8} ${w*.1} ${h*.9} ${w*.3} ${h*.35} C ${w*.45} ${h*.02} ${w*.8} ${h*.1} ${w+150} -150")`;flight.classList.add('active');}setTimeout(()=>{HTMLFormElement.prototype.submit.call(form);fallbackTimer=setTimeout(()=>{resetSubmission();note.textContent='If submission did not open, try again or email us directly.';},15000);},paused?0:1800);});
 addEventListener('pageshow',resetSubmission);
}
