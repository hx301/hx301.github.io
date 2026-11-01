// Course content.
window.COURSE_DATA = {
  "entries": [
    {
      "id": "geostrophic-calculations",
      "category": "assignments",
      "title": "地转流计算与湾流读图｜3题双语解析",
      "date": "2026-10-15",
      "summary": "三道课堂计算题：南极绕极流压力梯度、体积输运、动力高度差；逐幅解释湾流密度、比容异常、动力高度和地转速度。",
      "tags": [
        "地转流",
        "动力高度",
        "湾流",
        "双语作业"
      ],
      "published": true,
      "body": "保留两张课堂原图，写清估读、纬度依赖与3000 m参考层假设。",
      "attachments": []
    },
    {
      "id": "ocean-dynamics-five",
      "category": "assignments",
      "title": "海洋动力学五题｜惯性振荡、位涡与 Sverdrup",
      "date": "2026-10-15",
      "summary": "五道课堂题的英文原题、中文翻译与双语详细答案。含惯性周期计算、受力图、参考流速、位涡与 Ekman–Sverdrup 推导。",
      "tags": [
        "惯性振荡",
        "位涡",
        "Sverdrup",
        "双语作业"
      ],
      "published": true,
      "body": "原题来自提供的课堂图片；参考解析和教学图逐项标明假设。",
      "attachments": []
    },
    {
      "id": "geostrophic-current",
      "category": "assignments",
      "title": "地转流：从海面斜坡到海洋内部",
      "date": "2026-10-15",
      "summary": "从压力梯度与科里奥利受力出发，逐步推导地转流、海面坡度和热成风；配南北半球流向图、交互实验与完整算例。",
      "tags": [
        "地转流",
        "海面高度",
        "热成风",
        "中英文"
      ],
      "published": true,
      "body": "先理解受力，再约定坐标，最后把高度和密度转化为流速。全章遵循同一套符号，逐步推导每一个方向和单位。",
      "attachments": []
    },
    {
      "id": "eof-method",
      "category": "assignments",
      "title": "EOF 详解｜真实海温、投影直觉与模态重建",
      "date": "2026-10-14",
      "summary": "从零理解 EOF：使用 NOAA ERSSTv5 的 564 个月、1,626 个海洋格点，逐步讲解预处理、投影、SVD、空间模态与重建。附双语图件、数据和 Python。",
      "tags": [
        "EOF",
        "NOAA ERSSTv5",
        "真实数据",
        "中英文"
      ],
      "published": true,
      "body": "使用 1979—2025 年 NOAA ERSSTv5 热带太平洋月度海温，完成季节背景扣除、去趋势、面积加权和协方差 EOF。包含双语讲解、旋转投影、手算例子、模态播放、重建残差、敏感性分析和可复现下载。",
      "attachments": []
    },
    {
      "id": "mixed-layer-homework",
      "category": "assignments",
      "title": "混合层与海洋结构｜7 题双语解析",
      "date": "2026-10-08",
      "summary": "从混合层深度到温跃层机制，整理课堂 7 道题的英文原题、中文翻译与中英参考答案。",
      "tags": [
        "混合层",
        "温盐结构",
        "双语解析"
      ],
      "body": "题目转录自本人提供的课堂图片。原题编号与图片保持一致，页面日期为收录日期。以下为辅助理解的参考解析，可结合课程讲义继续订正。\n\n## 1. 混合层可以有多深？\n### 英文原题\nHow deep is a typical mixed layer if mixed by wind? How deep can it reach if driven by cooling?\n\n### 中文翻译\n风驱动形成的典型混合层有多深？如果由冷却驱动，最深可以达到多少？\n\n### 参考解析\n风搅拌形成的混合层常以数十米至约百米为量级，约百米并不是固定上限；深度还取决于已有密度层结、风的强度与持续时间。冬季冷却导致的对流常达几十至几百米，在少数层结较弱、浮力损失强的深对流区可超过 1500 m。深对流不能全部归因于风搅拌。\n\n### English reference answer\nWind stirring commonly mixes the upper tens of metres, roughly up to 100 m, depending on stratification. Cooling-driven convection often reaches tens to several hundred metres and can exceed 1,500 m at exceptional deep-convection sites.\n\n参考依据：[2]。\n\n## 2. 北太平洋的温盐垂直结构\n### 英文原题\nWhat are the typical vertical temperature and salinity profiles in the subtropical and subpolar regions of the North Pacific?\n\n### 中文翻译\n北太平洋副热带和副极地海区的典型温度、盐度垂直剖面分别是什么样的？\n\n### 参考解析\n副热带北太平洋表层通常温暖、较咸，下接明显永久温跃层；盐度向中层降低，常见北太平洋中层水的盐度极小值，再向深层回升。副极地表层较冷、较淡，盐度随深度增加形成强盐跃层；夏季可在暖表层之下保留冬季冷水，出现温度极小和局部逆温。盐度增加仍可维持稳定密度层结，具体曲线随季节和东西位置变化。\n\n### English reference answer\nThe subtropical North Pacific usually has warm, saline surface water, a pronounced thermocline and an intermediate salinity minimum. The subpolar ocean has fresher surface water and a strong halocline; remnant winter water can produce a subsurface temperature minimum and inversion while density remains stably stratified.\n\n参考依据：[2]、[7]。\n\n## 3. 净蒸发主要发生在哪里？\n### 英文原题\nWhat are the dominant regions of net evaporation in the ocean?\n\n### 中文翻译\n海洋中以净蒸发为主的区域主要在哪里？\n\n### 参考解析\nE > P 表示海洋向大气净失去淡水，常见于南北半球副热带干燥带，尤其副热带环流区及地中海、红海等强蒸发海域。赤道降雨带和多数高纬海域一般相反。盐度还受径流、海冰、平流和混合影响，不能仅由当地 E−P 判断。\n\n### English reference answer\nNet evaporation occurs mainly in the dry subtropics and strongly evaporative marginal seas. Rain belts and many high-latitude regions instead receive net precipitation. Salinity also depends on runoff, ice processes and ocean transport.\n\n参考依据：[1]、[7]。\n\n## 4. 混合层的热量账本\n### 英文原题\nWhat are the key components of the Mixed Layer heat budget?\n\n### 中文翻译\n混合层热收支的主要组成部分有哪些？\n\n### 参考解析\n对均匀混合层，可写 ∂Tm/∂t = (Qnet − Qpen)/(ρcp h) − um·∇Tm − we(Tm − Tb)/h + D。Qpen 是穿过层底的向下短波，不能算作本层吸收；水平平流输送冷热水，we ≥ 0 表示夹卷，Tb 为层下温度，D 汇总其余混合。夹卷较冷水会降温；存在逆温时也可能增温。层越浅，相同净吸热造成的温变越快。\n\n### English reference answer\nMixed-layer temperature changes through absorbed surface heat, horizontal advection, entrainment and mixing. Subtract shortwave transmitted below the layer from Qnet. Entrainment cools a layer when underlying water is colder, but can warm it under a temperature inversion; a shallower layer responds more rapidly to a given heat input.\n\n参考依据：[4]。\n\n## 5. 大西洋为什么更咸？\n### 英文原题\nIs the North Atlantic Ocean saltier or fresher on average than the Pacific? Why?\n\n### 中文翻译\n北大西洋平均而言比太平洋更咸还是更淡？为什么？\n\n### 参考解析\n同纬度比较时，北大西洋总体较北太平洋咸，关键是淡水收支和输送不同。大西洋蒸发水汽的一部分跨中美洲输往太平洋，且海洋环流将副热带咸水向北输送；北太平洋表层淡水输入较强。地中海高盐出流也影响大西洋中层。局地、深度和季节都有例外，不能只说大西洋温度更高、蒸发更多。\n\n### English reference answer\nThe North Atlantic is generally saltier because basin freshwater budgets and transport differ. Atmospheric moisture export toward the Pacific and northward ocean transport of saline subtropical water are important; Mediterranean outflow also affects intermediate depths. The contrast is not explained by evaporation alone.\n\n参考依据：[5]、[7]。\n\n## 6. 海洋的夏冬差异\n### 英文原题\nWhat regions of the ocean are characterized by large differences from summer to winter? What regions have the least seasonal variability?\n\n### 中文翻译\n哪些海区从夏季到冬季的变化较大？哪些海区的季节变化最小？\n\n### 参考解析\n先明确季节变化指哪个量。若指海表温度的年内振幅，中纬度海域通常较强，热带暖池和全年接近冰点的水域通常较弱；混合层厚度、平流和海冰会改变这一分布。若指混合层深度，则强冬季冷却、弱层结海域可出现很大年内变化。精确最大、最小区域需给定变量、统计方式和课程图。\n\n### English reference answer\nSpecify the variable first. SST seasonality is commonly stronger at midlatitudes and weaker in tropical warm pools or waters constrained near freezing. Mixed-layer-depth seasonality follows a different pattern, with large deepening in winter-convection regions. Exact extrema require a defined metric and dataset.\n\n参考依据：[1]、[2]。\n\n## 7. 什么维持着温跃层？\n### 英文原题\nPlease describe the two processes that maintain the thermocline.\n\n### 中文翻译\n请描述维持温跃层的两种过程。\n\n### 参考解析\n“维持温跃层的两个过程”需区分对象。季节温跃层与表层加热形成层结、风搅拌和冷却对流削弱层结的竞争有关；永久温跃层的简化模型可用向下热扩散与冷水上升的平流平衡解释，但真实海洋还受风驱动下沉、沿等密面平流和通风控制。缺少课堂上下文，不能把其中任一对机制宣称为唯一标准答案。\n\n### English reference answer\nFor a seasonal thermocline, discuss stabilizing surface heating versus mixing and cooling. For a permanent thermocline, a simple model balances downward heat diffusion with cold-water upwelling, while ventilation and three-dimensional advection also matter. The intended pair of processes requires the course context.\n\n参考依据：[2]、[6]。\n\n## 参考资料\n[1] Robert H. Stewart — Introduction to Physical Oceanography, Chapters 5–6 (University of Washington copy)\n[2] Scripps / Lynne Talley — Upper ocean water masses: formation and mechanisms\n[4] NOAA PMEL / Cronin & McPhaden — Upper ocean heat balance, methodology\n[5] Singh et al. (2016) — Greater aerial moisture transport distances with warming amplify interbasin salinity contrasts (NOAA repository)\n[6] WHOI / Geoffrey Vallis — Lecture 9: The Deep Ocean Circulation, theory of the main thermocline\n[7] Scripps / Lynne Talley — Salinity patterns in the ocean\n\n可通过下方链接访问原始资料。",
      "attachments": [
        {
          "name": "[1] Robert H. Stewart — Introduction to Physical Oceanography, Chapters 5–6 (University of Washington copy)",
          "url": "https://earthweb.ess.washington.edu/booker/ESS514/stewart/stewart_ocean_book.pdf"
        },
        {
          "name": "[2] Scripps / Lynne Talley — Upper ocean water masses: formation and mechanisms",
          "url": "https://talleylab.ucsd.edu/ltalley/sio210/Upper_ocean_water_masses/index.html"
        },
        {
          "name": "[4] NOAA PMEL / Cronin & McPhaden — Upper ocean heat balance, methodology",
          "url": "https://www.pmel.noaa.gov/pubs/outstand/cron1713/cron1713.shtml"
        },
        {
          "name": "[5] Singh et al. (2016) — Greater aerial moisture transport distances with warming amplify interbasin salinity contrasts (NOAA repository)",
          "url": "https://repository.library.noaa.gov/view/noaa/68044"
        },
        {
          "name": "[6] WHOI / Geoffrey Vallis — Lecture 9: The Deep Ocean Circulation, theory of the main thermocline",
          "url": "https://gfd.whoi.edu/wp-content/uploads/sites/18/2018/03/Lecture_9_Vallis_218245.pdf"
        },
        {
          "name": "[7] Scripps / Lynne Talley — Salinity patterns in the ocean",
          "url": "https://sam.ucsd.edu/ltalley/papers/2000s/wiley_talley_salinitypatterns.pdf"
        }
      ],
      "published": true
    },
    {
      "id": "heat-budget-homework",
      "category": "assignments",
      "title": "海表热收支｜2 题双语解析",
      "date": "2026-10-08",
      "summary": "理清短波、长波、潜热和感热的控制因素、符号与量级；具体极值留待课程图表核对。",
      "tags": [
        "海气热通量",
        "热收支",
        "极值待核对"
      ],
      "body": "题目转录自本人提供的课堂图片。原题编号与图片保持一致，页面日期为收录日期。以下为辅助理解的参考解析，可结合课程讲义继续订正。\n\n本页统一约定：各项均以进入海洋为正，Qnet = Qs + Qb + Qe + Qh。海洋向大气的长波、蒸发和感热损失，在该约定下通常记为负值。若课堂将损失量定义为正，应改写相应减号。第二题的精确极值需要课程指定图表，当前尚待补充。\n\n## 1. 四种热通量由什么决定？\n### 英文原题\nWhat factors determine the heat budget terms, Qs, Qb, Qe and Qh, respectively? Make clear the importance of each factor of each term.\n\n### 中文翻译\n分别有哪些因素决定热收支项 Qs、Qb、Qe 和 Qh？请说明各项中各因素的重要性。\n\n### 参考解析\n统一取向下、进入海洋为正，Qnet = Qs + Qb + Qe + Qh。Qs 是净短波，受太阳高度、昼长、云和反照率控制；Qb 是向下大气长波减海面向上长波，受海温、云、水汽和大气温度控制；Qe 主要取决于风速及海气比湿差，蒸发时为负；Qh 主要取决于风速及海气温差，海面比空气暖时为负。不要把净长波与海面单向辐射混用。\n\n### English reference answer\nTake every flux as positive downward: Qnet = Qs + Qb + Qe + Qh. Shortwave depends on solar geometry, clouds and albedo; net longwave on sea and atmospheric temperature, humidity and clouds. Latent and sensible fluxes depend mainly on wind and the air–sea humidity and temperature contrasts, respectively.\n\n参考依据：[1]、[3]。\n\n## 2. 通量有多大，极值在哪里？\n### 英文原题\nWhat are the ranges of the magnitude of the four terms? For each term, please specify the location and value of the maximum and minimum center.\n\n### 中文翻译\n这四项的量值范围分别是多少？请给出每一项最大值与最小值中心的位置及其数值。\n\n### 参考解析\n年平均量级可先记：净短波通常为正、约 10² W m⁻²；潜热多为负、约 10¹–10² W m⁻²；净长波和感热常为负、约 10¹ W m⁻²。这些不是全球极值。晴朗低纬区短波通常较强，高纬区较弱；暖流遇冷干强风时潜热、感热损失往往增强。按本页符号，最强散热对应更负的最小值。课程通量图尚未提供，各分量的确切最大值、最小值及位置待据原图确认。\n\n### English reference answer\nTypical annual-mean scales are 10² W m⁻² for shortwave, 10¹–10² for latent heat loss, and 10¹ for net longwave and sensible heat loss. These are scales, not global extrema. Exact maxima, minima and locations require the assigned map; with downward-positive signs, strongest cooling means the most negative value.\n\n参考依据：[1]、[3]。\n\n## 参考资料\n[1] Robert H. Stewart — Introduction to Physical Oceanography, Chapters 5–6 (University of Washington copy)\n[3] NOAA PMEL / Hayes et al. — Variability of the sea surface temperature\n\n可通过下方链接访问原始资料。",
      "attachments": [
        {
          "name": "[1] Robert H. Stewart — Introduction to Physical Oceanography, Chapters 5–6 (University of Washington copy)",
          "url": "https://earthweb.ess.washington.edu/booker/ESS514/stewart/stewart_ocean_book.pdf"
        },
        {
          "name": "[3] NOAA PMEL / Hayes et al. — Variability of the sea surface temperature",
          "url": "https://www.pmel.noaa.gov/pubs/outstand/haye1160/haye1160.shtml"
        }
      ],
      "published": true
    },
    {
      "id": "phytoplankton-blooms",
      "category": "research",
      "title": "故事会｜藻类水华：小藻的水下派对",
      "date": "2026-11-01",
      "summary": "两分钟原创科普动画，配中文旁白与中英双语字幕；八部分正文解释藻类、水华、生态作用、发生机制、影响、防控与海洋遥感前沿研究。",
      "tags": [
        "藻类水华",
        "故事会",
        "科普动画",
        "中英双语字幕"
      ],
      "body": "从小藻的正常生活到营养输入、增长与聚集、缺氧风险，再到综合防控。图形为概念示意，配音为 AI 合成；完整文章保留科学边界与资料来源，并概述 Dai 等（2023）的全球近岸水华遥感研究。",
      "attachments": [
        {
          "name": "完整故事会",
          "url": "./story.html"
        },
        {
          "name": "两分钟双语动画",
          "url": "./story/algal-bloom-story-2min.mp4"
        },
        {
          "name": "中英双语字幕",
          "url": "./story/algal-bloom-story-bilingual.srt"
        }
      ],
      "published": true
    }
  ]
};
