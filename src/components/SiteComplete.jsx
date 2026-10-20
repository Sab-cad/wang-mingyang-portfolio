import { IdentityStudy } from './BrandPractice.jsx'
import { useState } from 'react'

export function BriefForm({ email = '' }) {
  const [status, setStatus] = useState('')
  const save = event => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const text = ['品牌视觉合作需求单', '————————————', `称呼：${values.get('name')}`, `项目或品牌：${values.get('brand')}`, `服务方向：${values.get('service')}`, `期望时间：${values.get('timing')}`, `项目目标：\n${values.get('message')}`, '', '此文件由访客在本机生成，未通过网站发送。'].join('\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = '品牌视觉-合作需求单.txt'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setStatus('需求单已生成，可在浏览器下载中保存。内容未通过网站发送。')
  }
  return <form className="brief-form" onSubmit={save}>
    <div className="brief-intro"><span>PROJECT BRIEF</span><h3>先把想法，整理清楚。</h3><p>填写项目方向并下载需求单，方便后续沟通。表单仅在本机生成文件，不会提交或上传。</p></div>
    <div className="brief-fields"><label>如何称呼你<input name="name" required maxLength={80} autoComplete="name" placeholder="姓名或昵称" /></label><label>项目或品牌<input name="brand" required maxLength={100} placeholder="项目名称" /></label><label>需要的方向<select name="service"><option>完整品牌视觉系统</option><option>产品与包装视觉</option><option>艺术指导与系列海报</option><option>数字页面与视觉表达</option></select></label><label>期望时间<select name="timing"><option>先讨论方向</option><option>一个月内启动</option><option>一至三个月内</option><option>长期合作规划</option></select></label><label className="brief-wide">项目目标<textarea name="message" required maxLength={3000} rows={4} placeholder="希望解决什么问题？有哪些应用场景或交付内容？" /></label></div>
    <div className="brief-actions"><button type="submit">下载合作需求单 ↗</button>{email && <a href={'mailto:' + email}>通过邮件联系 ↗</a>}<span>你的填写内容不会离开当前浏览器。</span></div><p className="brief-status" role="status">{status}</p>
  </form>
}

export function DigitalPanel({ project, standalone = false }) {
  const [mode, setMode] = useState('home')
  const [mobile, setMobile] = useState(false)
  const [scene, setScene] = useState(0)
  const detail = project.preview || project.premium
  const images = [project.image, detail.print, detail.gallery]
  return <section className={'digital-panel digital-' + project.id} aria-label={project.title + '数字视觉演示'}>
    <div className="digital-tools"><div><span>DIGITAL EXPRESSION / 可交互视觉演示</span><p>切换页面内容，查看品牌在屏幕上的表达。</p></div><div className="digital-device" role="group" aria-label="演示布局"><button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)}>桌面</button><button type="button" aria-pressed={mobile} onClick={() => setMobile(true)}>手机</button></div></div>
    <div className={'digital-stage ' + (mobile ? 'is-phone' : '')}>
      <div className="digital-site"><header><b>{project.title}</b><nav aria-label={project.title + '演示导航'}><button aria-pressed={mode === 'home'} onClick={() => setMode('home')}>品牌首页</button><button aria-pressed={mode === 'story'} onClick={() => setMode('story')}>产品故事</button></nav></header>
        <div className="digital-scene"><div className="digital-copy"><span>{mode === 'home' ? 'A NEW PERSPECTIVE' : 'BEHIND THE DESIGN'}</span><h3>{mode === 'home' ? project.digital.headline : project.system.tagline}</h3><p>{mode === 'home' ? project.digital.subline : project.system.idea}</p><button onClick={() => { setMode(mode === 'home' ? 'story' : 'home'); setScene(mode === 'home' ? 1 : 0) }}>{mode === 'home' ? '发现设计故事' : '返回品牌首页'} ↗</button></div><figure><img src={images[scene]} alt={project.title + ['品牌家族','材质细节','空间应用'][scene]} loading="lazy" /><figcaption><span>0{scene + 1} / VISUAL STUDY</span><div role="group" aria-label="切换展示图">{['家族','细节','场景'].map((name,index) => <button key={name} onClick={() => setScene(index)} aria-pressed={scene === index}>{name}</button>)}</div></figcaption></figure></div>
        <footer><span>IDENTITY / IMAGE / EXPERIENCE</span><span>CONCEPT ONLY · 非交易网站</span></footer>
      </div>
    </div>
    {!standalone && <a className="digital-open" href={'/digital/' + project.id}>独立打开数字页面演示 ↗</a>}
  </section>
}

