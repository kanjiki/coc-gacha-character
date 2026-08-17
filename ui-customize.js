(()=>{
  const $=s=>document.querySelector(s);
  const root=document.documentElement;
  const card=$('#resultCard');
  const inputColor=$('#themeColor'),hex=$('#themeHex'),resultColor=$('#resultThemeColor');
  const scale=$('#imageScale'),scaleOut=$('#imageScaleOut'),reset=$('#resetImageBtn');
  const stage=$('#characterStage'),img=$('#resultImage');
  let state={x:0,y:0,scale:1};
  let drag=null;

  function validHex(v){return /^#[0-9A-F]{6}$/i.test(v||'');}
  function hexToRgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
  function mix(a,b,t){return Math.round(a+(b-a)*t);}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('').toUpperCase();}
  function applyTheme(h){
    if(!validHex(h))return;
    h=h.toUpperCase();
    const {r,g,b}=hexToRgb(h);
    const dark=rgbToHex(mix(r,0,.38),mix(g,0,.38),mix(b,0,.38));
    root.style.setProperty('--accent',h);
    root.style.setProperty('--accent-rgb',`${r},${g},${b}`);
    root.style.setProperty('--accent-dark',dark);
    root.style.setProperty('--accent-soft',`rgba(${r},${g},${b},.18)`);
    root.style.setProperty('--accent-faint',`rgba(${r},${g},${b},.07)`);
    window.__gachaTheme={hex:h,rgb:{r,g,b},dark};
    if(inputColor)inputColor.value=h;if(resultColor)resultColor.value=h;if(hex)hex.value=h;
    document.dispatchEvent(new CustomEvent('gacha-theme-change'));
  }
  function applyImage(){
    const x=`${state.x}px`,y=`${state.y}px`,s=String(state.scale);
    root.style.setProperty('--pc-x',x);root.style.setProperty('--pc-y',y);root.style.setProperty('--pc-scale',s);
    card?.style.setProperty('--pc-x',x);card?.style.setProperty('--pc-y',y);card?.style.setProperty('--pc-scale',s);
    if(scale)scale.value=String(Math.round(state.scale*100));
    if(scaleOut)scaleOut.textContent=`${Math.round(state.scale*100)}%`;
  }
  function resetImage(){state={x:0,y:0,scale:1};applyImage();}

  inputColor?.addEventListener('input',()=>applyTheme(inputColor.value));
  resultColor?.addEventListener('input',()=>applyTheme(resultColor.value));
  hex?.addEventListener('change',()=>{let v=hex.value.trim();if(!v.startsWith('#'))v='#'+v;if(validHex(v))applyTheme(v);else hex.value=inputColor?.value?.toUpperCase()||'#3CB8B0';});
  scale?.addEventListener('input',()=>{state.scale=Number(scale.value)/100;applyImage();});
  reset?.addEventListener('click',resetImage);

  function canDrag(){return img&&img.style.display!=='none'&&img.getAttribute('src');}
  stage?.addEventListener('pointerdown',e=>{
    if(!canDrag())return;
    e.preventDefault();stage.setPointerCapture?.(e.pointerId);
    const rect=card?.getBoundingClientRect();const ratio=rect&&rect.width?card.offsetWidth/rect.width:1;
    drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:state.x,originY:state.y,ratio};
    stage.classList.add('is-dragging');
  });
  stage?.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    state.x=Math.max(-280,Math.min(280,drag.originX+(e.clientX-drag.startX)*drag.ratio));
    state.y=Math.max(-220,Math.min(220,drag.originY+(e.clientY-drag.startY)*drag.ratio));
    applyImage();
  });
  function endDrag(e){if(!drag)return;if(e&&drag.id!==e.pointerId)return;drag=null;stage?.classList.remove('is-dragging');}
  stage?.addEventListener('pointerup',endDrag);stage?.addEventListener('pointercancel',endDrag);
  stage?.addEventListener('wheel',e=>{
    if(!canDrag())return;e.preventDefault();
    state.scale=Math.max(.45,Math.min(2,state.scale+(e.deltaY<0?.05:-.05)));applyImage();
  },{passive:false});

  document.addEventListener('DOMContentLoaded',()=>{applyTheme(inputColor?.value||'#3CB8B0');applyImage();});
})();