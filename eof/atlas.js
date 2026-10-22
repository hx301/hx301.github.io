(() => {
  const lang=window.COURSE_LANG==='en'?'en':'zh',T=window.L;
  document.querySelectorAll('img[data-figure]').forEach(img=>{img.src=`./eof/data/${img.dataset.figure}-${lang}.png`;});
  document.querySelectorAll('img[data-grid-figure]').forEach(img=>{img.src=`./eof/grid/${img.dataset.gridFigure}-${lang}.png`;});
  const atlas=document.getElementById('atlas');if(!atlas)return;
  const notes=[
    ['EOF1：五个站点同号变化，中部站点振幅更大。这一模态解释 90.58% 的样本方差。','EOF1: all five stations vary with the same sign, with larger amplitudes at the central stations. This mode explains 90.58% of sample variance.'],
    ['EOF2：西侧站点与东侧站点呈反向差异，解释 5.56% 的样本方差。PC 为负时，图上的正负关系反过来。','EOF2: western and eastern stations vary with opposite signs, accounting for 5.56% of sample variance. A negative PC reverses the signs shown on the map.'],
    ['EOF3：西端与东端为正，中部两个站点为负，解释 2.31% 的样本方差。贡献较小，物理解读需要更多证据。','EOF3: positive loadings at the western and eastern ends contrast with negative loadings at two central stations. It explains 2.31%; physical interpretation needs further evidence.']
  ];
  function show(k){
    atlas.querySelectorAll('[data-atlas-mode]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.atlasMode)===k)));
    for(const part of ['map','pc']){
      const base=`./eof/data/atlas-eof${k}-${part}-${lang}`,img=document.getElementById(`atlas-${part}`);
      img.src=base+'.png';img.alt=`${part==='map'?'EOF':'PC'} ${k} · `+T(part==='map'?'真实站点空间分布图':'标准化时间系数图',part==='map'?'Observed station spatial loadings':'Standardized time coefficient');
      document.getElementById(`atlas-${part}-full`).href=base+'.png';document.getElementById(`atlas-${part}-png`).href=base+'.png';document.getElementById(`atlas-${part}-pdf`).href=base+'.pdf';
    }
    document.getElementById('atlas-interpretation').textContent=T(...notes[k-1]);
  }
  atlas.querySelectorAll('[data-atlas-mode]').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.atlasMode))));show(1);
})();
