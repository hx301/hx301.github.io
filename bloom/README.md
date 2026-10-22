# Phytoplankton blooms: a reproducible teaching experiment
# 浮游植物水华：可复现的教学实验

This project combines **one real satellite image** with **an independently calculated teaching model**. The model parameters are illustrative. They were not estimated from the image or fitted to observations. Analysis and figures were prepared with AI assistance; this is not a claim that the student collected in-situ data.

本项目把**一张真实卫星影像**与**独立计算的教学模型**放在一起。模型参数均为示例，没有从图片反演，也没有用观测拟合。计算与图件由 AI 辅助整理，不代表学生开展了实地采样。

## Real observation / 真实观测

- Image: `nasa-greenland-20240616.jpg` (1600 × 1066 pixels; exact bytes and SHA256 are in `sources-and-assets.json`).
- Acquisition: 2024-06-16, Aqua/MODIS, east of Greenland and south of Iceland.
- Source: [NASA Earth Observatory: Peek-a-Bloom in the North Atlantic](https://science.nasa.gov/earth/earth-observatory/peek-a-bloom-in-the-north-atlantic-152953/), published 2024-06-20.
- Credit: NASA Earth Observatory image by Lauren Dauphin, using MODIS data from NASA EOSDIS LANCE and GIBS/Worldview.
- Download: https://assets.science.nasa.gov/dynamicimage/assets/science/esd/eo/images/imagerecords/152000/152953/greenlandbloom_amo_20240616_lrg.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1067&w=1600
- The file is the NASA server's web-resolution derivative. Provenance text was added to image metadata; decoded pixels remain unchanged. The original image remains linked at NASA. This natural-color image does **not** identify species, supply chlorophyll concentration, or measure growth rate. Clouds hide part of the ocean. No concentrations have been digitized from these colors.
- 图像为 NASA 服务器提供的网页分辨率版本；已添加来源元数据，解码像素保持不变。自然色图不能独立确定物种、叶绿素浓度或增长率；云层遮挡使观测不完整。本项目没有从图像颜色伪造浓度数据。

## Model / 模型

The vertical coordinate `z` increases downward from the surface. `H>0` is the depth of a uniformly and actively mixed population; `N>=0` is a spatially uniform dissolved nutrient concentration. A comparison between two H values compares two fixed idealized states; it does not simulate deepening, entrainment or dilution.

坐标 z 从海面向下为正。H 是浮游植物均匀分布、并被持续混合的层厚，N 是层内均匀的溶解营养盐浓度。改变 H 比较的是两个固定理想状态，不是在模拟混合层加深、夹卷或稀释的时间过程。

```
I(z) = I0 exp(-k z)
Ibar = (1/H) integral[0,H] I(z) dz
     = I0 [1 - exp(-k H)] / (k H)

Lbar = (1/H) integral[0,H] I(z)/(IK + I(z)) dz
     = ln[(IK+I0)/(IK+I0 exp(-k H))] / (k H)

mu_bar = mu_max [N/(KN+N)] Lbar
r = mu_bar - loss
dP/dt = r P
P(t)/P(0) = exp(r t)       [only for constant r]
```

The nonlinear light response is averaged **over depth**. In general `Lbar != Ibar/(IK+Ibar)`: applying a nonlinear response after averaging light gives a different model. Nutrient limitation and light limitation are multiplied as a simple teaching choice, not a universal physiological law.

这里先逐深度计算饱和光响应，再平均；不能把层平均光直接代入非线性饱和函数，冒充同一个积分。光限制与营养限制相乘是本教学模型的简化选择，不是普适生理定律。

| Parameter | Value | Unit / meaning |
|---|---:|---|
| I0 | 100 | μmol photons m⁻² s⁻¹; fixed effective surface light / 固定有效表面光 |
| k | 0.06 | m⁻¹; light attenuation / 光衰减系数 |
| IK | 30 | μmol photons m⁻² s⁻¹; half-saturation light / 光半饱和值 |
| mu_max | 1.0 | d⁻¹; maximum gross specific growth / 最大总比增长率 |
| KN | 1.0 | mmol m⁻³; nutrient half-saturation / 营养盐半饱和值 |
| loss | 0.20 | d⁻¹; fixed aggregate loss / 固定综合损失率 |

`loss` collects simplified respiration, grazing and export losses. It is not a measured grazing rate. Diel light variation, nutrients consumed by growth, variable losses, temperature-dependent physiology, species competition, advection and self-shading are omitted. Therefore seven-day exponential curves are conditional thought experiments, not bloom forecasts. No comparison with the 2024 image is a model validation.

loss 将呼吸、摄食与输出损失简化合并，并非实测摄食率。模型未加入昼夜变化、营养盐消耗、损失率变化、温度依赖、多物种竞争、平流与自遮光。因此 7 天指数曲线只是有条件的思想实验，不是预报，也没有通过 2024 年卫星图片验证。

## Three checks / 三种情景

| Scenario | H (m) | N (mmol m⁻³) | r (d⁻¹) | P(7)/P(0) |
|---|---:|---:|---:|---:|
| Deep, rich / 深混合、营养多 | 120 | 5.0 | −0.0305727 | 0.807341 |
| Shallow, rich / 浅混合、营养多 | 20 | 5.0 | +0.3355566 | 10.474003 |
| Shallow, poor / 浅混合、营养少 | 20 | 0.2 | −0.0928887 | 0.521931 |

At N=5, the model's neutral-growth depth is 101.3003 m; at N=1 it is 56.7143 m. At N=0.2 there is no positive neutral depth: even the surface limit cannot overcome the assumed losses. These numbers are **model-specific thresholds**, not observed Sverdrup critical depths.

N=5 时本模型的零净增长层深为 101.3003 m；N=1 时为 56.7143 m；N=0.2 时，即使在表面极限也抵不过给定损失，不存在正的临界层厚。这些是**本模型阈值**，不是实测海区的 Sverdrup 临界深度。

## Reproduce / 复现

```sh
python -m pip install numpy matplotlib
python bloom_model.py --output .
```

For Chinese labels install Microsoft YaHei or Noto Sans CJK. The script uses these fonts if available; English figures do not require a Chinese font. The calculation has no random numbers or network requests. Tests in the script compare the analytic light-response integral against dense numerical quadrature and check the signs and threshold of the example cases.

- `light-profile.csv`: depth and light fraction, 201 rows.
- `model-grid.csv`: H=1…200 m, N=0.1…10.0 mmol m⁻³; 20,000 configurations. Columns: H, N, mean light, mean-light fraction, depth-mean light limitation, gross growth, loss and net growth.
- `scenarios.csv`: three exact example states and 7-day conditional multipliers.
- `seven-day-trajectories.csv`: three conditional curves at 0.1-day spacing.
- `model-summary.json`: parameters and precise outputs.
- `light-and-mixing-{zh,en}.{png,pdf}`: irradiance and mixing-depth intuition.
- `growth-threshold-{zh,en}.{png,pdf}`: net growth against H for three N values.
- `three-scenarios-{zh,en}.{png,pdf}`: three net rates and conditional trajectories.
- `sources-and-assets.json`: evidence links, image attribution and hashes.

## Physical context and limits / 物理解释与边界

In the classical critical-depth argument, the depth-integrated photosynthetic gain balances depth-integrated loss at the critical depth. This differs from the compensation depth, where **local** gain and loss balance. Its application assumes a well-mixed population and a specified light/loss structure. A density-defined mixed layer need not be the layer of active turbulence. Eddies, changes in turbulent mixing and changes in grazing can change accumulation; surface warming is not a universal bloom switch.

临界深度比较整层积分的收益与损失；补偿深度比较某个深度的局地收益与损失，两者不同。经典解释需要充分混合的种群与给定的光、损失结构。密度定义的混合层未必等于正在湍混的层。涡旋、湍混变化与放牧变化均可影响积累，不能把表面增暖当作所有水华的开关。

## Reading / 参考资料

1. [Sverdrup (1953), On Conditions for the Vernal Blooming of Phytoplankton](https://doi.org/10.1093/icesjms/18.3.287), *Journal du Conseil* 18:287–295. Original critical-depth argument; this project's saturating, nutrient-limited model is an extension for teaching, not a reproduction of his exact equations.
2. [Franks (2015), Has Sverdrup's critical depth hypothesis been tested? Mixed layers vs. turbulent layers](https://doi.org/10.1093/icesjms/fsu175). Distinguishes hydrographic mixed layers from active turbulent layers.
3. [Kovač, Platt & Sathyendranath (2021), Sverdrup meets Lambert](https://doi.org/10.1093/icesjms/fsab013). Modern mathematical discussion of integrated growth, losses and critical depth.
4. [WHOI (2012), Scientists Discover New Trigger for Immense North Atlantic Ocean Spring Plankton Bloom](https://www.whoi.edu/press-room/news-release/scientists-discover-new-trigger-for-immense-north-atlantic-ocean-spring-plankton-bloom/). Reports the 2008 North Atlantic field study and eddy restratification mechanism.
5. [NASA Ocean Color chlorophyll-a algorithm](https://oceancolor.gsfc.nasa.gov/files/atbd/atbd-obdaac-chlorophyll-a.pdf). Explains the near-surface chlorophyll-a product; a quantitative product is different from a natural-color photograph.

Prepared: 2026-10-19. Sources browsed and image retrieved on that date.
