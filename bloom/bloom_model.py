"""Reproduce the course bloom teaching experiment (not an observational fit).

Python >=3.9; pip install numpy matplotlib
Run: python bloom_model.py --output .
No network calls, random numbers or hidden data dependencies.
"""
from pathlib import Path
import argparse, csv, json, math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

P = dict(I0=100.0, k=0.06, I_K=30.0, mu_max=1.0, K_N=1.0, loss=0.20)

def mean_light(H):
    """Mean irradiance; I0 and I_K use micromol photons m^-2 s^-1."""
    H = np.asarray(H, dtype=float)
    return P['I0'] * (-np.expm1(-P['k'] * H)) / (P['k'] * H)

def mean_light_limitation(H):
    """Exact depth average of I(z)/(I_K+I(z)), for uniform biomass."""
    H = np.asarray(H, dtype=float)
    return np.log((P['I_K'] + P['I0']) /
                  (P['I_K'] + P['I0'] * np.exp(-P['k'] * H))) / (P['k'] * H)

def gross_growth(H, N):
    return P['mu_max'] * (np.asarray(N) / (P['K_N'] + np.asarray(N))) * mean_light_limitation(H)

def net_growth(H, N):
    return gross_growth(H, N) - P['loss']

def critical_depth(N):
    """Positive root of net_growth; None if the near-surface rate is <=0."""
    if float(net_growth(1e-5, N)) <= 0:
        return None
    lo, hi = 1e-5, 10000.0
    for _ in range(90):
        mid = (lo + hi) / 2
        if float(net_growth(mid, N)) > 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2

