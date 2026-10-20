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

  const close = () => setOpen(false)
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className={`nav-home ${active === 'top' ? 'is-active' : ''}`} href="#top" onClick={close} aria-current={active === 'top' ? 'location' : undefined}>首页</a>
      <nav className={open ? 'is-open' : ''} aria-label="主导航">
        <a className={active === 'experience' ? 'is-active' : ''} href="#experience" onClick={close} aria-current={active === 'experience' ? 'location' : undefined}>关于我</a>
        <a className={active === 'work' ? 'is-active' : ''} href="#work" onClick={close} aria-current={active === 'work' ? 'location' : undefined}>精选作品</a>
        <a className={active === 'capabilities' ? 'is-active' : ''} href="#capabilities" onClick={close} aria-current={active === 'capabilities' ? 'location' : undefined}>核心能力</a>
        <a className={active === 'contact' ? 'is-active' : ''} href="#contact" onClick={close} aria-current={active === 'contact' ? 'location' : undefined}>联系我</a>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="切换导航" aria-expanded={open}><span /><span /></button>
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
                <div className="project-image"><img src={project.image} alt={`${project.title} 项目概念视觉`} /><span className="project-open" aria-hidden="true"><ImageSquare weight="bold" /></span><span className="project-id">{project.id}</span></div>
                <div className="project-copy"><div><span>{project.type}</span><h3>{project.title}</h3></div><div className="project-side"><p>{project.subtitle}</p><b>查看研究 <ArrowUpRight weight="bold" /></b></div></div>
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

      if (isMobile) opening.timeScale(1.35)

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
          .from(title, { yPercent: 135, scaleY: 0.58, skewY: 3, transformOrigin: '50% 100%', duration: isMobile ? 0.88 : 1.35, ease: 'power4.out' })
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
        .from('.contact-copy > a', { y: isMobile ? 28 : 45, autoAlpha: 0, duration: isMobile ? 0.6 : 0.9, ease: 'power3.out' }, 0.62)
        .from('.contact-panel > *, .contact-qr', { x: isMobile ? 24 : 46, autoAlpha: 0, duration: isMobile ? 0.55 : 0.8, stagger: 0.08, ease: 'power3.out' }, 0.52)
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
    }, 4800)

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
                  <h3>{work.title}</h3><p>{work.description}</p>
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

function ProjectPage({ content, id }) {
  const project = content.projects.find(item => item.id === id)
  if (!project) return <main className="capability-not-found"><h1>作品不存在</h1><a href="/#work">返回作品集</a></main>
  return <div className="project-detail-page">
    <header className="capability-detail-nav"><a href="/#work">← 返回作品集</a><span>{content.profile.nameEn} / PORTFOLIO</span><a href="/#contact">联系我</a></header>
    <main className="shell project-case"><p className="micro-title">{project.type}</p><h1>{project.title}</h1><p>{project.subtitle}</p>
      <img className="case-image" src={project.image} alt={project.title} />{project.identity && <div className="case-identity"><p>IDENTITY STUDY / 字标与配色探索</p><img src={project.identity} alt={`${project.title} 字标与配色研究`} /></div>}
      <div className="case-notes">
        <section><h2>项目背景</h2><p>{project.background || '本页使用原包素材作展示示意。正式使用时，在后台的项目说明中补充品牌、目标人群与设计任务。'}</p></section>
        <section><h2>视觉策略与制作过程</h2><p>{project.process || '待补充：本人负责的部分、使用工具、关键设计决策。请明确区分个人制作、团队协作与参考素材。'}</p></section>
        <section><h2>概念延展</h2><p>{project.outcome || '待补充：交付规格、使用渠道与实际效果。没有真实数据时，可展示最终应用与制作前后对比。'}</p></section>
      </div><a className="case-back" href="/#work">← 浏览更多作品</a>
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
