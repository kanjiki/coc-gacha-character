(()=>{
  const $=s=>document.querySelector(s);
  const root=document.documentElement;
  const card=$('#resultCard');
  const inputColor=$('#themeColor'),hex=$('#themeHex'),resultColor=$('#resultThemeColor');
  const imageScale=$('#imageScale'),imageScaleOut=$('#imageScaleOut'),resetImage=$('#resetImageBtn');
  const ringScale=$('#ringScale'),ringScaleOut=$('#ringScaleOut'),resetRing=$('#resetRingBtn');
  const stage=$('#characterStage'),img=$('#resultImage'),ring=$('#spectrumOverlay');
  let imageState={x:0,y:0,scale:1};
  let ringState={x:0,y:0,scale:1};
  let drag=null;

  function validHex(v){return /^#[0-9A-F]{6}$/i.test(v||'');}
  function hexToRgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
  function mix(a,b,t){return Math.round(a+(b-a)*t);}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('').toUpperCase();}
  function applyTheme(h){
    if(!validHex(h))return;h=h.toUpperCase();
    const {r,g,b}=hexToRgb(h),dark=rgbToHex(mix(r,0,.38),mix(g,0,.38),mix(b,0,.38));
    root.style.setProperty('--accent',h);root.style.setProperty('--accent-rgb',`${r},${g},${b}`);root.style.setProperty('--accent-dark',dark);
    root.style.setProperty('--accent-soft',`rgba(${r},${g},${b},.18)`);root.style.setProperty('--accent-faint',`rgba(${r},${g},${b},.07)`);
    window.__gachaTheme={hex:h,rgb:{r,g,b},dark};
    if(inputColor)inputColor.value=h;if(resultColor)resultColor.value=h;if(hex)hex.value=h;
    document.dispatchEvent(new CustomEvent('gacha-theme-change'));
  }
  function applyImage(){
    root.style.setProperty('--pc-x',`${imageState.x}px`);root.style.setProperty('--pc-y',`${imageState.y}px`);root.style.setProperty('--pc-scale',String(imageState.scale));
    card?.style.setProperty('--pc-x',`${imageState.x}px`);card?.style.setProperty('--pc-y',`${imageState.y}px`);card?.style.setProperty('--pc-scale',String(imageState.scale));
    if(imageScale)imageScale.value=String(Math.round(imageState.scale*100));if(imageScaleOut)imageScaleOut.textContent=`${Math.round(imageState.scale*100)}%`;
  }
  function applyRing(){
    root.style.setProperty('--ring-x',`${ringState.x}px`);root.style.setProperty('--ring-y',`${ringState.y}px`);root.style.setProperty('--ring-scale',String(ringState.scale));
    card?.style.setProperty('--ring-x',`${ringState.x}px`);card?.style.setProperty('--ring-y',`${ringState.y}px`);card?.style.setProperty('--ring-scale',String(ringState.scale));
    if(ringScale)ringScale.value=String(Math.round(ringState.scale*100));if(ringScaleOut)ringScaleOut.textContent=`${Math.round(ringState.scale*100)}%`;
  }
  function resetImageState(){imageState={x:0,y:0,scale:1};applyImage();}
  function resetRingState(){ringState={x:0,y:0,scale:1};applyRing();}

  inputColor?.addEventListener('input',()=>applyTheme(inputColor.value));
  resultColor?.addEventListener('input',()=>applyTheme(resultColor.value));
  hex?.addEventListener('change',()=>{let v=hex.value.trim();if(!v.startsWith('#'))v='#'+v;if(validHex(v))applyTheme(v);else hex.value=inputColor?.value?.toUpperCase()||'#3CB8B0';});
  imageScale?.addEventListener('input',()=>{imageState.scale=Number(imageScale.value)/100;applyImage();});
  ringScale?.addEventListener('input',()=>{ringState.scale=Number(ringScale.value)/100;applyRing();});
  resetImage?.addEventListener('click',resetImageState);resetRing?.addEventListener('click',resetRingState);

  function ratio(){const rect=card?.getBoundingClientRect();return rect&&rect.width?card.offsetWidth/rect.width:1;}
  function canDragImage(){return img&&img.style.display!=='none'&&img.getAttribute('src');}
  stage?.addEventListener('pointerdown',e=>{
    if(!canDragImage())return;e.preventDefault();stage.setPointerCapture?.(e.pointerId);
    drag={type:'image',id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:imageState.x,originY:imageState.y,ratio:ratio()};stage.classList.add('is-dragging');
  });
  ring?.addEventListener('pointerdown',e=>{
    e.preventDefault();ring.setPointerCapture?.(e.pointerId);
    drag={type:'ring',id:e.pointerId,startX:e.clientX,startY:e.clientY,originX:ringState.x,originY:ringState.y,ratio:ratio()};ring.classList.add('is-dragging');
  });
  function move(e){
    if(!drag||drag.id!==e.pointerId)return;
    const nx=drag.originX+(e.clientX-drag.startX)*drag.ratio,ny=drag.originY+(e.clientY-drag.startY)*drag.ratio;
    if(drag.type==='image'){imageState.x=Math.max(-320,Math.min(320,nx));imageState.y=Math.max(-240,Math.min(240,ny));applyImage();}
    else{ringState.x=Math.max(-420,Math.min(420,nx));ringState.y=Math.max(-300,Math.min(300,ny));applyRing();}
  }
  function end(e){if(!drag||drag.id!==e.pointerId)return;stage?.classList.remove('is-dragging');ring?.classList.remove('is-dragging');drag=null;}
  [stage,ring].forEach(el=>{el?.addEventListener('pointermove',move);el?.addEventListener('pointerup',end);el?.addEventListener('pointercancel',end);});
  stage?.addEventListener('wheel',e=>{if(!canDragImage())return;e.preventDefault();imageState.scale=Math.max(.45,Math.min(2,imageState.scale+(e.deltaY<0?.05:-.05)));applyImage();},{passive:false});
  ring?.addEventListener('wheel',e=>{e.preventDefault();ringState.scale=Math.max(.7,Math.min(1.5,ringState.scale+(e.deltaY<0?.05:-.05)));applyRing();},{passive:false});

  document.addEventListener('DOMContentLoaded',()=>{applyTheme(inputColor?.value||'#3CB8B0');applyImage();applyRing();});
})();