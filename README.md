# DPO2026 · 张浩的描述性物理海洋

纯静态站点，入口 index.html，英文版 en.html，课堂作业 homework.html。

## GitHub Pages

Settings → Pages → Deploy from a branch → main / / (root)。

站内链接均为相对路径，可部署在 https://<user>.github.io/<repo>/ 子路径下。

## 故事会（2026-11-01）

首页 `#story` 已更新为藻类水华专题和两分钟动画；`story.html` 为独立阅读页。视频使用中文合成配音和同屏中英双语字幕，资源位于 `story/`。英文首页同步替换了旧故事会。

故事会新增第七部分“藻类水华的前沿研究”，概述 Dai 等（Nature, 2023；doi:10.1038/s41586-023-05760-y）的遥感方法、主要结果及解读边界；总结顺延为第八部分。中英文首页及独立阅读页同步更新，视频保持原有两分钟版本。

## 课堂作业：物理海洋十大前沿科学问题（2026-11-01）

`homework-frontiers.html` 为吴立新等（科学通报，2026，71(11):2340–2349，doi:10.1360/CSB-2025-5662）的中文课程阅读提要，保留十问顺序，附复述练习与海洋遥感研究联系。中英文作业目录均已增加入口，原有三份作业保留。

## 旧 Netlify 课堂作业整合（2026-11-01）

旧站课程目录的六份作业已统一接入 `homework.html` 与 `homework-en.html`，共十份作业，并补充 TAO EOF 拓展案例入口。混合层七题、海表热收支两题的原有中英文正文已生成独立静态页面。原有地转流、动力学、EOF 的正文、图件与计算数据保留。旧 `course.html#assignments` 入口转到新目录；修复返回链接，TAO 复现包仅更新 README 中的本站地址。第三方 Netlify 参考资料链接保留。

浏览器检查发现旧发布目录缺少英文图件及 EOF 第二、第三模态图件；从各专题原始复现包恢复 62 个 PNG/PDF 文件，修复语言切换与模态切换后的图件、下载链接。现有图件未覆盖。



## 数学公式

全站数学内容使用 LaTeX 源码，由站内 KaTeX 0.19.1 排成可选中的 HTML，并附可访问的 MathML。字体、脚本随网站保存于 `vendor/katex/`，不依赖公式图片或第三方 CDN。

- 行内公式：`\(c=\sqrt{gH}\)`。
- 独立公式：`\[u_g=-\frac{g}{f}\frac{\partial\eta}{\partial y}\]`。多行推导可拆成多个 `.math-display` 块。
- 英文内容在独立 `*-en.html` 页面或 `data-en` 属性中维护；两种语言均使用相同的 LaTeX 语法。
- JavaScript 动态结果用 `String.raw` 模板字符串，或把反斜杠写成 `\\`。`math.js` 会排版新增或更新的公式，也可调用 `window.renderCourseMath(element)`。
- 选中公式复制时，`copy-tex` 会提供 LaTeX 源码。原始观测图、曲线、课堂照片保留；独立的波速公式图片已替换为文本公式卡片。

共享样式在 `math.css`，长公式在自己的区域内横向滚动。KaTeX 原许可证和版本校验信息保留在 `vendor/katex/`。


## AI 内容披露

22 个页面的正文末尾使用静态 .ai-disclosure 说明，样式为 ai-disclosure.css；首页每讲、每章及故事会各自标注，课程阅读器的说明位于正文与附件之后。独立英文页面和 data-en 语言切换均有英文版本。新增正文时应在内容末尾保留或补充声明。

- 历史内容生成模型：**GPT-6 Astra**。
- 本轮已确认的修改模型为 **OpenAI GPT-6（Codex）**，负责公式 LaTeX 化、网页维护与声明添加；不将其追溯为所有历史内容的生成模型。
- 有记录的技能：documents:documents 用于作者出门票文档整理；scientific-visualization 用于动画的科学表述与图形审核（见 story/algal-bloom-story-script.md 制作说明）。其他原始内容的技能未记录。本轮公式与网页修改未调用专门技能。
- GitHub、浏览器、Python / Node.js、KaTeX、Pillow、FFmpeg 和合成声音属于工具或库，不能替代模型或技能名称。
- 作者的出门票原文与照片、教材原文、实测数据以及引用的第三方内容保留各自来源。AI 参与内容可能存在事实、公式、计算或引用错误，需对照教材、原始文献与数据核验。
- 全站使用与版权声明：本站所有内容仅供教学、研究与学习使用，不用于商业获利。如有内容涉及侵权，请联系作者，核实后将及时删除或处理。
