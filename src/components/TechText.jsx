import { useEffect, useMemo, useRef, useState } from 'react'
import './TechText.css'

export default function TechText({
  text = 'React Bits',
  fontFamily = '',
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = 'currentColor',
  accentColor = 'currentColor',
  align = 'center',
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  lineStyle = 'dashed',
  reveal = 'letter',
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  bounce = 0.4,
  sweep = true,
  speed = 1,
  clickKick = true,
  intro = 'none',
  introDuration = 2,
  guides = false,
  className = '',
  style,
}) {
  const rootRef = useRef(null)
  const dragRef = useRef(null)
  const [active, setActive] = useState(-1)
  const [kick, setKick] = useState(-1)
  const [dragging, setDragging] = useState(-1)
  const [offsets, setOffsets] = useState({})
  const letters = useMemo(() => Array.from(text), [text])

  useEffect(() => {
    if (!sweep || active >= 0 || dragging >= 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let index = 0
    const timer = window.setInterval(() => {
      setActive(index % letters.length)
      index += 1
      window.setTimeout(() => setActive((value) => value === index - 1 ? -1 : value), 520 / Math.max(speed, 0.2))
    }, 900 / Math.max(speed, 0.2))
    return () => window.clearInterval(timer)
  }, [active, dragging, letters.length, speed, sweep])

  const release = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    dragRef.current = null
    setDragging(-1)
    setOffsets((current) => ({ ...current, [drag.index]: { x: 0, y: 0 } }))
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <div
      ref={rootRef}
      className={`tech-text tech-text--${intro}${guides ? ' tech-text--guides' : ''} ${className}`.trim()}
      style={{
        '--tt-font': fontFamily || 'inherit',
        '--tt-weight': fontWeight,
        '--tt-size': `${fontSize}px`,
        '--tt-spacing': `${letterSpacing}em`,
        '--tt-color': color,
        '--tt-accent': accentColor,
        '--tt-dash': `${dashLength} ${dashGap}`,
        '--tt-stroke': `${strokeWidth}px`,
        '--tt-intro': `${introDuration}s`,
        '--tt-bounce': `${Math.max(.25, 1 - bounce * .45)}s`,
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
        ...style,
      }}
      role="img"
      aria-label={text}
      onPointerLeave={() => {
        if (dragging < 0) setActive(-1)
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current
        if (!drag || drag.id !== event.pointerId) return
        setOffsets((current) => ({
          ...current,
          [drag.index]: { x: event.clientX - drag.x, y: event.clientY - drag.y },
        }))
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      {guides ? <span className="tech-text__guide" aria-hidden="true" /> : null}
      {letters.map((letter, index) => {
        const isActive = reveal !== 'off' && active === index
        const offset = offsets[index] || { x: 0, y: 0 }
        return (
          <span
            className={`tech-text__glyph${isActive ? ' is-active' : ''}${kick === index ? ' is-kicked' : ''}${dragging === index ? ' is-dragging' : ''}`}
            key={`${letter}-${index}`}
            data-char={letter}
            style={{
              '--tt-index': index,
              '--tt-x': `${offset.x}px`,
              '--tt-y': `${offset.y}px`,
              '--tt-line-style': lineStyle,
            }}
            aria-hidden="true"
            onPointerEnter={() => setActive(index)}
            onPointerDown={(event) => {
              if (!draggable || !letter.trim()) return
              dragRef.current = { id: event.pointerId, index, x: event.clientX, y: event.clientY }
              setDragging(index)
              event.currentTarget.setPointerCapture?.(event.pointerId)
            }}
            onClick={() => {
              if (!clickKick || !letter.trim()) return
              setKick(index)
              window.setTimeout(() => setKick(-1), 720)
            }}
          >
            {letter === ' ' ? '\u00a0' : letter}
            {selection && isActive ? <i className="tech-text__selection" /> : null}
            {labels && isActive ? <b className="tech-text__label">{letter.toUpperCase()} · {index + 1}</b> : null}
            {isActive && specks > 0 ? <em className="tech-text__specks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></em> : null}
          </span>
        )
      })}
    </div>
  )
}
