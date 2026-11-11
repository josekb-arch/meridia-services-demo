/* Demo kit · Jose Khalili. Contenido de ejemplo; formularios no envían datos reales. */
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var lenis=null, lastFocus=null;
window.__demo = {$, $$, reduce,
  lock:function(on){document.documentElement.style.overflow=on?'hidden':'';if(lenis)on?lenis.stop():lenis.start()},
  go:function(h){var t=$(h);if(!t)return;if(lenis)lenis.scrollTo(t,{offset:-80,duration:1.25});else t.scrollIntoView({behavior:reduce?'auto':'smooth'})},
  toast:function(msg){var t=$('#toast');if(!t)return;$('span',t).textContent=msg;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove('on')},3200)},
  getLenis:function(){return lenis}
};

function nav(){
  var n=$('#nav'), burger=$('#burger'), menu=$('#mmenu');
  var last=0;
  addEventListener('scroll',function(){
    if(!n)return;
    var y=scrollY;
    n.classList.toggle('is-scrolled',y>40);
    n.classList.toggle('is-away',y>200&&y>last&&!document.body.classList.contains('menu-on'));
    last=y;
  },{passive:true});
  function closeMenu(){if(!menu)return;menu.setAttribute('aria-hidden','true');document.body.classList.remove('menu-on');if(burger)burger.setAttribute('aria-expanded','false');window.__demo.lock(false)}
  function openMenu(){if(!menu)return;menu.setAttribute('aria-hidden','false');document.body.classList.add('menu-on');if(burger)burger.setAttribute('aria-expanded','true');window.__demo.lock(true)}
  if(burger)burger.addEventListener('click',function(){menu&&menu.getAttribute('aria-hidden')==='false'?closeMenu():openMenu()});
  $$('[data-close-menu]').forEach(function(b){b.addEventListener('click',closeMenu)});
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]');
    if(!a)return;
    var href=a.getAttribute('href');
    if(href.length>1&&$(href)){e.preventDefault();closeMenu();window.__demo.go(href)}
  });
}

function forms(){
  $$('form[data-demo-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      $$('[required]',f).forEach(function(i){
        var wrap=i.closest('label')||i;
        var bad=!i.value.trim()||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value))||(i.type==='tel'&&i.value.replace(/\D/g,'').length<8);
        wrap.classList.toggle('err',bad);
        if(bad)ok=false;
      });
      if(!ok){window.__demo.toast(f.dataset.err||'Revisa los campos marcados.');return}
      var done=f.dataset.done;
      if(done&&$(done)){
        f.hidden=true;$(done).hidden=false;
      }else{
        f.reset();
        window.__demo.toast(f.dataset.ok||'Mensaje de ejemplo recibido. En el sitio real llegaría a tu correo.');
      }
      if(typeof window.onDemoForm==='function')window.onDemoForm(f);
    });
    $$('input,textarea,select',f).forEach(function(i){i.addEventListener('input',function(){(i.closest('label')||i).classList.remove('err')})});
  });
}

function splitWords(el){
  var out=document.createDocumentFragment();
  Array.prototype.slice.call(el.childNodes).forEach(function(n){
    var holder=n.nodeType===1?n.cloneNode(false):null,txt=n.textContent,parts=txt.split(/(\s+)/);
    var target=holder||out;
    parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){target.appendChild(document.createTextNode(' '));return}var w=document.createElement('span');w.className='w';w.style.cssText='display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em';var i=document.createElement('span');i.style.display='inline-block';i.textContent=p;w.appendChild(i);target.appendChild(w)});
    if(holder)out.appendChild(holder);
  });
  el.innerHTML='';el.appendChild(out);el.setAttribute('aria-label',el.textContent);
  return $$('.w>span',el);
}

