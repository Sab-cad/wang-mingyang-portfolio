import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Atom,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Brain,
  Cube,
  EnvelopeSimple,
  ImageSquare,
  MapPin,
  PaperPlaneTilt,
  Phone,
  QrCode,
  Sparkle,
  Strategy,
} from '@phosphor-icons/react'
import defaultContent from '../data/content.json'

import FlipCard from './components/FlipCard.jsx'
import TechText from './components/TechText.jsx'
import CircularCarousel from './components/CircularCarousel.jsx'

gsap.registerPlugin(ScrollTrigger)

const capabilityIcons = { strategy: Strategy, brain: Brain, cube: Cube, image: ImageSquare }

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="返回首页">
      <Atom aria-hidden="true" size={17} weight="bold" />
      <b>PORTFOLIO</b>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('top')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = ['top', 'experience', 'work', 'capabilities', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
      if (visible.length) setActive(visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id)
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.12, 0.3] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const dismiss = event => { if (event.key === 'Escape') { setOpen(false); document.querySelector('.menu-button')?.focus() } }
    window.addEventListener('keydown', dismiss)
    return () => window.removeEventListener('keydown', dismiss)
  }, [open])
  const close = () => setOpen(false)
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className={`nav-home ${active === 'top' ? 'is-active' : ''}`} href="#top" onClick={close} aria-current={active === 'top' ? 'location' : undefined}>首页</a>
      <nav id="main-navigation" className={open ? 'is-open' : ''} aria-label="主导航">
        <a className={active === 'experience' ? 'is-active' : ''} href="#experience" onClick={close} aria-current={active === 'experience' ? 'location' : undefined}>关于我</a>
        <a className={active === 'work' ? 'is-active' : ''} href="#work" onClick={close} aria-current={active === 'work' ? 'location' : undefined}>精选作品</a>
        <a className={active === 'capabilities' ? 'is-active' : ''} href="#capabilities" onClick={close} aria-current={active === 'capabilities' ? 'location' : undefined}>核心能力</a>
        <a className={active === 'contact' ? 'is-active' : ''} href="#contact" onClick={close} aria-current={active === 'contact' ? 'location' : undefined}>联系我</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "关闭导航" : "打开导航"} aria-controls="main-navigation" aria-expanded={open}><span /><span /></button>
    </header>
  )
}

function OpeningSequence({ name }) {
  return (
    <div className="opening-screen" aria-hidden="true">
      <div className="opening-meta"><span>BRAND / VISUAL DESIGN</span><span>PERSONAL PORTFOLIO</span></div>
      <div className="opening-center">
        <div className="opening-kicker"><span>WELCOME TO THE SELECTED WORKS OF</span></div>
        <div className="opening-brand"><span>{name}</span></div>
        <div className="opening-rule" />
      </div>
      <div className="opening-count"><span>01</span><i>/</i><span>26</span></div>
    </div>
  )
}

