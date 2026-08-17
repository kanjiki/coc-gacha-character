(()=>{
  const BASE=['STR','CON','POW','DEX','APP','SIZ','INT','EDU'];
  const $=s=>document.querySelector(s);
  function val(k){const n=Number($('#stat_'+k)?.value);return Number.isFinite(n)?n:0;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function annularSector(ctx,cx,cy,r0,r1,a0,a1){ctx.beginPath();ctx.arc(cx,cy,r1,a0,a1,false);ctx.arc(cx,cy,r0,a1,a0,true);ctx.closePath();}
  function getTheme(){const t=window.__gachaTheme;if(t?.rgb)return t;const raw=getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim().split(',').map(Number);return {rgb:{r:raw[0]||60,g:raw[1]||184,b:raw[2]||176},dark:'#1f7772'};}
  function rgba(rgb,a){return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;}
  function draw(){
    const canvas=$('#spectrumChart');if(!canvas)return;
    const css=400,dpr=Math.max(1,window.devicePixelRatio||1),size=Math.round(css*dpr);
    canvas.width=size;canvas.height=size;canvas.style.width=css+'px';canvas.style.height=css+'px';
    const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);
    const theme=getTheme(),cx=css/2,cy=css/2,innerR=66,bandW=20,bandGap=5,levels=5;
    const urban=document.documentElement.dataset.visualTheme==='zzz';
    const totalSpan=Math.PI*2*(278/360),start=-Math.PI*(139/180),sectorSize=totalSpan/8,sectorGap=Math.PI/135;
    BASE.forEach((key,i)=>{
      const capped=clamp(val(key),1,18),filled=Math.ceil((capped/18)*levels),a0=start+i*sectorSize+sectorGap,a1=start+(i+1)*sectorSize-sectorGap;
      for(let level=0;level<levels;level++){
        const r0=innerR+level*(bandW+bandGap),r1=r0+bandW;annularSector(c,cx,cy,r0,r1,a0,a1);
        if(level<filled){c.fillStyle=rgba(theme.rgb,(urban?.28:.32)+level*(urban?.09:.12));c.fill();}else{c.fillStyle=rgba(theme.rgb,urban?.035:.035);c.fill();}
        c.strokeStyle=rgba(theme.rgb,urban?.82:.48);c.lineWidth=urban?1.8:1.15;c.stroke();
      }
    });
    c.strokeStyle=rgba(theme.rgb,urban?.88:.50);c.lineWidth=urban?2.1:1.4;c.beginPath();c.arc(cx,cy,innerR-12,0,Math.PI*2);c.stroke();

    const labelR=181;
    c.fillStyle=urban?'#ffffff':(theme.dark||'#1f7772');
    c.font=`${urban?900:800} 11px monospace`;
    c.textAlign='center';c.textBaseline='middle';
    if(urban){c.shadowColor='rgba(0,0,0,.72)';c.shadowBlur=3;}
    BASE.forEach((key,i)=>{const a=start+(i+.5)*sectorSize;c.fillText(key,cx+Math.cos(a)*labelR,cy+Math.sin(a)*labelR);});
    c.shadowBlur=0;

    const san=$('#stat_SAN')?.value||'—';
    if(urban){
      c.fillStyle='rgba(255,255,255,.78)';
      c.font='900 10px monospace';
      c.fillText('SAN',cx,cy-22);
      c.save();
      c.translate(cx,cy+12);
      c.transform(1,0,-0.16,1,0,0);
      c.fillStyle='#ffffff';
      c.strokeStyle='rgba(0,0,0,.72)';
      c.lineWidth=3;
      c.font='italic 1000 46px Arial Black, sans-serif';
      c.strokeText(san,0,0);
      c.fillText(san,0,0);
      c.restore();
    }else{
      c.fillStyle=theme.dark||'#1f7772';c.font='700 10px monospace';c.fillText('SAN',cx,cy-10);
      c.fillStyle='#151817';c.font='900 27px monospace';c.fillText(san,cx,cy+14);
    }
  }
  document.addEventListener('DOMContentLoaded',()=>{$('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(draw,0));document.addEventListener('gacha-theme-change',()=>{if(!$('#resultWrap')?.hidden)draw();});document.addEventListener('gacha-visual-theme-change',()=>setTimeout(draw,40));window.addEventListener('resize',()=>{if(!$('#resultWrap')?.hidden)draw();});});
})();