const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
$('#yr').textContent=new Date().getFullYear();

/* Theme swap for vertical sections */
function applyTheme(mode='dark',accent='teal'){
  const s=document.documentElement.style,gs=getComputedStyle(document.documentElement);
  const light=mode==='light';
  s.setProperty('--bg', light?gs.getPropertyValue('--l1'):gs.getPropertyValue('--d1'));
  s.setProperty('--bg2',light?gs.getPropertyValue('--l2'):gs.getPropertyValue('--d2'));
  s.setProperty('--ink',light?gs.getPropertyValue('--inkL'):gs.getPropertyValue('--inkD'));
  s.setProperty('--muted',light?gs.getPropertyValue('--mutedL'):gs.getPropertyValue('--mutedD'));
  const a=accent==='purple'?'#6F3FF5':accent==='cyan'?'#00F0FF':'#11B4A6';
  const b=accent==='purple'?'#00F0FF':accent==='cyan'?'#6F3FF5':'#6F3FF5';
  s.setProperty('--accent',a); s.setProperty('--accent2',b);
  s.setProperty('--q1',a); s.setProperty('--q2',b);
}
const ioTheme=new IntersectionObserver((es)=>{
  const vis=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!vis)return; applyTheme(vis.target.dataset.mode,vis.target.dataset.accent);
},{threshold:[.2,.5,.8]});
$$('[data-mode]').forEach(el=>ioTheme.observe(el));

/* Header and burger */
const header=$('#hdr'),brand=$('#brand'),burger=$('#burger'),menu=$('#menu'),nav=$('.nav');
function onScrollHeader(){
  const scrolled=scrollY>8;
  header.classList.toggle('compact',scrolled);
  brand.classList.toggle('brand-collapsed',scrolled);
  if(innerWidth>900){ burger.style.display='flex'; nav.style.opacity=menu.classList.contains('open')?'0':'1'; }
}
onScrollHeader(); addEventListener('scroll',onScrollHeader,{passive:true}); addEventListener('resize',onScrollHeader);
function toggleMenu(open){
  burger.classList.toggle('active',open);
  menu.classList.toggle('open',open);
  if(innerWidth>900){ nav.style.opacity=open?'0':'1'; }
  document.documentElement.classList.toggle('locked',open);
  document.body.classList.toggle('locked',open);
}
burger.addEventListener('click',()=>toggleMenu(!burger.classList.contains('active')));
menu.addEventListener('click',e=>{ if(e.target.tagName==='A') toggleMenu(false); });

/* Reveal */
const ioReveal=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); ioReveal.unobserve(e.target);} });
},{threshold:.12});
$$('.reveal').forEach(el=>ioReveal.observe(el));

/* Partners marquee pause/drag */
const marquee=$('#marquee');
function setRun(run){ marquee?.querySelectorAll('.track').forEach(t=>t.style.animationPlayState=run?'running':'paused'); }
['mouseenter','focusin'].forEach(v=>marquee?.addEventListener(v,()=>setRun(false)));
['mouseleave','focusout'].forEach(v=>marquee?.addEventListener(v,()=>setRun(true)));
let down=false; marquee?.addEventListener('pointerdown',e=>{down=true;marquee.setPointerCapture(e.pointerId);setRun(false);});
marquee?.addEventListener('pointerup',e=>{down=false;marquee.releasePointerCapture(e.pointerId);setRun(true);});
marquee?.addEventListener('pointercancel',()=>{down=false;setRun(true);});

/* Services gentle reveal on first view */
const services=document.getElementById('services');
const ioServices=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting){ services.classList.add('in'); ioServices.unobserve(e.target);} });
},{threshold:.15});
if(services) ioServices.observe(services);