def write_csv(path, columns, rows):
    with path.open('w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(columns)
        writer.writerows(rows)

def run(out):
    out.mkdir(parents=True, exist_ok=True)
    fonts = ['DejaVu Sans']
    for candidate in [Path('C:/Windows/Fonts/msyh.ttc'),
                      Path('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')]:
        if candidate.exists():
            font_manager.fontManager.addfont(str(candidate))
            fonts.insert(0, font_manager.FontProperties(fname=str(candidate)).get_name())
            break
    plt.rcParams.update({'font.family': fonts, 'font.size': 11, 'axes.unicode_minus': False,
                         'axes.edgecolor': '#94a3a8', 'axes.labelcolor': '#223b43',
                         'text.color': '#223b43', 'xtick.color': '#45606b', 'ytick.color': '#45606b',
                         'figure.facecolor': '#ffffff', 'axes.facecolor': '#ffffff',
                         'pdf.fonttype': 42, 'savefig.facecolor': '#ffffff'})
    depth = np.arange(1.0, 201.0)
    nutrients = np.arange(0.1, 10.01, 0.1)
    scenarios = [('deep_rich', 120.0, 5.0), ('shallow_rich', 20.0, 5.0), ('shallow_poor', 20.0, 0.2)]
    result = []
    for name, H, N in scenarios:
        r = float(net_growth(H, N))
        result.append(dict(scenario=name, H_m=H, N_mmol_m3=N,
                           mean_light=float(mean_light(H)),
                           mean_light_fraction=float(mean_light(H)/P['I0']),
                           mean_light_limitation=float(mean_light_limitation(H)),
                           gross_growth_per_day=float(gross_growth(H,N)),
                           loss_per_day=P['loss'], net_growth_per_day=r,
                           biomass_ratio_day7=math.exp(7*r)))
    write_csv(out/'light-profile.csv', ['depth_m','light_fraction_of_surface'],
              ((float(z), math.exp(-P['k']*z)) for z in np.arange(0.,201.)))
    write_csv(out/'model-grid.csv', ['H_m','N_mmol_m3','mean_light_umol_photons_m2_s',
              'mean_light_fraction','mean_light_limitation','gross_growth_per_day','loss_per_day','net_growth_per_day'],
              ((float(H),round(float(N),2),float(mean_light(H)),float(mean_light(H)/P['I0']),
                float(mean_light_limitation(H)),float(gross_growth(H,N)),P['loss'],float(net_growth(H,N)))
               for H in depth for N in nutrients))
    write_csv(out/'scenarios.csv',list(result[0]),([r[c] for c in result[0]] for r in result))
    write_csv(out/'seven-day-trajectories.csv', ['day']+[s[0] for s in scenarios],
              ([float(t)]+[math.exp(float(net_growth(H,N))*t) for _,H,N in scenarios]
               for t in np.linspace(0,7,71)))
    metrics = dict(parameters=P, critical_depth_N5_m=critical_depth(5),
                   critical_depth_N1_m=critical_depth(1),
                   critical_depth_N02_m=critical_depth(.2), scenarios=result)
    (out/'model-summary.json').write_text(json.dumps(metrics,indent=2),encoding='utf-8')
    colors = ['#52677c','#13816d','#c16637']
    for lang in ['zh','en']:
        zh = lang=='zh'
        def style(ax):
            ax.spines[['top','right']].set_visible(False)
            ax.grid(alpha=.16)
        def save(fig, name):
            fig.savefig(out/f'{name}-{lang}.png',dpi=180,bbox_inches='tight')
            fig.savefig(out/f'{name}-{lang}.pdf',bbox_inches='tight')
            plt.close(fig)
        fig, axes=plt.subplots(1,2,figsize=(12,5.2),layout='constrained')
        z=np.linspace(0,150,401)
        axes[0].plot(np.exp(-P['k']*z),z,lw=2.6,color='#be8c2f')
        for H,c in [(20,colors[1]),(120,colors[0])]:
            axes[0].axhline(H,color=c,ls='--',lw=1.5)
            axes[0].text(.97,H+3,f'H = {H} m',ha='right',va='top',color=c)
        axes[0].set(xlim=(0,1),ylim=(150,0),xlabel='I(z) / I₀',
                    ylabel='深度 z（m，向下为正）' if zh else 'Depth z (m, positive downward)',
                    title='A  相同的衰减曲线，不同的混合深度' if zh else 'A  Same attenuation, different mixing depths')
        axes[1].plot(depth,mean_light(depth)/P['I0'],lw=2.6,color='#be8c2f')
        for H,c in [(20,colors[1]),(120,colors[0])]:
            frac=float(mean_light(H)/P['I0'])
            axes[1].scatter([H],[frac],s=55,color=c,zorder=5)
            axes[1].annotate(f'{H} m: {frac:.3f}',(H,frac),xytext=(H+8,frac+.05),color=c)
        axes[1].set(xlim=(0,200),ylim=(0,1),xlabel='均匀混合层深度 H（m）' if zh else 'Uniform mixing depth H (m)',
                    ylabel='层平均光 / 表面光' if zh else 'Layer-mean / surface irradiance',
                    title='B  混合越深，平均可获得的光越少' if zh else 'B  Deeper mixing reduces mean light')
        for ax in axes: style(ax)
        fig.suptitle('教学模型 · 光如何被水柱“分摊”' if zh else 'Teaching model · How light is shared through the water column',fontsize=17)
        save(fig,'light-and-mixing')

        fig,ax=plt.subplots(figsize=(10.6,5.4),layout='constrained')
        ax.axhspan(0,.6,color='#eaf5ef')
        ax.axhspan(-.2,0,color='#fbefea')
        for N,c in [(5,colors[1]),(1,'#8d8452'),(.2,colors[2])]:
            ax.plot(depth,net_growth(depth,N),color=c,lw=2.6,label=f'N = {N:g} mmol m⁻³')
        Hc=critical_depth(5)
        ax.scatter([Hc],[0],color=colors[1],s=60,zorder=6)
        ax.annotate(('N = 5 的阈值' if zh else 'Threshold at N = 5')+f' ≈ {Hc:.1f} m',
                     (Hc,0),xytext=(Hc+6,.17),arrowprops=dict(arrowstyle='->',color=colors[1]),color=colors[1])
        ax.axhline(0,color='#223b43',lw=1)
        ax.set(xlim=(0,200),ylim=(-.2,.5),xlabel='均匀混合层深度 H（m）' if zh else 'Uniform mixing depth H (m)',
               ylabel='净增长率 r（d⁻¹）' if zh else 'Net growth rate r (d⁻¹)',
               title='光、营养、损失必须一起算' if zh else 'Light, nutrients and losses must be considered together')
        ax.legend(loc='upper right',frameon=False)
        ax.text(195,.03,'积累 r > 0' if zh else 'Accumulation r > 0',ha='right',color='#13816d')
        ax.text(195,-.18,'减少 r < 0' if zh else 'Decline r < 0',ha='right',color='#a44f2b')
        style(ax);save(fig,'growth-threshold')

        fig,axes=plt.subplots(1,2,figsize=(12,5.4),layout='constrained')
        labels=['深混合／营养多\nH=120 m, N=5','浅混合／营养多\nH=20 m, N=5','浅混合／营养少\nH=20 m, N=0.2'] if zh else ['Deep / nutrient-rich\nH=120 m, N=5','Shallow / nutrient-rich\nH=20 m, N=5','Shallow / nutrient-poor\nH=20 m, N=0.2']
        rates=[r['net_growth_per_day'] for r in result]
        axes[0].barh(np.arange(3),rates,color=colors,height=.5)
        axes[0].set_yticks(np.arange(3),labels=labels)
        axes[0].invert_yaxis()
        for idx,r in enumerate(rates):
            axes[0].text(.41,idx,f'{r:+.3f}',ha='right',va='center')
        axes[0].axvline(0,color='#223b43',lw=1)
        axes[0].set(xlim=(-.15,.43),xlabel='净增长率 r（d⁻¹）' if zh else 'Net growth rate r (d⁻¹)',
                    title='A  三种情景的瞬时净增长' if zh else 'A  Three instantaneous net rates')
        t=np.linspace(0,7,200)
        shortlabels=['深层／富营养','浅层／富营养','浅层／贫营养'] if zh else ['Deep / rich','Shallow / rich','Shallow / poor']
        for rate,c,label in zip(rates,colors,shortlabels):
            axes[1].plot(t,np.exp(rate*t),color=c,lw=2.6,label=label)
        axes[1].set(xlabel='时间（天）' if zh else 'Time (days)',ylabel='P(t) / P(0)',xlim=(0,7),
                    title='B  固定环境的 7 天思想实验' if zh else 'B  Seven days with fixed conditions')
        axes[1].legend(frameon=False,loc='upper left')
        for ax in axes:style(ax)
        fig.suptitle('示例参数，不是海洋观测或水华预报' if zh else 'Illustrative parameters · Not observations or a bloom forecast',fontsize=16)
        save(fig,'three-scenarios')
    # Independent consistency checks: exact integration, low-depth limit and signs.
    for H in [1,20,120,200]:
        z=np.linspace(0,H,100001)
        I=P['I0']*np.exp(-P['k']*z)
        sampled=float(np.trapezoid(I/(P['I_K']+I),z)/H) if hasattr(np,'trapezoid') else float(np.trapz(I/(P['I_K']+I),z)/H)
        assert math.isclose(sampled,float(mean_light_limitation(H)),abs_tol=1e-9)
    assert net_growth(120,5)<0<net_growth(20,5)
    assert net_growth(20,.2)<0
    assert abs(float(net_growth(critical_depth(5),5)))<1e-12
    assert math.isclose(float(mean_light(1e-6)),P['I0'],rel_tol=1e-6)
    print(json.dumps(metrics,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',type=Path,default=Path(__file__).resolve().parent)
    run(parser.parse_args().output)
