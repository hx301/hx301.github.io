(() => {
  const L = window.L || ((zh,en)=>zh);
  const menu=document.querySelector('.menu-toggle'), nav=document.querySelector('.main-nav');
  menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.textContent=open?L('收起','Close'):L('目录','Menu');});
  document.querySelectorAll('[data-alt-en]').forEach(img=>{if(window.COURSE_LANG==='en')img.alt=img.dataset.altEn;});
  document.querySelectorAll('[data-figure]').forEach(img=>{const lang=window.COURSE_LANG==='en'?'en':'zh';img.src=img.dataset.figure.replace('{lang}',lang);if(img.parentElement.tagName==='A')img.parentElement.href=img.src;});
  if(document.body.dataset.titleEn && window.COURSE_LANG==='en') document.title=document.body.dataset.titleEn;
  const lab=document.getElementById('bloom-lab');
  if(lab){
    const depth=document.getElementById('mix-depth'), nutrient=document.getElementById('nutrient');
    const avgResponse=h=>Math.log(130/(30+100*Math.exp(-.06*h)))/(.06*h);
    const rate=(h,n)=>n/(1+n)*avgResponse(h)-.2;
    const ns='http://www.w3.org/2000/svg', curve=document.getElementById('growth-curve'), dot=document.getElementById('growth-dot');
    function update(){
      const h=Number(depth.value),n=Number(nutrient.value),r=rate(h,n),I=100*(-Math.expm1(-.06*h))/(.06*h);
      document.getElementById('depth-value').textContent=`${h.toFixed(0)} m`;
      document.getElementById('nutrient-value').textContent=`${n.toFixed(1)} mmol m⁻³`;
      document.getElementById('growth-result').textContent=L(`净增长率 ${r>=0?'+':''}${r.toFixed(3)} d⁻¹：${r>0?'生长超过损失':'损失超过生长'}。`,`Net growth ${r>=0?'+':''}${r.toFixed(3)} d⁻¹: ${r>0?'growth exceeds losses':'losses exceed growth'}.`);
      document.getElementById('light-result').textContent=L(`层平均光照 ${I.toFixed(1)} μmol photons m⁻² s⁻¹；平均光响应 ${avgResponse(h).toFixed(3)}。`,`Mean light ${I.toFixed(1)} μmol photons m⁻² s⁻¹; mean light response ${avgResponse(h).toFixed(3)}.`);
      const x=h=>55+(h-5)/145*490, y=r=>230-(r+.2)/.8*200;
      const points=Array.from({length:146},(_,i)=>{const hh=i+5;return `${x(hh).toFixed(2)},${y(rate(hh,n)).toFixed(2)}`;}).join(' ');
      curve.setAttribute('points',points);dot.setAttribute('cx',x(h));dot.setAttribute('cy',y(r));
      document.getElementById('growth-chart-desc').textContent=L(`固定营养盐 ${n.toFixed(1)}，深度从5到150米时净增长率下降。当前深度${h}米，净增长率${r.toFixed(3)}每天。`,`At fixed nutrient ${n.toFixed(1)}, net growth decreases from 5 to 150 m depth. Selected ${h} m gives ${r.toFixed(3)} per day.`);
      document.querySelectorAll('[data-preset]').forEach(b=>{const [hh,nn]=b.dataset.preset.split(',').map(Number);b.setAttribute('aria-pressed',String(h===hh&&n===nn));});
    }
    depth.addEventListener('input',update);nutrient.addEventListener('input',update);
    document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{const [h,n]=b.dataset.preset.split(',');depth.value=h;nutrient.value=n;update();}));update();
  }
  const notebook=document.getElementById('notebook');
  if(notebook){
    const key='ocean-course-notebook-v1',status=document.getElementById('save-status'),fields=[...notebook.querySelectorAll('[data-note-key]')];
    let draft={};try{draft=JSON.parse(localStorage.getItem(key)||'{}');if(!draft||typeof draft!=='object'||Array.isArray(draft))draft={};}catch{}
    fields.forEach(el=>{if(typeof draft[el.dataset.noteKey]==='string')el.value=draft[el.dataset.noteKey];});
    function count(){const n=fields.filter(el=>el.dataset.noteKey.startsWith('answer-')&&el.value.trim()).length;document.getElementById('answered-count').textContent=L(`${n} / 8 已写下回答（本机草稿）`,`${n} / 8 answers drafted on this device`);}
    function save(){fields.forEach(el=>draft[el.dataset.noteKey]=el.value);draft.updatedAt=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(draft));status.textContent=L('草稿已保存在此浏览器，尚未发布。','Draft saved in this browser; not published.');}catch{status.textContent=L('浏览器未允许保存，请使用“导出记录”保留内容。','Browser storage unavailable. Export your notes to keep them.');}count();}
    fields.forEach(el=>el.addEventListener('input',save));
    document.getElementById('export-notes').addEventListener('click',()=>{save();const blob=new Blob([JSON.stringify({title:'Ocean course learning notes',...draft},null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='ocean-learning-notes.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent=L('已导出记录；公开网页和老师评分尚未改变。','Notes exported; the public site and teacher assessment are unchanged.');});
    document.getElementById('print-notes').addEventListener('click',()=>window.print());count();
  }
})();