function HeroProjectRail({ features }) {
  const railRef = useRef(null)
  const [fillCopies, setFillCopies] = useState(1)

  useLayoutEffect(() => {
    const rail = railRef.current
    if (!rail || !features.length) return undefined
    const calculateCopies = () => {
      const card = rail.querySelector('.rail-card')
      if (!card) return
      const gap = Number.parseFloat(getComputedStyle(rail).getPropertyValue('--rail-gap')) || 12
      const stride = card.getBoundingClientRect().width + gap
      const minimumItems = Math.max(1, Math.ceil((rail.clientWidth + stride) / stride))
      setFillCopies(Math.max(1, Math.ceil(minimumItems / features.length)))
    }
    calculateCopies()
    const observer = new ResizeObserver(calculateCopies)
    observer.observe(rail)
    return () => observer.disconnect()
  }, [features.length])

  const loopFeatures = Array.from({ length: fillCopies }, (_, groupIndex) => (
    features.map((feature, index) => ({ feature, index, groupIndex }))
  )).flat()
  const duration = Math.max(24, loopFeatures.length * 4.6)

  return (
    <div className="hero-rail-wrap">
      <div className="hero-rail-shell">
        <div className="hero-rail" ref={railRef} aria-label={`${features.length} 张图片自动无缝循环`}>
          <div className="hero-rail-track" style={{ '--rail-duration': `${duration}s` }}>
            {[0, 1].map((copy) => (
              <div className="hero-rail-set" aria-hidden="true" key={copy}>
                {loopFeatures.map(({ feature, index, groupIndex }) => (
                  <div className="rail-card" key={`${copy}-${groupIndex}-${feature.id || index}`}>
                    <img src={feature.image} style={{ objectPosition: feature.position || 'center' }} alt={feature.alt || ''} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero({ profileData, mediaData, features }) {
  const nameParts = profileData.nameEn.trim().split(/\s+/)
  const firstName = nameParts.shift() || 'YOUR'
  const lastName = nameParts.join(' ') || ''

  return (
    <section className="hero" id="top">
      <img className="hero-background" src={mediaData.hero} alt="云海上的创意空间" />
      <div className="hero-shade" />
      <div className="hero-copy shell reveal">
        <div className="hero-editorial-meta"><span>INDEPENDENT DESIGN PRACTICE</span><span>SELECTED / 2026</span></div>
        <h1 className="hero-tech-title brand-title" aria-label="Brand Visual — Portfolio">
          <span>BRAND</span><span className="brand-serif">VISUAL.</span><b>PORTFOLIO — 品牌视觉作品集</b>
        </h1>
        <p>{profileData.heroRole}</p>
        <div className="hero-statement">以清晰的识别，<br/>留下长久的印象。</div>
        <a className="hero-link" href="#work"><span>查看作品</span><i><ArrowRight weight="bold" /></i></a>
      </div>
      <HeroProjectRail features={features} />
    </section>
  )
}

function AnimatedNumber({ value }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const match = String(value).match(/^(.*?)(\d+(?:\.\d+)?)(.*)$/)
    if (!match) {
      setDisplay(value)
      return undefined
    }
    const [, prefix, number, suffix] = match
    const target = Number(number)
    const decimals = number.includes('.') ? number.split('.')[1].length : 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const start = () => {
      if (reduce) {
        setDisplay(value)
        return
      }
      const startedAt = performance.now()
      const tick = (now) => {
        const progress = Math.min(1, (now - startedAt) / 1450)
        const eased = 1 - Math.pow(1 - progress, 4)
        setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`)
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      start()
    }, { threshold: 0.65 })
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return <strong ref={ref} aria-label={String(value)}>{display}</strong>
}

function SectionTitle({ eyebrow, title, description, number, action }) {
  return (
    <div className="section-heading reveal">
      <div className="section-heading-copy"><span>{eyebrow}</span><h2><i>{title}</i></h2>{description && <p>{description}</p>}</div>
      {action ? <a href={action.href}>{action.label} <ArrowUpRight weight="bold" /></a> : <span className="section-number">/{number}</span>}
    </div>
  )
}

function Experience({ profileData, mediaData, experienceData }) {
  return (
    <section className="experience section" id="experience">
      <div className="shell">
        <SectionTitle eyebrow="ABOUT / EXPERIENCE" title="DESIGN PERSPECTIVE" description="从视觉设计到 AI 创意实践，用系统化思考建立清晰、独特且能够持续生长的品牌表达。" number="01" />
        <div className="profile-grid">
          <div className="profile-image reveal">
            <FlipCard
              width={430}
              height={525}
              radius={28}
              perspective={1100}
              tiltMax={10}
              glareOpacity={0.18}
              hoverScale={1.018}
              ariaLabel="点击或拖动查看设计师信息"
              className="profile-flip-card"
              front={<img src={mediaData.portrait} alt={`${profileData.nameEn} 的字标与色彩研究`} />}
              back={<div className="profile-card-back"><span>CREATIVE PROFILE</span><h4>{profileData.nameEn}</h4><p>{profileData.role}</p><div><i>{profileData.services}</i><i>{profileData.location}</i></div><small>点击或拖动返回</small></div>}
            />
            <span className="profile-flip-hint">点击 / 拖动翻转</span>
          </div>
          <div className="profile-content reveal">
            <span className="micro-title">ABOUT ME</span>
            <h3>让品牌，<br/><em>拥有自己的表达。</em></h3>
            <p className="profile-intro">{profileData.intro}</p>
            <div className="profile-info">
              <div><span>当前身份</span><b>{profileData.role}</b></div><div><span>服务方向</span><b>{profileData.services}</b></div>
              <div><span>创作状态</span><b>{profileData.location}</b></div><div><span>项目性质</span><b>自主概念 / 非商业委托</b></div>
            </div>
            <div className="profile-stats">
              <div><AnimatedNumber value={profileData.stats.experience} /><span>留下独特记忆</span></div><div><AnimatedNumber value={profileData.stats.projects} /><span>建立视觉系统</span></div><div><AnimatedNumber value={profileData.stats.brands} /><span>传递品牌气质</span></div>
            </div>
            <div className="now-building"><span>NOW BUILDING</span><div><i>品牌视觉系统</i><i>AIGC 视觉工作流</i><i>电商内容体系</i><i>数字视觉表达</i></div></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Career({ experienceData }) {
  return (
    <section className="career-section section" id="career">
      <div className="shell">
        <div className="career-path reveal">
          <div className="career-label"><span>DESIGN PROCESS</span><b>从理解到表达</b></div>
          <div className="career-line" />
          <div className="career-grid">
            {experienceData.map((item) => (
              <article key={item.date}>
                <Sparkle className="career-spark" weight="fill" />
                <time>{item.date}</time>
                <div className="career-content"><h4>{item.company}</h4><span>{item.role}</span><p>{item.note}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Work({ projectData, email }) {
  return (
    <section className="work section" id="work">
      <div className="shell">
        <SectionTitle eyebrow="SELECTED PROJECTS" title="SELECTED WORK" description="三组自主概念研究，从产品主视觉延展到字标、色彩与数字呈现。" number="03" action={{ label: '了解设计方向', href: '#capabilities' }} />
        <div className="project-index reveal" aria-label="精选作品概览">
          <span><b>{String(projectData.length).padStart(2, '0')}</b> 个精选案例</span>
          <span>品牌识别 / 艺术指导 / 产品视觉</span>
          <span>点击查看项目详情 <ImageSquare weight="bold" /></span>
        </div>
        <div className="project-list">
          {projectData.map((project, index) => (
            <article className={`project project-${index + 1} reveal`} key={project.id}>
              <a className="project-entry" href={`/project/${project.id}`}>
                <div className="project-image"><img loading="lazy" decoding="async" src={project.image} alt={`${project.title} 项目概念视觉`} /><span className="project-open" aria-hidden="true"><ImageSquare weight="bold" /></span><span className="project-id">{project.id}</span></div>
                {project.premium && <div className="project-preview-strip" aria-hidden="true"><img loading="lazy" src={project.premium.print} alt="" /><span>FEATURED CASE<br /><b>从产品到完整品牌体验</b></span><img loading="lazy" src={project.premium.gallery} alt="" /></div>}<div className="project-copy"><div><span>{project.type}</span><h3>{project.title}</h3></div><div className="project-side"><p>{project.subtitle}</p><b>查看研究 <ArrowUpRight weight="bold" /></b></div></div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function VisualCarousel({ galleryData }) {
  const items = galleryData.map((item, index) => ({
    src: item.image,
    alt: item.alt || `精选视觉作品 ${index + 1}`,
    title: item.alt || `视觉作品 ${String(index + 1).padStart(2, '0')}`,
    subtitle: 'SELECTED VISUAL ARCHIVE',
  }))

  return (
    <section className="visual-carousel-section section" aria-label="视觉作品环形轮播">
      <div className="shell">
        <SectionTitle eyebrow="VISUAL ARCHIVE" title="VISUAL JOURNAL" description="拖动、点击或使用键盘方向键，从不同角度浏览更多视觉作品与创意片段。" number="04" />
        <div className="visual-carousel-stage reveal">
          <CircularCarousel
            items={items}
            preset="panorama"
            intro="rise"
            cardWidth={280}
            aspectRatio={0.78}
            gap={32}
            speed={16}
            pauseOnHover={true}
            tilt={0}
            perspective={1800}
            fadeColor="#101110"
            cornerRadius={5}
          />
        </div>
      </div>
    </section>
  )
}

function Capabilities({ capabilityData }) {
  return (
    <section className="capabilities section" id="capabilities">
      <div className="shell">
        <SectionTitle eyebrow="WHAT I DO BEST" title="DESIGN DISCIPLINES" description="围绕品牌识别、艺术指导、产品视觉与数字表达，持续探索一致的品牌体验。" number="02" />
        <div className="cap-grid">
          {capabilityData.map((item) => {
            const Icon = capabilityIcons[item.icon] || Strategy
            return (
            <a className="cap-card reveal" href={`/capability/${item.slug}`} key={item.slug}>
              <div className="cap-card-cover"><img src={item.cover} alt="" /></div>
              <div className="cap-card-top"><Icon size={32} weight="duotone" /><span>{item.number}</span></div>
              <div><span>{item.en}</span><h3>{item.title}</h3><p>{item.text}</p></div>
              <span className="cap-cta">查看该方向作品 <ArrowUpRight weight="bold" /></span>
            </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contact({ profileData, mediaData }) {
  const [showNote, setShowNote] = useState(false)
  return <footer className="contact" id="contact">
    <img src={mediaData.contact || mediaData.hero} alt="" aria-hidden="true"/><div className="contact-shade"/>
    <div className="shell contact-inner reveal">
      <div className="contact-kicker"><span>CONTACT / NEXT CHAPTER</span><span>BRAND · VISUAL · DIGITAL</span></div>
      <div className="contact-main">
        <div className="contact-copy"><p>让下一个想法，成为值得记住的品牌。</p><h2>一起创造<span>SOMETHING DISTINCT.</span></h2><span className="contact-note">品牌识别 · 艺术指导 · 产品视觉 · 数字表达</span><button className="brand-contact-button" onClick={()=>setShowNote(!showNote)} aria-expanded={showNote}>联系与合作 <ArrowUpRight/></button>{showNote && <p className="brand-contact-note" role="status">联系方式待补充，暂未开放在线咨询。</p>}</div>
        <div className="contact-details brand-contact-details"><span className="brand-monogram">B/V</span><p>独立视角。<br/>一致表达。</p><small>当前展示为自主概念研究<br/>AI 辅助视觉 / 非商业委托</small></div>
      </div><div className="contact-bottom"><b>BRAND / VISUAL</b><span>SELECTED WORKS — 2026</span><span>SELF-INITIATED CONCEPTS</span><a href="#top">回到顶部 ↑</a></div>
    </div>
  </footer>
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > Math.max(520, window.innerHeight * 0.7))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <button className={`back-to-top${visible ? ' is-visible' : ''}`} type="button" aria-label="返回页面顶部" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}><ArrowUp weight="bold" /><span>TOP</span></button>
}

function Portfolio({ content }) {
  const appRef = useRef(null)
  const { profile, media, social, projects, experience, capabilities, heroGallery } = content
  const heroFeatures = heroGallery?.length
    ? heroGallery
    : [{ id: 'hero-fallback', image: media.hero, alt: '首页视觉' }]

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 760px)').matches
    if (reduceMotion) {
      gsap.set('.opening-screen', { display: 'none' })
      return undefined
    }

    document.body.classList.add('is-opening')
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
    let openingFallback
    let openingTimeline

    const context = gsap.context(() => {
      const opening = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          window.clearTimeout(openingFallback)
          document.body.classList.remove('is-opening')
          gsap.set('.opening-screen', { display: 'none' })
          ScrollTrigger.refresh()
        },
      })
      openingTimeline = opening

      opening
        .from('.opening-meta span', { yPercent: 140, autoAlpha: 0, duration: 0.85, stagger: 0.08 })
        .from('.opening-kicker span', { yPercent: 130, autoAlpha: 0, duration: 0.8 }, 0.18)
        .from('.opening-brand span', { yPercent: 125, scaleY: 0.58, skewY: 4, transformOrigin: '50% 100%', duration: 1.25 }, 0.28)
        .from('.opening-rule', { scaleX: 0, transformOrigin: '0% 50%', duration: 1.05 }, 0.42)
        .from('.opening-count span, .opening-count i', { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.52)
        .to('.opening-screen', { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'power4.inOut' }, 1.75)
        .from('.hero-background', { scale: 1.14, autoAlpha: 0.58, duration: 2.25, ease: 'power3.out' }, 1.82)
        .from('.site-header', { y: -80, autoAlpha: 0, duration: 1.05 }, 2.02)
        .from('.hero-tech-title > span, .hero-tech-title > b', { yPercent: 90, scaleY: 0.72, autoAlpha: 0, transformOrigin: '50% 100%', duration: 1.35, stagger: 0.12 }, 2.04)
        .from('.hero-copy > p', { y: 42, autoAlpha: 0, duration: 0.95 }, 2.52)
        .from('.hero-link', { y: 48, autoAlpha: 0, scaleX: 0.82, transformOrigin: '0% 50%', duration: 1.05 }, 2.62)
        .from('.hero-rail-shell', { y: 105, autoAlpha: 0, scale: 0.94, duration: 1.25 }, 2.58)

      opening.timeScale(isMobile ? 1.85 : 1.6)

      gsap.to('.hero-background', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.4 },
      })
      gsap.to('.hero-copy', {
        yPercent: -12,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: 1.2 },
      })

      gsap.utils.toArray('.section-heading').forEach((heading) => {
        const title = heading.querySelector('h2 i')
        const eyebrow = heading.querySelector('div > span')
        const description = heading.querySelector('.section-heading-copy > p')
        const side = heading.querySelector(':scope > span, :scope > a')
        const timeline = gsap.timeline({
          scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
        })
        timeline
          .from(title, { yPercent: 55, scaleY: 1, skewY: 0, transformOrigin: '50% 100%', duration: isMobile ? 0.88 : 1.35, ease: 'power4.out' })
          .from(eyebrow, { x: isMobile ? -26 : -46, autoAlpha: 0, duration: isMobile ? 0.55 : 0.8, ease: 'power3.out' }, 0.18)
          .from(description, { y: isMobile ? 18 : 28, autoAlpha: 0, duration: isMobile ? 0.58 : 0.82, ease: 'power3.out' }, 0.28)
          .from(side, { x: isMobile ? 26 : 46, autoAlpha: 0, duration: isMobile ? 0.58 : 0.9, ease: 'power3.out' }, 0.25)
          .from(heading, { '--heading-line': '0%', duration: isMobile ? 0.72 : 1.1, ease: 'power3.inOut' }, 0.22)
      })

      const profileTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.profile-grid', start: 'top 76%', once: true },
      })
      profileTimeline
        .from('.profile-image', { clipPath: 'inset(0 0 100% 0)', y: isMobile ? 48 : 80, duration: isMobile ? 0.9 : 1.4, ease: 'power4.inOut' })
        .from('.profile-image img', { scale: 1.18, duration: isMobile ? 1.05 : 1.75, ease: 'power3.out' }, 0.15)
        .from('.profile-content > *', { y: isMobile ? 44 : 72, autoAlpha: 0, duration: isMobile ? 0.72 : 1.05, stagger: isMobile ? 0.07 : 0.11, ease: 'power3.out' }, 0.28)

      const careerTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.career-path', start: 'top 80%', once: true },
      })
      careerTimeline
        .from('.career-label > *', { y: isMobile ? 28 : 45, autoAlpha: 0, duration: isMobile ? 0.6 : 0.9, stagger: 0.1, ease: 'power3.out' })
        .from('.career-grid', { '--timeline-progress': 0, duration: isMobile ? 0.95 : 1.45, ease: 'power3.inOut' }, 0.18)
        .from('.career-grid article', { x: isMobile ? 32 : 90, y: isMobile ? 24 : 34, autoAlpha: 0, duration: isMobile ? 0.72 : 1.08, stagger: isMobile ? 0.13 : 0.2, ease: 'power3.out' }, 0.3)

      ScrollTrigger.batch('.project', {
        start: 'top 84%',
        once: true,
        onEnter: (batch) => gsap.from(batch, { y: isMobile ? 70 : 130, autoAlpha: 0, scale: 0.955, duration: isMobile ? 0.82 : 1.25, stagger: isMobile ? 0.12 : 0.2, ease: 'power4.out' }),
      })
      gsap.from('.project-index > span', {
        y: isMobile ? 18 : 26,
        autoAlpha: 0,
        duration: isMobile ? 0.58 : 0.82,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.project-index', start: 'top 86%', once: true },
      })
      gsap.utils.toArray('.project-image').forEach((frame) => {
        const image = frame.querySelector('img')
        gsap.from(frame, {
          clipPath: 'inset(0 0 100% 0)',
          duration: isMobile ? 0.9 : 1.45,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: frame, start: 'top 84%', once: true },
        })
        gsap.from(image, {
          scale: 1.14,
          duration: isMobile ? 1.05 : 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: frame, start: 'top 84%', once: true },
        })
      })

      gsap.timeline({
        scrollTrigger: { trigger: '.cap-grid', start: 'top 84%', once: true },
      }).fromTo('.cap-card', {
        y: isMobile ? 70 : 120,
        autoAlpha: 0,
        rotateX: isMobile ? 0 : -12,
        transformOrigin: '50% 100%',
      }, {
        y: 0,
        autoAlpha: 1,
        rotateX: 0,
        duration: isMobile ? 0.86 : 1.2,
        stagger: isMobile ? 0.11 : 0.16,
        ease: 'power4.out',
        clearProps: 'transform,opacity,visibility',
      })

      const contactTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.contact', start: 'top 72%', once: true },
      })
      contactTimeline
        .from('.contact-kicker', { y: isMobile ? 26 : 40, autoAlpha: 0, duration: isMobile ? 0.6 : 0.9, ease: 'power3.out' })
        .from('.contact-copy > p', { y: isMobile ? 28 : 45, autoAlpha: 0, duration: isMobile ? 0.55 : 0.8, ease: 'power3.out' }, 0.2)
        .from('.contact-copy h2', { clipPath: 'inset(0 0 100% 0)', y: isMobile ? 58 : 95, scaleY: 0.72, transformOrigin: '50% 100%', duration: isMobile ? 0.92 : 1.45, ease: 'power4.inOut' }, 0.28)
        .from('.brand-contact-button', { y: isMobile ? 28 : 45, autoAlpha: 0, duration: isMobile ? 0.6 : 0.9, ease: 'power3.out' }, 0.62)
        .from('.brand-contact-details > *', { x: isMobile ? 24 : 46, autoAlpha: 0, duration: isMobile ? 0.55 : 0.8, stagger: 0.08, ease: 'power3.out' }, 0.52)
        .from('.contact-bottom > *', { y: isMobile ? 25 : 42, autoAlpha: 0, duration: isMobile ? 0.58 : 0.85, stagger: isMobile ? 0.07 : 0.1, ease: 'power3.out' }, 0.7)

      if (window.innerWidth > 760) {
        gsap.utils.toArray('.profile-image img, .project-image > img, .contact > img').forEach((image) => {
          gsap.fromTo(image, { yPercent: -4 }, {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
          })
        })
      }
    }, appRef)

    openingFallback = window.setTimeout(() => {
      openingTimeline?.progress(1)
      openingTimeline?.kill()
      document.body.classList.remove('is-opening')
      gsap.set('.opening-screen', { display: 'none' })
      ScrollTrigger.refresh()
    }, 3400)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(openingFallback)
      document.body.classList.remove('is-opening')
      context.revert()
    }
  }, [])

  return <div ref={appRef}><OpeningSequence name={profile.nameEn} /><Header /><main><Hero profileData={profile} mediaData={media} features={heroFeatures} /><Experience profileData={profile} mediaData={media} experienceData={experience} /><Capabilities capabilityData={capabilities || []} /><Career experienceData={experience} /><Work projectData={projects} email={profile.email} /><VisualCarousel galleryData={heroFeatures} /></main><Contact profileData={profile} mediaData={media} /><BackToTop /></div>
}

function isVideoAsset(source = '') {
  return /\.(mp4|webm)(?:$|\?)/i.test(source)
}

function CapabilityMedia({ source, title }) {
  if (isVideoAsset(source)) {
    return <video src={source} aria-label={title} autoPlay muted loop playsInline preload="metadata" />
  }
  return <img src={source} alt={title} />
}

function CapabilityPage({ content, slug }) {
  const pageRef = useRef(null)
  const capability = content.capabilities?.find((item) => item.slug === slug)

  useLayoutEffect(() => {
    if (!capability) return undefined
    window.scrollTo(0, 0)
    document.title = `${capability.title} — ${content.profile.nameEn}`
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.capability-detail-nav', { y: -40, autoAlpha: 0, duration: 0.9 })
        .from('.capability-detail-kicker', { y: 30, autoAlpha: 0, duration: 0.8 }, 0.15)
        .from('.capability-detail-title span', { yPercent: 115, scaleY: 0.68, duration: 1.15 }, 0.22)
        .from('.capability-detail-intro', { y: 32, autoAlpha: 0, duration: 0.8 }, 0.48)
        .from('.capability-board-meta', { y: 28, autoAlpha: 0, duration: 0.8 }, 0.52)
        .from('.capability-work-card', { y: 70, autoAlpha: 0, clipPath: 'inset(0 0 18% 0)', duration: 1, stagger: 0.13 }, 0.65)
        .from('.capability-board-footer', { y: 20, autoAlpha: 0, duration: 0.7 }, 0.9)
    }, pageRef)
    return () => {
      context.revert()
      document.title = `${content.profile.nameEn} — 个人作品集`
    }
  }, [capability, content.profile.nameEn])

  if (!capability) {
    return <main className="capability-not-found"><span>404</span><h1>没有找到这个作品分类</h1><a href="/#capabilities"><ArrowLeft /> 返回首页</a></main>
  }

  return (
    <div className="capability-detail" ref={pageRef}>
      <header className="capability-detail-nav">
        <a href="/#capabilities"><ArrowLeft weight="bold" /> 返回首页</a>
        <span>{content.profile.nameEn.toUpperCase()} / SELECTED WORKS</span>
        <a href="/#contact">联系我 <ArrowUpRight weight="bold" /></a>
      </header>
      <main className="capability-detail-main">
        <section className="capability-detail-board" id="capability-works">
          <div className="capability-board-head">
            <div className="capability-detail-copy">
            <div className="capability-detail-kicker"><span>{capability.number}</span><b>{capability.en}</b></div>
            <h1 className="capability-detail-title"><span>{capability.title}</span></h1>
            <p className="capability-detail-intro">{capability.text}</p>
            </div>
            <div className="capability-board-meta"><span>SELECTED WORKS</span><b>{String(capability.works.length).padStart(2, '0')}</b><p>ALL WORKS / ONE PAGE</p></div>
          </div>
          {capability.works.length ? (
            <div className={`capability-work-grid layout-${capability.layout || 'commerce-render'}`}>
              {capability.works.map((work, index) => (
                <article className="capability-work-card" key={work.id || index}>
                  <div><CapabilityMedia source={work.image} title={work.title} /><span>{String(index + 1).padStart(2, '0')}</span></div>
                  <h3>{work.title}</h3><p>{work.description}</p><a className="capability-case-link" href={"/project/" + work.id}>查看完整品牌案例 <ArrowUpRight /></a>
                </article>
              ))}
            </div>
          ) : <div className="capability-empty">作品正在整理中</div>}
          <footer className="capability-board-footer"><span>{content.profile.nameEn.toUpperCase()} / PORTFOLIO</span><a href="/#contact">发起合作 <ArrowUpRight weight="bold" /></a></footer>
        </section>
      </main>
    </div>
  )
}

function ArtworkViewer({ boards, title }) {
  const dialogRef = useRef(null)
  const [selected, setSelected] = useState(0)
  const triggerRef = useRef(null)
  const open = (index, event) => {
    triggerRef.current = event.currentTarget
    setSelected(index)
    dialogRef.current.showModal()
  }
  const close = () => dialogRef.current.close()
  useEffect(() => {
    const dialog = dialogRef.current
    const restore = () => { document.body.style.overflow = ''; triggerRef.current?.focus() }
    dialog.addEventListener('close', restore)
    return () => { dialog.removeEventListener('close', restore); document.body.style.overflow = '' }
  }, [])
  return <>
    <div className="system-boards">{boards.map((board,index) => <figure key={board.image}>
      <button className="artwork-open" onClick={event => { document.body.style.overflow = 'hidden'; open(index,event) }} aria-label={'放大查看：' + board.title}><img loading="lazy" decoding="async" width="1500" height="1000" src={board.image} alt={title + ' — ' + board.title} /><span>查看细节 ↗</span></button>
      <figcaption><span>0{index+1} / {board.title}</span><p>{board.note}</p></figcaption>
    </figure>)}</div>
    <dialog className="artwork-dialog" ref={dialogRef} aria-label="设计稿大图查看器" onClick={event => { if(event.target === event.currentTarget) close() }} onKeyDown={event => { if(event.key === 'ArrowRight') { event.preventDefault(); setSelected(index => (index+1)%boards.length) } if(event.key === 'ArrowLeft') { event.preventDefault(); setSelected(index => (index+boards.length-1)%boards.length) } }}>
      <div className="artwork-toolbar"><span>{String(selected+1).padStart(2,'0')} / {String(boards.length).padStart(2,'0')} — {boards[selected].title}</span><button onClick={close} aria-label="关闭大图">关闭 ×</button></div>
      <img src={boards[selected].image} alt={title + ' — ' + boards[selected].title} />
      <div className="artwork-controls"><button onClick={() => setSelected(index => (index+boards.length-1)%boards.length)}>← 上一张</button><span>可使用键盘 ← → 切换 · Esc 关闭</span><button onClick={() => setSelected(index => (index+1)%boards.length)}>下一张 →</button></div>
    </dialog>
  </>
}

function DailyStillCase({ project, next }) {
  const study = project.premium
  return <div className="daily-case">
    <header className="capability-detail-nav"><a href="/#work"><ArrowLeft /> 返回作品集</a><span>DAILY STILL / BRAND STUDY</span><a href="/#contact">联系我 <ArrowUpRight /></a></header>
    <main>
      <section className="daily-opening shell">
        <div className="daily-eyebrow"><span>SELECTED CASE / 01</span><span>SELF-INITIATED · 2026</span></div>
        <div className="daily-title-row"><h1>Daily <em>Still.</em></h1><p>让日常，<br />慢下来。</p></div>
        <div className="daily-meta"><span>品牌识别 / 包装概念 / 艺术指导</span><span>自主概念研究 · AI 辅助效果图 · 未实物打样</span></div>
        <nav className="case-sections" aria-label="案例目录"><a href="#daily-idea">01 品牌主张</a><a href="#daily-material">02 材质与细节</a><a href="#brand-system">03 识别与应用</a></nav>
      </section>
      <figure className="daily-full-image"><img src={project.image} fetchPriority="high" width="1536" height="1024" alt="Daily Still 品牌包装家族概念效果图" /><figcaption>BRAND FAMILY / 包装、产品与纸品的统一表达</figcaption></figure>
      <section className="daily-story shell" id="daily-idea"><span className="daily-label">01 / THE IDEA</span><div><h2>少一点噪声，<br /><em>多一点感受。</em></h2><p>从一枚蓝色球形瓶盖出发，把“安静”转化为可被看见的品牌语言。温暖的纸张、克制的字标与缓慢展开的圆弧，让产品、包装和纸品共享同一种节奏。</p></div><aside><span>三个设计支点</span><p>01　以钴蓝建立记忆</p><p>02　以圆弧连接触点</p><p>03　以材质传递温度</p></aside></section>
      <section className="daily-material" id="daily-material"><div className="daily-material-photo"><img src={study.print} loading="lazy" width="1536" height="1024" alt="品牌卡片与封套的纸张、凹印概念特写" /></div><div className="daily-material-copy"><span className="daily-label">02 / MATERIAL &amp; DETAIL</span><h2>看得见的留白。<br /><em>想触摸的细节。</em></h2><p>将同心圆从平面图案转化为压凹的工艺设想，以侧光表达浅浅的起伏。暖白纸面与蓝色封套形成对照，让识别不只依靠一个标志。</p><div className="daily-material-spec"><span>暖白棉纸质感</span><span>无色压凹概念</span><span>钴蓝单色印刷方向</span></div><small>AI 辅助材质效果研究，非实际印刷样品。</small></div></section>
      <section className="daily-identity" id="brand-system"><div className="shell daily-identity-inner"><div><span className="daily-label">03 / A COHERENT LANGUAGE</span><h2>One circle.<br /><em>Many expressions.</em></h2><p>一组圆弧，从瓶盖轮廓延伸到包装、纸品和空间海报。衬线字标建立柔和的语气，清晰的信息网格保证每个应用都容易阅读。</p><div className="daily-colors"><span><i style={{background:'#263EA0'}} />COBALT / #263EA0</span><span><i style={{background:'#F0EDDF'}} />WARM WHITE / #F0EDDF</span><span><i style={{background:'#B3A68A'}} />STONE / #B3A68A</span></div></div><div className="daily-wordmark" aria-label="Daily Still 字标与圆弧图形"><span>Daily<br />Still.</span><div className="daily-orbits" aria-hidden="true"><i/><i/><i/><i/></div><small>QUIET BY NATURE.</small></div></div></section>
      <section className="daily-gallery shell"><div className="daily-gallery-heading"><span className="daily-label">04 / IN CONTEXT</span><h2>把同一种气质，<br />带进不同的场景。</h2><p>海报以字标、产品、图形三种表达并置，建立主次与节奏。图像是品牌概念的空间预演。</p></div><figure><img src={study.gallery} loading="lazy" width="1536" height="1024" alt="Daily Still 三幅海报在画廊中的概念应用效果" /><figcaption>POSTER SERIES / 空间应用概念效果</figcaption></figure></section>
      <section className="daily-detail-pair shell"><figure><img loading="lazy" src={study.original} alt="蓝色球形瓶盖与石材构图研究" /><figcaption>01 / 产品轮廓与材质研究</figcaption></figure><div><span className="daily-label">DESIGN RATIONALE</span><h2>从单一识别点，<br />到完整视觉秩序。</h2><p>球形瓶盖是最初的记忆点；圆弧与蓝色将这个记忆连接到更多触点。主视觉强调光与材质，应用稿强调信息与留白，让产品情绪与品牌识别彼此呼应。</p><p className="daily-disclosure">本项目为虚构品牌的自主概念研究。产品、包装、纸品与空间应用图为 AI 辅助效果图；字标与版式为视觉探索，不代表已生产、打样或投入商业使用。</p></div></section>
      <section className="daily-support shell"><details><summary>查看基础规范与平面设计稿 <span>＋</span></summary><ArtworkViewer boards={project.system.boards} title={project.title} /></details></section>
      <nav className="shell case-next daily-next" aria-label="浏览其他案例"><a className="case-back" href="/#work">← 全部作品</a><a className="case-next-link" href={'/project/' + next.id}><img loading="lazy" src={next.image} alt="" /><span><small>NEXT PROJECT / 下一案例</small><b>{next.title}</b></span><ArrowUpRight /></a></nav>
    </main>
  </div>
}

function ProjectPage({ content, id }) {
  const index = content.projects.findIndex(item => item.id === id)
  const project = content.projects[index]
  if (!project) return <main className="capability-not-found"><h1>作品不存在</h1><a href="/#work">返回作品集</a></main>
  const next = content.projects[(index + 1) % content.projects.length]
  if (project.premium) return <DailyStillCase project={project} next={next} />
  const notes = [ ['01', '项目背景', project.background], ['02', '视觉策略', project.process], ['03', '概念延展', project.outcome] ]
  return <div className="project-detail-page">
    <header className="capability-detail-nav"><a href="/#work"><ArrowLeft /> 返回作品集</a><span>BRAND / VISUAL</span><a href="/#contact">联系我 <ArrowUpRight /></a></header>
    <main className="shell project-case">
      <div className="case-heading"><div><p className="micro-title">SELECTED PROJECT / {String(index + 1).padStart(2, '0')}</p><h1>{project.title}</h1><p className="case-subtitle">{project.subtitle}</p></div><span className="case-edition">CONCEPT STUDY<br />2026</span></div>
      <div className="case-facts"><div><small>DISCIPLINE / 设计范围</small><p>品牌识别 · 艺术指导 · 产品视觉</p></div><div><small>APPROACH / 创作方式</small><p>视觉概念 · AI 辅助图像 · 字标研究</p></div><div><small>STATUS / 项目性质</small><p>自主概念 / 非商业委托</p></div></div>
      <nav className="case-sections" aria-label="案例目录"><a href="#case-visual">01 主视觉</a><a href="#case-strategy">02 设计策略</a><a href="#brand-system">03 品牌系统与应用</a></nav><figure className="case-hero" id="case-visual"><img className="case-image" src={project.image} alt={project.title + ' 产品主视觉'} fetchPriority="high" /><figcaption><span>01 / KEY VISUAL</span><span>产品主视觉 · 材质与光线研究</span></figcaption></figure>
      <div className="case-notes" id="case-strategy">{notes.map(([number, title, text]) => <section key={number}><span className="case-note-index">{number}</span><h2>{title}</h2><p>{text}</p></section>)}</div>
      {project.identity && <figure className="case-identity"><figcaption><span>02 / VISUAL IDENTITY</span><span>字标与配色探索</span></figcaption><img loading="lazy" src={project.identity} alt={`${project.title} 字标与配色研究`} /></figure>}
      {project.system && <section id="brand-system" className="brand-system" style={{'--case-ink':project.system.ink,'--case-paper':project.system.paper}} aria-label="品牌系统与应用">
        <div className="system-intro"><p className="micro-title">03 / FROM IDENTITY TO EXPERIENCE</p><h2>{project.system.tagline}</h2><p>{project.system.idea}</p></div>
        <div className="system-palette">{project.system.palette.map(color => <div key={color.hex}><span style={{background:color.hex}} /><b>{color.name}</b><code>{color.hex}</code></div>)}</div>
        <ArtworkViewer boards={project.system.boards} title={project.title} />
      </section>}
      <nav className="case-next" aria-label="浏览其他案例"><a className="case-back" href="/#work">← 全部作品</a><a className="case-next-link" href={'/project/' + next.id}><img loading="lazy" src={next.image} alt="" /><span><small>NEXT PROJECT / 下一案例</small><b>{next.title}</b></span><ArrowUpRight /></a></nav>
    </main></div>
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isAdmin = pathname === '/admin'
  const projectMatch = pathname.match(/^\/project\/([^/]+)$/)
  const capabilityMatch = pathname.match(/^\/capability\/([^/]+)$/)
  const [content, setContent] = useState(defaultContent)
  const [ready, setReady] = useState(true)

  useEffect(() => {
    if (isAdmin) return
    setContent(defaultContent)
  }, [isAdmin])

  if (isAdmin) return <main className="capability-not-found"><h1>作品集展示站</h1><p>内容通过本地管理后台维护。</p><a href="/">返回首页</a></main>
  if (!ready) return <div className="portfolio-loading"><span>PORTFOLIO</span><i /></div>
  if (projectMatch) return <ProjectPage content={content} id={decodeURIComponent(projectMatch[1])} />
  if (capabilityMatch) return <CapabilityPage content={content} slug={decodeURIComponent(capabilityMatch[1])} />
  return <Portfolio content={content} />
}

export default App
