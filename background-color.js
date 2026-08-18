(()=>{
  const $=s=>document.querySelector(s);

  function hexToRgb(hex){
    const h=String(hex||'').replace('#','').trim();
    if(!/^[0-9a-f]{6}$/i.test(h))return null;
    return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)};
  }
  function rgbToHex({r,g,b}){
    const c=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
    return `#${c(r)}${c(g)}${c(b)}`;
  }
  function darken(hex,amount=.58){
    const rgb=hexToRgb(hex);if(!rgb)return '#171a1f';
    return rgbToHex({r:rgb.r*amount,g:rgb.g*amount,b:rgb.b*amount});
  }
  function mixBlack(hex,amount=.78){
    const rgb=hexToRgb(hex);if(!rgb)return '#111318';
    return rgbToHex({r:rgb.r*(1-amount),g:rgb.g*(1-amount),b:rgb.b*(1-amount)});
  }

  function apply(hex){
    const dark=darken(hex,.58);
    const deeper=mixBlack(hex,.72);
    document.documentElement.style.setProperty('--card-bg-user',dark);
    document.documentElement.style.setProperty('--card-bg-user-deep',deeper);
    const card=$('#resultCard');
    if(card){
      card.style.background=`linear-gradient(135deg, ${dark} 0%, ${deeper} 100%)`;
    }
    localStorage.setItem('coc6-background-color',hex);
    const a=$('#backgroundColor'),b=$('#resultBackgroundColor');
    if(a&&a.value!==hex)a.value=hex;
    if(b&&b.value!==hex)b.value=hex;
  }

  function ensureInputControls(){
    const colorSetup=$('.color-setup');
    if(colorSetup&&!$('#backgroundColor')){
      const label=document.createElement('label');
      label.className='color-control';
      label.innerHTML='<span>背景色</span><div class="color-row"><input id="backgroundColor" type="color" value="#343b49"><input type="text" value="BACKGROUND" readonly></div>';
      const p=colorSetup.querySelector('p');
      if(p)colorSetup.insertBefore(label,p);else colorSetup.appendChild(label);
      $('#backgroundColor')?.addEventListener('input',e=>apply(e.target.value));
    }

    const editor=$('#resultEditor');
    if(editor&&!$('#resultBackgroundColor')){
      const label=document.createElement('label');
      label.innerHTML='背景色<input id="resultBackgroundColor" type="color" value="#343b49">';
      const accent=$('#resultUiAccentColor')?.closest('label');
      if(accent)accent.insertAdjacentElement('afterend',label);else editor.appendChild(label);
      $('#resultBackgroundColor')?.addEventListener('input',e=>apply(e.target.value));
    }
  }

  function init(){
    ensureInputControls();
    apply(localStorage.getItem('coc6-background-color')||'#343b49');
    document.addEventListener('gacha-visual-theme-change',()=>setTimeout(()=>apply(localStorage.getItem('coc6-background-color')||'#343b49'),0));
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(()=>apply(localStorage.getItem('coc6-background-color')||'#343b49'),80));
  }

  window.COC6BackgroundColor={apply,darken};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