function motion(){
  if(reduce||!window.gsap||!window.ScrollTrigger){document.documentElement.classList.remove('anim');return}
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){lenis=new Lenis({lerp:.085,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
  var tl=gsap.timeline({defaults:{ease:'expo.out'}});
  if($('.hero-media img'))tl.to('.hero-media img',{scale:1,duration:2.4,ease:'power3.out'},0);
  if($('.hero h1 .ln>span'))tl.to('.hero h1 .ln>span',{y:0,duration:1.5,stagger:.14},.25);
  if($('.hero-fade'))tl.fromTo('.hero-fade',{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:1.2,stagger:.12},.55);
  tl.add(function(){document.documentElement.classList.remove('anim')});
  if($('.hero-media img'))gsap.to('.hero-media img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  $$('[data-split]').forEach(function(h){var w=splitWords(h);gsap.from(w,{yPercent:110,duration:1.2,ease:'expo.out',stagger:.045,scrollTrigger:{trigger:h,start:'top 86%',once:true}})});
  gsap.set('[data-reveal]:not([data-reveal=img])',{autoAlpha:0});
  ScrollTrigger.batch('[data-reveal]:not([data-reveal=img])',{start:'top 90%',once:true,onEnter:function(els){gsap.fromTo(els,{autoAlpha:0,y:40},{autoAlpha:1,y:0,duration:1.1,ease:'expo.out',stagger:.08,overwrite:true})}});
  $$('[data-reveal=img]').forEach(function(el){gsap.fromTo(el,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.5,ease:'expo.inOut',scrollTrigger:{trigger:el,start:'top 85%',once:true}})});
  $$('[data-speed]').forEach(function(im){gsap.fromTo(im,{yPercent:-12},{yPercent:0,ease:'none',scrollTrigger:{trigger:im.parentNode,start:'top bottom',end:'bottom top',scrub:true}})});
  if($('.cta .bg'))gsap.fromTo('.cta .bg',{yPercent:-8},{yPercent:8,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom top',scrub:true}});
  $$('[data-count]').forEach(function(el){var to=+el.dataset.count,dec=+(el.dataset.dec||0),o={v:0};ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:function(){gsap.to(o,{v:to,duration:2,ease:'power3.out',onUpdate:function(){el.textContent=dec?o.v.toFixed(dec):Math.round(o.v).toLocaleString(document.documentElement.lang||'es')}})}})});
  ['.card','.svc','.rev','.tile','.step','.shot','.item'].forEach(function(sel){if(!$(sel))return;gsap.set(sel,{autoAlpha:0});ScrollTrigger.batch(sel,{start:'top 92%',once:true,onEnter:function(els){gsap.fromTo(els,{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:1.05,ease:'expo.out',stagger:.09,overwrite:true})}})});
  var track=$('#galTrack');
  if(track){var mm=gsap.matchMedia();mm.add('(min-width:821px)',function(){
    gsap.to(track,{x:function(){return -(track.scrollWidth-innerWidth+80)},ease:'none',scrollTrigger:{trigger:'#galeria',start:'top top',end:function(){return '+='+Math.max(400,track.scrollWidth-innerWidth+80)},pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1}});
    $$('.gal-item img').forEach(function(im){gsap.fromTo(im,{scale:1.15},{scale:1,ease:'none',scrollTrigger:{trigger:'#galeria',start:'top top',end:function(){return '+='+(track.scrollWidth-innerWidth)},scrub:true}})});
  })}
  if(matchMedia('(hover:hover)').matches){
    $$('.btn').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.18,y:(e.clientY-r.top-r.height/2)*.25,duration:.5,ease:'power3.out'})});
      b.addEventListener('mouseleave',function(){gsap.to(b,{x:0,y:0,duration:.7,ease:'elastic.out(1,.5)'})});
    });
    $$('[data-tilt]').forEach(function(el){
      el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(el,{rotateY:x*8,rotateX:-y*8,transformPerspective:700,duration:.5,ease:'power3.out'})});
      el.addEventListener('mouseleave',function(){gsap.to(el,{rotateY:0,rotateX:0,duration:.8,ease:'elastic.out(1,.5)'})});
    });
  }
  addEventListener('load',function(){ScrollTrigger.refresh()});
  if(typeof window.onDemoMotion==='function')window.onDemoMotion();
}

document.addEventListener('DOMContentLoaded',function(){
  nav();forms();
  var y=$('#y');if(y)y.textContent=new Date().getFullYear();
  if(typeof window.onDemoReady==='function')window.onDemoReady();
  motion();
});
})();
