(()=>{
  const BASE=['STR','CON','POW','DEX','APP','SIZ','INT','EDU'];
  const $=s=>document.querySelector(s);
  function val(k){const n=Number($('#stat_'+k)?.value);return Number.isFinite(n)?n:0;}
  function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function annularSector(ctx,cx,cy,r0,r1,a0,a1){
    ctx.beginPath();
    ctx.arc(cx,cy,r1,a0,a1,false);
    ctx.arc(cx,cy,r0,a1,a0,true);
    ctx.closePath();
  }
  function draw(){
    const canvas=$('#spectrumChart');if(!canvas)return;
    const dpr=Math.max(1,window.devicePixelRatio||1);
    const css=184,size=Math.round(css*dpr);
    canvas.width=size;canvas.height=size;canvas.style.width=css+'px';canvas.style.height=css+'px';
    const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,css,css);

    const cx=css/2,cy=css/2;
    const innerR=31;
    const bandW=9;
    const bandGap=2;
    const levels=5;
    const sectorGap=Math.PI/90;
    const sectorSize=Math.PI*2/8;
    const start=-Math.PI/2;

    BASE.forEach((key,i)=>{
      const raw=val(key);
      const capped=clamp(raw,1,18);
      const filled=Math.ceil((capped/18)*levels);
      const a0=start+i*sectorSize+sectorGap;
      const a1=start+(i+1)*sectorSize-sectorGap;

      for(let level=0;level<levels;level++){
        const r0=innerR+level*(bandW+bandGap);
        const r1=r0+bandW;
        annularSector(c,cx,cy,r0,r1,a0,a1);
        if(level<filled){
          const alpha=.42+(level/levels)*.38;
          c.fillStyle=`rgba(35,158,151,${alpha})`;
          c.fill();
        }else{
          c.fillStyle='rgba(21,24,23,.035)';
          c.fill();
        }
        c.strokeStyle='rgba(21,24,23,.14)';
        c.lineWidth=.7;
        c.stroke();
      }
    });

    c.strokeStyle='rgba(21,24,23,.14)';
    c.lineWidth=1;
    c.beginPath();c.arc(cx,cy,innerR-5,0,Math.PI*2);c.stroke();

    const labelR=84;
    c.fillStyle='#151817';
    c.font='700 8px monospace';
    c.textAlign='center';c.textBaseline='middle';
    BASE.forEach((key,i)=>{
      const a=start+(i+.5)*sectorSize;
      c.fillText(key,cx+Math.cos(a)*labelR,cy+Math.sin(a)*labelR);
    });

    c.fillStyle='#6e7773';c.font='700 8px monospace';c.fillText('SAN',cx,cy-7);
    c.fillStyle='#151817';c.font='800 18px monospace';c.fillText($('#stat_SAN')?.value||'—',cx,cy+9);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    $('#diagnoseBtn')?.addEventListener('click',()=>setTimeout(draw,0));
    window.addEventListener('resize',()=>{if(!$('#resultWrap')?.hidden)draw();});
  });
})();