export function DigitalPage({ project }) {
  if (!project) return <SiteNotFound />
  return <main className="digital-page shell"><header className="capability-detail-nav"><a href={'/project/' + project.id}>← 返回品牌案例</a><span>DIGITAL EXPRESSION</span><a href="/capability/ecommerce">全部数字作品 ↗</a></header><div className="digital-page-intro"><span>INTERACTIVE DESIGN STUDY</span><h1>{project.title}</h1><p>品牌首页、产品故事与响应式构图的交互演示。</p></div><DigitalPanel project={project} standalone /></main>
}

export function CompleteCase({ project, next, Viewer }) {
  const c = project.complete
  return <div className={'complete-case case-' + c.theme}>
    <header className="capability-detail-nav"><a href="/#work">← 返回作品集</a><span>BRAND STUDY / {project.id}</span><a href="/#contact">合作需求 ↗</a></header>
    <main>
      <section className="complete-opening shell"><div className="complete-kicker"><span>SELECTED PROJECT / {project.id}</span><span>SELF-INITIATED · 2026</span></div><h1>{project.title}</h1><div className="complete-lead"><p>{c.tagline}</p><span>品牌识别 · 包装概念 · 艺术指导 · 数字表达</span></div><nav className="case-sections" aria-label="案例目录"><a href="#case-strategy">01 设计逻辑</a><a href="#case-material">02 材质细节</a><a href="#brand-system">03 识别与应用</a><a href="#case-digital">04 数字体验</a></nav></section>
      <figure className="complete-hero"><img src={project.image} fetchPriority="high" width="1536" height="1024" alt={project.title + '品牌包装家族概念效果'} /><figcaption>BRAND FAMILY / AI 辅助概念效果 · 未实物打样</figcaption></figure>
      <section className="complete-story shell" id="case-strategy"><span>01 / DESIGN INTENT</span><h2>{c.idea}</h2><div><p>{c.body}</p><small>{c.keywords}</small></div></section>
      <section className="complete-material shell" id="case-material"><div className="complete-material-heading"><span>02 / MATERIAL &amp; DETAIL</span><h2>{c.detailTitle}</h2><p>{c.detailBody}</p></div><div className="complete-pair"><figure><img loading="lazy" src={c.detail} alt={project.title + '包装印刷与材质概念特写'} /><figcaption>01 / 纸品与材质关系</figcaption></figure><figure><img loading="lazy" src={c.original} alt={project.title + '原始产品造型视觉研究'} /><figcaption>02 / 产品形态与光线研究</figcaption></figure></div></section>
      <IdentityStudy project={project} /><section className="complete-space shell"><div><span>04 / IN CONTEXT</span><h2>{c.spaceTitle}</h2><p>{c.spaceBody}</p></div><figure><img loading="lazy" width="1536" height="1024" src={c.space} alt={project.title + '品牌海报空间应用概念'} /><figcaption>POSTER SERIES / 空间应用概念效果</figcaption></figure></section>
      <section className="complete-digital shell" id="case-digital"><DigitalPanel project={project} /></section>
      <section className="complete-support shell"><p>本项目为虚构品牌的自主概念研究。包装、产品、纸品与空间图为 AI 辅助效果图；设计规范与页面为视觉探索，不代表实际生产、客户委托或商业投放。</p></section>
      <nav className="case-next shell complete-next" aria-label="浏览其他案例"><a className="case-back" href="/#work">← 全部作品</a><a className="case-next-link" href={'/project/' + next.id}><img loading="lazy" src={next.image} alt=""/><span><small>NEXT PROJECT</small><b>{next.title}</b></span><span>↗</span></a></nav>
    </main>
  </div>
}

export function SiteNotFound() {
  return <main className="site-not-found"><span>404 / PAGE NOT FOUND</span><h1>这个页面暂时不在展览中。</h1><p>可以从精选案例继续浏览。</p><a href="/#work">返回作品集 ↗</a></main>
}
