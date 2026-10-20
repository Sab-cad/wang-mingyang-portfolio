# 品牌视觉作品集 — 维护说明

## 网站范围
- 首页：云海首屏、设计观点、四个能力方向、设计流程、三个精选品牌、视觉轮播、合作需求与常见问题。
- 品牌案例：`/project/01`、`/project/02`、`/project/03`。
- 能力分类：`/capability/brand-systems`、`/capability/ai-creative`、`/capability/3d-motion`、`/capability/ecommerce`。
- 数字演示：`/digital/01`、`/digital/02`、`/digital/03`。

## 修改内容
编辑 `data/content.json`：profile 为个人介绍和邮箱，projects 为案例，capabilities 为分类。所有案例都有品牌家族、材质特写、海报空间应用、规范稿与数字演示。

`projects[].preview` 控制首页辅助图片；`projects[].digital` 控制数字演示的标题文案。作品集使用示意身份和自主概念项目，未加入虚构客户经历或效果数字。

邮箱留空时不展示邮箱入口。填写真实 `profile.email` 后，合作需求工具会自动显示邮件联系入口。需求单在访客浏览器内生成 TXT，不会发送或上传，没有后端收件功能。

## 图片与素材
`public/original` 中 PNG 保留生图原稿，网页优先使用同名 WebP；本轮图像体积从约 31.8 MB 降至约 3.0 MB。SVG 保留可编辑的平面设计研究。所有应用效果图均属于 AI 辅助概念，不代表实物打样。

生图提示词保存在 `IMAGE-PROMPTS-v7.md` 和 `IMAGE-PROMPTS-full.md`。

## 本地预览和发布
运行 `npm run dev` 预览；`npm run build` 构建。
发布沿用 `.openai/hosting.json` 中的项目，通过 Sites source helper 提交源代码、保存版本并部署。不要把任何访问凭证写入项目。


## 独立平面研究与品牌识别展开（第九版）

新增 `/study/tidal`、`/study/field`、`/study/afterhours`。九张原创矢量海报保存在 `public/practice/`，可从案例页下载 SVG。它们分别为虚构文化计划、植物观察刊物、独立音乐主题，不是真实活动、出版或发行项目。

`src/components/BrandPractice.jsx` 中的 `studies` 维护各独立研究文案，`definitions` 维护三个品牌的字标、图形、配色比例和应用规则。识别板支持网格切换以及包装、卡片、海报三种平面应用。原有三个品牌的重复基础规范段落已移除。新应用展示为网页中的平面设计编排，不是实际生产打样。
