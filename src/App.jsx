import { useState } from 'react'
import content from '../data/content.json'

const Arrow = () => <span aria-hidden="true">↗</span>
function Header() {
  return <header className="nav wrap"><a className="wordmark" href="/"><span className="mark">✳</span> 造物练习<span className="wordmark-en">VISUAL NOTES</span></a><nav aria-label="主导航"><a href="/#work">作品</a><a href="/#approach">方法</a><a href="/#about">关于</a></nav><a className="nav-cta" href="/#contact">聊聊想法 <Arrow /></a></header>
}
function Footer() {
  return <footer className="wrap footer"><span>造物练习 / VISUAL NOTES</span><span>2026 · 独立概念创作 · AI 辅助视觉</span><a href="#top">回到顶部 ↑</a></footer>
}
function Case({project}) {
  return <><Header /><main id="top" className="wrap case">
    <a className="back" href="/#work">← 返回全部作品</a>
    <div className="case-heading"><div><p className="eyebrow">CONCEPT STUDY / {project.id}</p><h1>{project.title}</h1><p>{project.subtitle}</p></div><span className="pill">原创概念 · 非商业委托</span></div>
    <div className={'case-art '+project.slug}><img src={project.image} alt={project.alt}/><span className="art-caption">{project.en} / VISUAL STUDY</span></div>
    <div className="case-summary"><h2>从一个具体问题，<br/>开始设计。</h2><div><p>{project.background}</p><div className="metadata"><div><small>项目性质</small><b>虚构产品视觉概念</b></div><div><small>制作方式</small><b>创意策划 / AI 辅助生成 / 网页编排</b></div><div><small>研究方向</small><b>{project.type}</b></div></div></div></div>
    <div className="case-sections">{project.decisions.map((x,i)=><section key={x.title}><span className="step">0{i+1}</span><h3>{x.title}</h3><p>{x.text}</p></section>)}</div>
    <section className="palette-panel"><div><p className="eyebrow">COLOUR & MATERIAL</p><h2>让颜色成为记忆。</h2><p>{project.material}</p></div><div className="swatches">{project.colors.map(c=><div key={c} style={{background:c}}><span>{c}</span></div>)}</div></section>
    <div className="case-note"><span>创作说明</span><p>本项目为本次作品集新创作的概念研究，图片由 AI 辅助生成，产品与品牌设想均为虚构。未实际建模、打样或投放，不包含真实客户背书、产品功效与销售数据。</p></div>
    <a className="large-link" href="/#work">继续探索作品 <Arrow /></a>
  </main><Footer /></>
}
function Home() {
  const [filter,setFilter] = useState('全部')
  const [contactOpen,setContactOpen] = useState(false)
  const visible = filter === '全部' ? content.projects : content.projects.filter(x=>x.category===filter)
  return <><Header /><main id="top">
    <section className="hero wrap">
      <div className="hero-copy"><p className="eyebrow"><i/> INDEPENDENT VISUAL EXPLORATIONS / 2026</p><h1>把日常，<br/>做得<span className="serif">不寻常。</span></h1><p className="hero-intro">从产品的一个细节出发，<br/>探索有记忆点的视觉表达。</p><a className="round-link" href="#work"><span>探索作品</span><span className="circle">↘</span></a><div className="hero-bottom"><span>产品视觉 · 电商创意 · AI 探索</span><span>SCROLL TO EXPLORE ↓</span></div></div>
      <a className="hero-visual" href="/project/01"><img src={content.projects[0].image} alt={content.projects[0].alt}/><div className="hero-sticker">LESS,<br/><em>BUT BETTER.</em></div><div className="hero-label"><span>01 / 日常留白<br/><small>SKINCARE VISUAL CONCEPT</small></span><span className="circle light"><Arrow/></span></div></a>
    </section>
    <div className="manifesto-strip"><span>观察日常</span><i>✳</i><span>重构表达</span><i>✳</i><span>让想法可见</span><i>✳</i><span>MAKE THE ORDINARY DISTINCTIVE</span></div>
    <section className="work wrap section" id="work"><div className="section-top"><div><p className="eyebrow">SELECTED EXPLORATIONS</p><h2>三个想法，<span>三种表达。</span></h2></div><p>全新概念创作，持续更新。<br/>这里展示设计思路，不虚构商业成果。</p></div>
      <div className="filters" aria-label="作品筛选">{['全部','产品视觉','品牌概念'].map(t=><button key={t} aria-pressed={filter===t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}{t==='全部'&&<sup>03</sup>}</button>)}<span>2026 — CONCEPT SERIES</span></div>
      <div className="project-grid">{visible.map((p,i)=><a className={'project-card '+p.slug} key={p.id} href={'/project/'+p.id}><div className="project-image"><img loading="lazy" src={p.image} alt={p.alt}/><span className="project-badge">概念研究 / {p.id}</span><span className="project-arrow"><Arrow/></span></div><div className="project-meta"><div><small>{p.en} / {p.category}</small><h3>{p.title}</h3></div><p>{p.short}</p></div></a>)}</div>
    </section>
    <section className="approach" id="approach"><div className="wrap"><div className="section-top"><div><p className="eyebrow">THE WAY OF MAKING</p><h2>画面之前，<br/>先有判断。</h2></div><p>AI 拓宽探索的边界。<br/>清晰的目标、取舍与细节，让想法成形。</p></div><div className="process">{[['观察','从产品和使用情境出发，找到最值得表达的一个特点。'],['定义','选择一种情绪、一组色彩与一个视觉焦点，减少无关信息。'],['探索','用 AI 辅助尝试材质、光线和构图，比较方向，而非堆叠效果。'],['整理','把画面、文字与展示逻辑统一，形成可以被理解的作品。']].map(([t,d],i)=><article key={t}><span>0{i+1} /</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
    <section className="about wrap section" id="about"><div className="about-art" aria-hidden="true"><div className="orbit one"/><div className="orbit two"/><div className="orbit three"/><span>从 0 到 1，<br/><em>保持好奇。</em></span><small>A WORK IN PROGRESS ↗</small></div><div className="about-copy"><p className="eyebrow">ABOUT THIS SPACE</p><h2>这是一本<br/>持续生长的视觉笔记。</h2><p>“造物练习”是这版作品集的暂定栏目名。我们从产品、色彩与材质出发，将新的想法整理成看得见的视觉研究。</p><p>这里先呈现概念创作。后续加入真实项目时，会清楚记录项目背景、本人职责和实际交付。</p><div className="tags"><span>产品视觉</span><span>电商内容</span><span>创意方向</span><span>AI 辅助探索</span></div></div></section>
    <section className="contact wrap" id="contact"><p className="eyebrow">NEXT, SOMETHING NEW.</p><div><h2>下一个想法，<br/>从这里开始。</h2><button className="contact-button" aria-expanded={contactOpen} onClick={()=>setContactOpen(!contactOpen)}>{contactOpen?'收起说明':'联系与合作'} <Arrow/></button></div>{contactOpen&&<p className="contact-message" role="status">联系方式整理中，暂未开放合作咨询。正式上线个人信息后，这里将显示邮箱或微信。</p>}<p className="contact-footnote">独立创作进行中 / 真实个人资料待补充</p></section>
  </main><Footer /></>
}
export default function App(){
 const match=location.pathname.match(/^\/project\/([^/]+)\/?$/)
 if(match){const p=content.projects.find(x=>x.id===match[1]);return p?<Case project={p}/>:<><Header/><main className="wrap case"><h1>这个作品还在路上。</h1><a href="/#work">返回作品列表 ↗</a></main></>}
 return <Home/>
}
