(()=>{
  const BASE=['STR','CON','POW','DEX','APP','SIZ','INT','EDU'];
  const $=s=>document.querySelector(s);
  function val(k){const n=Number($('#stat_'+k)?.value);return Number.isFinite(n)?n:0;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function annularSector(ctx,cx,cy,r0,r1,a0,a1){ctx.beginPath();ctx.arc(cx,cy,r1,a0,a1,false);ctx.arc(cx,cy,r0,a1,a0,true);ctx.closePath();}
  function getTheme(){
    const t=window.__gachaTheme;if(t?.rgb)return t;
    const raw=getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim().split(',').map(Number);
    return {rgb:{r:raw[0]||60,g:raw[1]||184,b:raw[2]||176},dark:'#1f7772'};
  }
  function rgba(rgb,a){return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;}
  function draw(){
    const canvas=$('#spectrumChart');if(!canvas)return;
    const css=340,dpr=Math.max(1,window.devicePixelRatio||1),size=Math.round(css*dpr);
    canvas.width=size;canvas.height=size;canvas.style.width=css+'px';canvas.style.height=css+'px';
    const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);
    const theme=getTheme(),cx=css/2,cy=css/2,innerR=54,bandW=16,bandGap=4,levels=5;
    const totalSpan=Math.PI*2*(280/360),start=-Math.PI*(140/180),sectorSize=totalSpan/8,sectorGap=Math.PI/120;
    BASE.forEach((key,i)=>{
      const capped=clamp(val(key),1,18),filled=Math.ceil((capped/18)*levels),a0=start+i*sectorSize+sectorGap,a1=start+(i+1)*sectorSize-sectorGap;
      for(let level=0;level<levels;level++){
        const r0=innerR+level*(bandW+bandGap),r1=r0+bandW;annularSector(c,cx,cy,r0,r1,a0,a1);
        if(level<filled){c.fillStyle=rgba(theme.rgb,.34+level*.11);c.fill();}else{c.fillStyle='rgba(21,24,23,.024)';c.fill();}
        c.strokeStyle=rgba(theme.rgb,.34);c.lineWidth=1;c.stroke();
      }
    });
    c.strokeStyle=rgba(theme.rgb,.40);c.lineWidth=1.2;c.beginPath();c.arc(cx,cy,innerR-10,0,Math.PI*2);c.stroke();
    const labelR=153;c.fillStyle=theme.dark||'#1f7772';c.font='800 10px monospace';c.textAlign='center';c.textBaseline='middle';
    BASE.forEach((key,i)=>{const a=start+(i+.5)*sectorSize;c.fillText(key,cx+Math.cos(a)*labelR,cy+Math.sin(a)*labelR);});
    c.fillStyle=theme.dark||'#1f7772';c.font='700 9px monospace';c.fillText('SAN',cx,cy-8);
    c.fillStyle='#151817';c.font='900 24px monospace';c.fillText($('#stat_SAN')?.value||'—',cx,cy+13);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(draw,0));
    document.addEventListener('gacha-theme-change',()=>{if(!$('#resultWrap')?.hidden)draw();});
    window.addEventListener('resize',()=>{if(!$('#resultWrap')?.hidden)draw();});
  });
})();