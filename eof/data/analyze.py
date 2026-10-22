"""Reproduce the TAO station EOF lesson. Python >=3.10; numpy, pandas, matplotlib.

python analyze.py --raw tao-equatorial-1m-2000-2024.csv --out results
Raw ERDDAP CSV has a second, units-only row. No interpolation is performed.
The optional --download flag retrieves the documented NOAA query if raw is absent.
"""
from pathlib import Path
from datetime import datetime, timezone
import argparse, json, hashlib, shutil
from urllib.parse import quote
from urllib.request import urlopen
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

BASE = 'https://data.pmel.noaa.gov/pmel/erddap/tabledap/pmelTaoDyT'
QUERY = 'station,longitude,latitude,time,depth,T_20,QT_5020,ST_6020&latitude=0&longitude>=137&longitude<=265&depth=1&time>=2000-01-01T00:00:00Z&time<2025-01-01T00:00:00Z'
URL = BASE+'.csv?'+quote(QUERY,safe=',&=')

def fit(monthly, columns):
    # Each calendar-month climatology uses all available qualifying months
    # in 2000–2024. Complete-case centering then makes X's columns exactly zero-mean.
    season = monthly.groupby(monthly.index.month).mean()
    anomaly = monthly - season.reindex(monthly.index.month).set_axis(monthly.index)
    complete = anomaly[columns].dropna()
    offset = complete.mean()
    X = (complete-offset).to_numpy()
    U,s,Vt = np.linalg.svd(X,full_matrices=False)
    # A sign convention, not a physical inference: the largest absolute loading is positive.
    for k in range(len(s)):
        if Vt[k,np.argmax(np.abs(Vt[k]))]<0: Vt[k]*=-1;U[:,k]*=-1
    variance=s*s/(len(X)-1)
    pc=U*np.sqrt(len(X)-1)                 # sample SD = 1
    load=Vt.T*np.sqrt(variance)            # degrees C per one PC standard deviation
    return dict(X=X,dates=complete.index,U=U,s=s,Vt=Vt,pc=pc,load=load,
                variance=variance,fraction=variance/variance.sum(),season=season,offset=offset)

