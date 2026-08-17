(()=>{
  const $=s=>document.querySelector(s);
  const root=document.documentElement;
  const card=$('#resultCard');
  const color=$('#themeColor'),hex=$('#themeHex');
  const x=$('#imageX'),y=$('#imageY'),scale=$('#imageScale');
  const xo=$('#imageXOut'),yo=$('#imageYOut'),so=$('#imageScaleOut');
  function validHex(v){return /^#[0-9A-F]{6}$/i.test(v||'');}
  function hexToRgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
  function mix(a,b,t){return Math.round(a+(b-a)*t);}
  function rgbToHex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('').toUpperCase();}
  function applyTheme(h){
    if(!validHex(h))return;
    const {r,g,b}=hexToRgb(h);const dark=rgbToHex(mix(r,0,.35),mix(g,0,.35),mix(b,0,.35));
    root.style.setProperty('--accent',h.toUpperCase());root.style.setProperty('--accent-rgb',`${r},${g},${b}`);root.style.setProperty('--accent-dark',dark);
    root.style.setProperty('--accent-soft',`rgba(${r},${g},${b},.16)`);root.style.setProperty('--accent-faint',`rgba(${r},${g},${b},.07)`);
    window.__gachaTheme={hex:h.toUpperCase(),rgb:{r,g,b},dark};
    document.dispatchEvent(new CustomEvent('gacha-theme-change'));
  }
  function applyImage(){
    const xv=Number(x?.value||0),yv=Number(y?.value||0),sv=Number(scale?.value||100);
    root.style.setProperty('--pc-x',`${xv}px`);root.style.setProperty('--pc-y',`${yv}px`);root.style.setProperty('--pc-scale',String(sv/100));
    if(card){card.style.setProperty('--pc-x',`${xv}px`);card.style.setProperty('--pc-y',`${yv}px`);card.style.setProperty('--pc-scale',String(sv/100));}
    if(xo)xo.textContent=xv;if(yo)yo.textContent=yv;if(so)so.textContent=`${sv}%`;
  }
  color?.addEventListener('input',()=>{hex.value=color.value.toUpperCase();applyTheme(color.value);});
  hex?.addEventListener('change',()=>{let v=hex.value.trim();if(!v.startsWith('#'))v='#'+v;if(validHex(v)){v=v.toUpperCase();hex.value=v;color.value=v;applyTheme(v);}else{hex.value=color.value.toUpperCase();}});
  [x,y,scale].forEach(el=>el?.addEventListener('input',applyImage));
  document.addEventListener('DOMContentLoaded',()=>{applyTheme(color?.value||'#3CB8B0');applyImage();});
})();