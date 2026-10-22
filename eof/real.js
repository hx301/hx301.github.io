(() => {
  'use strict';
  const $=id=>document.getElementById(id), T=window.L;
  const d=window.TAO_EOF;
  if(!d){$('view-explanation').textContent=T('数据未能加载，请刷新页面。下方静态图表和下载仍可使用。','Data could not be loaded. Refresh the page; static figures and downloads remain available.');$('play').disabled=true;return;}
  document.title=T('真实海温里的 EOF · 描述性物理海洋','EOF in real ocean temperatures · Physical Oceanography');
  const palette={bg:'#092e40',ink:'#e6f3f5',muted:'#b2d0d9',grid:'#35596a',blue:'#70d4e4',warm:'#ffc28a',grey:'#c3cad1'};
  let view='observed',month=0,mode=0,rank=2,sign=1,timer=null;
  const frac=k=>100*d.fraction.slice(0,k).reduce((a,b)=>a+b,0);
  const timeValue=s=>{const [y,m]=s.split('-').map(Number);return y+(m-1)/12;};
  const times=d.dates.map(timeValue), xs=d.longitudes;
  const anomalyLimit=Math.ceil(Math.max(...d.X.flat().map(Math.abs))*2)/2;
  const temperatures=d.X.flatMap((row,i)=>row.map((v,j)=>v+d.offset[j]+d.climatology[Number(d.dates[i].slice(5))-1][j]));
  const temperatureRange=[Math.floor(Math.min(...temperatures,...d.climatology.flat())),Math.ceil(Math.max(...temperatures,...d.climatology.flat()))];
  $('month').setAttribute('aria-label',T('观测月份','Observation month'));
  $('angle').setAttribute('aria-label',T('投影轴角度','Projection angle'));
  const reconstructed=()=>d.stations.map((_,j)=>d.pc[month].slice(0,rank).reduce((v,p,k)=>v+p*d.loadings[j][k],0));
  function setup(canvas){const r=canvas.getBoundingClientRect(),w=Math.max(240,r.width),h=Math.max(240,r.height),ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);const c=canvas.getContext('2d');c.scale(ratio,ratio);c.fillStyle=palette.bg;c.fillRect(0,0,w,h);c.font='12px system-ui, "Microsoft YaHei", sans-serif';return {c,w,h};}
  function label(c,text,x,y,color=palette.muted,align='left'){c.fillStyle=color;c.textAlign=align;c.fillText(text,x,y);}
  function line(c,x1,y1,x2,y2,color,width=1,dash=[]){c.beginPath();c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.setLineDash([]);}
  function dot(c,x,y,color,r=3){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
  function plot(canvas,series,options={}){
    const {c,w,h}=setup(canvas),l=48,r=20,top=28,bottom=options.time?43:63;
    const values=series.flatMap(s=>s.y).filter(Number.isFinite);
    let lo=options.absolute?Math.floor(Math.min(...values)-.5):-Math.max(.1,...values.map(Math.abs))*1.2;
    let hi=options.absolute?Math.ceil(Math.max(...values)+.5):-lo;
    if(options.limit){lo=-options.limit;hi=options.limit;}
    if(options.range){[lo,hi]=options.range;}
    const xlo=options.time?2000:xs[0],xhi=options.time?2025:xs.at(-1);
    const X=x=>l+(x-xlo)/(xhi-xlo)*(w-l-r),Y=y=>top+(hi-y)/(hi-lo)*(h-top-bottom);
    for(let i=0;i<=4;i++){const value=lo+(hi-lo)*i/4,y=Y(value);line(c,l,y,w-r,y,palette.grid);label(c,value.toFixed(1),l-8,y+4,palette.muted,'right');}
    label(c,options.unit||'°C',l,16);
    if(lo<=0&&hi>=0)line(c,l,Y(0),w-r,Y(0),'#7a9ba8');
    if(options.time){for(const year of (w<420?[2000,2012,2024]:[2000,2006,2012,2018,2024]))label(c,String(year),X(year),h-15,palette.muted,'center');}
    else xs.forEach((x,i)=>{c.save();c.translate(X(x),h-bottom+24);c.rotate(-.42);label(c,d.stations[i],0,0,palette.muted,'center');c.restore();});
    for(const s of series){const xx=s.x||xs;c.strokeStyle=s.color;c.lineWidth=2;c.setLineDash(s.dash||[]);c.beginPath();xx.forEach((x,i)=>{const y=s.y[i];if(!Number.isFinite(y))return;if(i===0 || (options.time&&x-xx[i-1]>.09))c.moveTo(X(x),Y(y));else c.lineTo(X(x),Y(y));});c.stroke();c.setLineDash([]);xx.forEach((x,i)=>{if(Number.isFinite(s.y[i]))dot(c,X(x),Y(s.y[i]),s.color,options.time?2:4);});}
    if(options.time){line(c,X(times[month]),top,X(times[month]),h-bottom,palette.warm,1,[4,4]);dot(c,X(times[month]),Y(series[0].y[month]),palette.warm,5);}
  }
  function legend(a,b){return T(a[0],a[1])+(b?' · '+T(b[0],b[1]):'');}
  function render(){
    $('month-label').textContent=`${d.dates[month]} · ${month+1}/${d.n}`;
    $('month').value=month;
    const cm=Number(d.dates[month].slice(5))-1;
    const base=d.climatology[cm],raw=d.X[month].map((v,j)=>v+d.offset[j]+base[j]);
    const rec=reconstructed(),component=d.stations.map((_,j)=>d.pc[month][mode]*d.loadings[j][mode]);
    $('mode-control').hidden=view==='observed';$('rank-control').hidden=view!=='reconstruct';$('flip').hidden=view!=='modes';
    if(view==='observed'){
      $('view-explanation').textContent=T('先看温度本身，再扣掉每个站点的季节背景和共同样本均值。右边的异常，才是分解矩阵 X 的一行。','Start with temperature, then subtract each station’s seasonal background and shared-sample residual mean. The centered anomalies on the right form one row of X.');
      $('left-title').textContent=legend(['青色：月温度','Cyan: monthly temperature'],['灰色：季节气候态','Grey: seasonal climatology']);
      $('right-title').textContent=T('中心化海温异常 / °C','Centered temperature anomalies / °C');
      plot($('spatial'),[{y:raw,color:palette.blue},{y:base,color:palette.grey,dash:[5,4]}],{absolute:true,range:temperatureRange});
      plot($('temporal'),[{y:d.X[month],color:palette.blue}],{limit:anomalyLimit});
      $('readout').textContent=T(`${d.dates[month]}：五个站点提供五个数字。温度减去日历月背景，再减去共同样本均值，得到右侧向量。`,`${d.dates[month]}: five stations give five values. Remove the calendar-month background and the shared-sample mean to obtain the vector on the right.`);
    } else if(view==='modes'){
      $('view-explanation').textContent=T('左边是固定的空间形状，右边是它随月份变化的强弱。两者相乘，得到这个模态对每个站点温度异常的贡献。','The left panel is a fixed spatial pattern; the right shows its time-varying strength. Their product gives this mode’s contribution to each station’s temperature anomaly.');
      $('left-title').textContent=`EOF ${mode+1} · ${T('空间载荷','Spatial loading')} · ${(d.fraction[mode]*100).toFixed(2)}%`;
      $('right-title').textContent=`PC ${mode+1} · ${T('标准差为 1','Unit sample standard deviation')}`;
      plot($('spatial'),[{y:d.loadings.map(row=>row[mode]*sign),color:palette.blue}],{unit:T('°C / PC 标准差','°C / PC SD')});
      plot($('temporal'),[{x:times,y:d.pc.map(row=>row[mode]*sign),color:palette.blue}],{time:true,unit:T('标准差','SD')});
      $('readout').textContent=`${d.dates[month]} · PC ${mode+1} = ${(d.pc[month][mode]*sign).toFixed(3)} · `+T('点击“翻转正负号”，空间形状和 PC 同时反向，二者乘积保持不变。','Flip both signs: the pattern and PC reverse together, leaving their product unchanged.');
    } else {
      $('view-explanation').textContent=T('将前 K 个“空间形状 × 时间系数”加起来，与实际异常比较。增加模态会减小整份样本的平方误差；五个模态可以重建整个矩阵。','Add the first K products of spatial pattern and time coefficient, then compare with the observed anomalies. More modes reduce the full-sample squared error; five modes reconstruct the entire matrix.');
      $('left-title').textContent=legend(['青色：观测异常','Cyan: observed anomaly'],['橙色：重建','Orange: reconstruction']);$('right-title').textContent=T('还没解释掉的残差 / °C','Unexplained residual / °C');
      plot($('spatial'),[{y:d.X[month],color:palette.blue},{y:rec,color:palette.warm,dash:[5,4]}],{limit:anomalyLimit});
      plot($('temporal'),[{y:d.X[month].map((v,j)=>v-rec[j]),color:palette.warm}],{limit:anomalyLimit});
      const rmse=Math.sqrt(rec.reduce((s,v,j)=>s+(v-d.X[month][j])**2,0)/d.m);
      $('readout').textContent=T(`保留 ${rank} 个模态：全样本累计贡献率 ${frac(rank).toFixed(2)}%；当前月份重建 RMSE = ${rmse.toFixed(4)} °C。`,`Keep ${rank} modes: ${frac(rank).toFixed(2)}% of full-sample variance; this month’s reconstruction RMSE = ${rmse.toFixed(4)} °C.`);
    }
    $('spatial').setAttribute('aria-label',$('left-title').textContent+'; '+$('readout').textContent);$('temporal').setAttribute('aria-label',$('right-title').textContent+'; '+T('当前数值见下方表格，全部时间序列可下载 CSV。','Current values are in the table below; download CSV for the full series.'));
    $('values').replaceChildren(...d.stations.map((station,j)=>{const row=document.createElement('tr');[station,d.X[month][j],component[j],rec[j],d.X[month][j]-rec[j]].forEach((value,k)=>{const cell=document.createElement(k?'td':'th');if(!k)cell.scope='row';cell.textContent=typeof value==='number'?value.toFixed(4):value;row.append(cell);});return row;}));
  }
  function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent=T('播放月份','Play months');$('play').setAttribute('aria-pressed','false');}
  $('play').addEventListener('click',()=>{if(timer){stop();return;} $('play').textContent=T('暂停播放','Pause');$('play').setAttribute('aria-pressed','true');timer=setInterval(()=>{month=(month+1)%d.n;render();},900);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  $('month').addEventListener('input',e=>{stop();month=Number(e.target.value);render();});
  $('mode').addEventListener('change',e=>{mode=Number(e.target.value);render();});
  $('rank').addEventListener('change',e=>{rank=Number(e.target.value);render();});
  $('flip').addEventListener('click',()=>{sign*=-1;render();});
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;stop();document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
  const points=d.X.map(row=>[row[1],row[2]]),count=points.length;
  const cxx=points.reduce((s,p)=>s+p[0]*p[0],0)/(count-1),cyy=points.reduce((s,p)=>s+p[1]*p[1],0)/(count-1),cxy=points.reduce((s,p)=>s+p[0]*p[1],0)/(count-1);
  const best=((.5*Math.atan2(2*cxy,cxx-cyy)*180/Math.PI)+180)%180;
  function projection(){
    const {c,w,h}=setup($('projection')),cx=w/2,cy=h/2,extent=Math.max(...points.flat().map(Math.abs))+.7,scale=(Math.min(w,h)-76)/(2*extent),angle=Number($('angle').value)*Math.PI/180,ux=Math.cos(angle),uy=Math.sin(angle);
    const X=x=>cx+x*scale,Y=y=>cy-y*scale;
    line(c,20,cy,w-20,cy,palette.grid);line(c,cx,20,cx,h-25,palette.grid);
    for(let tick=-Math.floor(extent);tick<=Math.floor(extent);tick++){if(!tick)continue;label(c,String(tick),X(tick),cy+17,palette.muted,'center');label(c,String(tick),cx-8,Y(tick)+4,palette.muted,'right');}
    label(c,'180° / °C',w-15,h-12,palette.muted,'right');label(c,'170°W / °C',12,19);
    const arm=extent*.94;line(c,X(-arm*ux),Y(-arm*uy),X(arm*ux),Y(arm*uy),palette.warm,2);
    points.forEach((p,i)=>{const a=p[0]*ux+p[1]*uy,px=a*ux,py=a*uy;if(i%5===0)line(c,X(p[0]),Y(p[1]),X(px),Y(py),'#557787',.8,[2,3]);dot(c,X(p[0]),Y(p[1]),palette.blue,2.5);dot(c,X(px),Y(py),palette.warm,1.8);});
    const variance=ux*ux*cxx+2*ux*uy*cxy+uy*uy*cyy,pct=100*variance/(cxx+cyy);
    $('projection-readout').textContent=T(`轴角度 ${Number($('angle').value).toFixed(1)}° · 保留这两个站点总方差的 ${pct.toFixed(2)}%。青点是月份，橙点是投影；虚线是丢掉的垂直距离。`,`Axis ${Number($('angle').value).toFixed(1)}° · ${pct.toFixed(2)}% of these two stations’ total variance retained. Cyan points are months; orange points are projections; dotted segments show the discarded perpendicular distance.`);
    $('projection').setAttribute('aria-label',$('projection-readout').textContent);
  }
  $('angle').addEventListener('input',projection);$('align').addEventListener('click',()=>{$('angle').value=Math.round(best*2)/2;projection();});
  let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{render();projection();});});
  render();projection();
})();