def main():
    p=argparse.ArgumentParser();p.add_argument('--raw',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--download',action='store_true');a=p.parse_args()
    a.out.mkdir(parents=True,exist_ok=True)
    downloaded_now=False
    if not a.raw.exists() and a.download:
        a.raw.parent.mkdir(parents=True,exist_ok=True)
        with urlopen(URL,timeout=240) as r:a.raw.write_bytes(r.read())
        downloaded_now=True
    d=pd.read_csv(a.raw,skiprows=[1]); d['date']=pd.to_datetime(d.time,utc=True).dt.tz_localize(None)
    assert not d.duplicated(['longitude','latitude','depth','date']).any(), 'Duplicate station/day'
    assert (d.latitude==0).all() and (d.depth==1).all()
    valid=d.QT_5020.isin([1,2]) & d.ST_6020.isin([1,2,5,6]) & np.isfinite(d.T_20) & (d.T_20.abs()<1e30)
    good=d.loc[valid].copy();good['month']=good.date.dt.to_period('M').dt.to_timestamp()
    stats=good.groupby(['month','longitude']).T_20.agg(['mean','count'])
    months=pd.date_range('2000-01-01','2024-12-01',freq='MS')
    monthly=stats['mean'].where(stats['count']>=20).unstack().reindex(months)
    cols=monthly.columns[monthly.notna().mean()>=.70]
    result=fit(monthly,cols);r=result;n=len(r['X']);m=len(cols)
    assert n>m
    assert np.allclose(r['Vt']@r['Vt'].T,np.eye(m),atol=1e-10)
    assert np.allclose(r['X'].mean(axis=0),0,atol=1e-10)
    assert np.allclose(np.cov(r['pc'],rowvar=False),np.eye(m),atol=1e-10)
    assert np.allclose(r['pc']@r['load'].T,r['X'],atol=1e-10)
    assert np.isclose(r['fraction'].sum(),1)
    def lon(v):return f'{int(v)}°E' if v<180 else f'{int(360-v)}°W' if v>180 else '180°'
    labels=[lon(v) for v in cols];alllabels=[lon(v) for v in monthly.columns]
    coverage=pd.DataFrame({'longitude_E':monthly.columns,'label':alllabels,'valid_months':monthly.notna().sum().values,'coverage_percent':monthly.notna().mean().values*100,'selected':[v in cols for v in monthly.columns]})
    coverage.to_csv(a.out/'station-coverage.csv',index=False)
    monthly.rename(columns=lon).to_csv(a.out/'monthly-temperature.csv',index_label='month')
    pd.DataFrame(r['X'],index=r['dates'],columns=labels).to_csv(a.out/'centered-anomalies.csv',index_label='month')
    pd.DataFrame(r['pc'],index=r['dates'],columns=[f'PC{k+1}' for k in range(m)]).to_csv(a.out/'principal-components.csv',index_label='month')
    pd.DataFrame(r['load'],index=labels,columns=[f'EOF{k+1}_C_per_PC_SD' for k in range(m)]).to_csv(a.out/'spatial-loadings.csv',index_label='station')
    pd.DataFrame({'mode':np.arange(1,m+1),'eigenvalue_C2':r['variance'],'fraction':r['fraction'],'cumulative':np.cumsum(r['fraction'])}).to_csv(a.out/'variance.csv',index=False)
    r['season'][cols].rename(columns=lon).to_csv(a.out/'monthly-climatology.csv',index_label='calendar_month')
    r['offset'].rename(index=lon).to_csv(a.out/'complete-case-offset.csv',header=['offset_C'],index_label='station')
    strict=stats['mean'].where(stats['count']>=25).unstack().reindex(months)
    sensitivity=fit(strict,cols) # Hold the selected station set fixed for this comparison.
    serial=lambda x:np.asarray(x).round(9).tolist()
    date_strings=r['dates'].strftime('%Y-%m').tolist()
    digest=hashlib.sha256(a.raw.read_bytes()).hexdigest()
    downloaded=datetime.now(timezone.utc).date().isoformat() if downloaded_now else ('2026-10-14' if digest=='943abeb6c4146eecf56e758a261140893938a88543bbf32f7e1a6a1f4c1b3239' else 'not recorded: user-supplied file')
    model=dict(source=BASE+'.html',query_url=URL,downloaded=downloaded,raw_sha256=digest,
        raw_rows=len(d),valid_daily_rows=len(good),all_months=300,n=n,m=m,stations=labels,longitudes=serial(cols),dates=date_strings,
        X=serial(r['X']),pc=serial(r['pc']),loadings=serial(r['load']),eigenvectors=serial(r['Vt'].T),
        variance=serial(r['variance']),fraction=serial(r['fraction']),offset=serial(r['offset']),
        climatology=serial(r['season'][cols]),coverage=coverage.to_dict(orient='records'),
        valid_months=monthly.notna().astype(int).T.values.tolist(),
        sensitivity=dict(days=25,n=len(sensitivity['X']),fraction=serial(sensitivity['fraction']),loading_cosine=float(abs(np.dot(r['Vt'][0],sensitivity['Vt'][0])))))
    (a.out/'model.json').write_text(json.dumps(model,ensure_ascii=False,indent=2),encoding='utf-8')
    (a.out/'model.js').write_text('window.TAO_EOF = '+json.dumps(model,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
    meta=dict(source=URL,downloaded=downloaded,raw_sha256=model['raw_sha256'],raw_rows=len(d),valid_daily_rows=len(good),
        settings={'quality':[1,2],'source':[1,2,5,6],'min_days':20,'min_station_coverage':.7,'climatology':'available qualifying monthly means, 2000–2024, by calendar month','missing':'complete-case, no imputation','centering':'remove selected-sample residual mean after seasonal adjustment','weights':'equal station weights; no area-weighted basin inference','detrend':False,'covariance_not_correlation':True,'pc_scaling':'sample SD = 1; spatial loading = deg C per PC SD'},
        n=n,stations=labels,first=date_strings[0],last=date_strings[-1],fraction=serial(r['fraction']),sensitivity=model['sensitivity'],versions={'numpy':np.__version__,'pandas':pd.__version__,'matplotlib':matplotlib.__version__})
    (a.out/'analysis-summary.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
    plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'axes.spines.top':False,'axes.spines.right':False,'axes.labelcolor':'#173b4c','text.color':'#173b4c','axes.titleweight':'bold','figure.facecolor':'white','savefig.facecolor':'white'})
    def save(fig,name):
        fig.savefig(a.out/(name+'.png'),dpi=180,bbox_inches='tight',metadata={'Description':'Computed from NOAA PMEL TAO daily 1 m observations; original scientific plot, generated by analyze.py; no generated or stock imagery.','Source':URL,'Raw SHA256':model['raw_sha256']})
        fig.savefig(a.out/(name+'.pdf'),bbox_inches='tight',metadata={'Title':name,'Author':'Ocean course data analysis','Subject':'NOAA PMEL TAO real observations; see analysis-summary.json'})
        plt.close(fig)
    fig,ax=plt.subplots(figsize=(12,4.8),layout='constrained')
    ax.imshow(monthly.notna().T,aspect='auto',interpolation='nearest',cmap=ListedColormap(['#e5ebef','#08748b']),vmin=0,vmax=1,extent=[1999.96,2024.96,9.5,-.5])
    ax.set_yticks(range(10),[s+(' *' if v in cols else '') for s,v in zip(alllabels,monthly.columns)]);ax.set_xticks([2000,2005,2010,2015,2020,2025]);ax.set_xlabel('Year');ax.set_ylabel('Equatorial station (1 m)')
    ax.set_title('Monthly observation coverage | January 2000–December 2024',loc='left',pad=18)
    fig.supxlabel('Teal: >=20 accepted daily observations. Grey: missing / insufficient. * Selected (>=70% coverage).',fontsize=10)
    save(fig,'01-coverage')
    fig,axes=plt.subplots(3,2,figsize=(12,9),layout='constrained',gridspec_kw={'width_ratios':[1,1.7]})
    for k,(left,right) in enumerate(axes):
        left.axhline(0,color='#b9cbd2',lw=1);left.plot(cols,r['load'][:,k],'-o',c='#08748b',lw=2);left.set_xticks(cols,labels,rotation=25);left.set_ylabel('°C per PC SD');left.set_title(f'EOF {k+1} | {r["fraction"][k]*100:.2f}%',loc='left')
        full=pd.Series(r['pc'][:,k],index=r['dates']).reindex(months)
        right.axhline(0,c='#b9cbd2',lw=1);right.plot(full.index,full.values,color='#08748b',lw=1.3,marker='.',ms=3);right.set_xlim(months[0],months[-1]);right.set_title(f'PC {k+1} | gaps retained',loc='left');right.set_ylabel('Standard deviations')
    fig.suptitle(f'TAO station EOF | {n} complete months, {m} equally weighted stations',fontsize=16,weight='bold');save(fig,'02-modes-and-pcs')
    kdate=int(np.argmax(r['pc'][:,0]));x=r['X'][kdate];rec=r['pc'][kdate,:2]@r['load'][:,:2].T
    fig,(left,right)=plt.subplots(1,2,figsize=(12,4.6),layout='constrained')
    left.bar(range(1,m+1),r['fraction']*100,color='#08748b');left.plot(range(1,m+1),np.cumsum(r['fraction'])*100,'o-',color='#ae491f');left.set_xticks(range(1,m+1));left.set_xlabel('Number of modes');left.set_ylabel('Variance (%)');left.set_ylim(0,108);left.set_title('Individual and cumulative variance',loc='left')
    for k,v in enumerate(r['fraction']):left.text(k+1,v*100+2,f'{v*100:.1f}',ha='center',fontsize=10)
    right.axhline(0,c='#b9cbd2',lw=1);right.plot(cols,x,'o-',label='Observed centered anomaly',color='#08748b');right.plot(cols,rec,'s--',label='First 2 modes',color='#ae491f');right.set_xticks(cols,labels,rotation=25);right.set_ylabel('°C');right.set_title(f'Reconstruction | {date_strings[kdate]}',loc='left');right.legend(fontsize=9)
    fig.supxlabel('Training-sample reconstruction, not a forecast. Lines join sampled stations only.',fontsize=10);save(fig,'03-variance-and-reconstruction')
    print(json.dumps(meta,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
