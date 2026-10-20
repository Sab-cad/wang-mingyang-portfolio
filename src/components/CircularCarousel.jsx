import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import './CircularCarousel.css'

const wrapIndex = (value, count) => ((value % count) + count) % count

export default function CircularCarousel({
  items = [],
  preset = 'panorama',
  intro = 'rise',
  cardWidth = 320,
  aspectRatio = 4 / 3,
  gap = 24,
  autoplay = 'drift',
  speed = 10,
  direction = 'left',
  draggable = true,
  pauseOnHover = true,
  focusOnClick = true,
  tilt = -3,
  perspective = 1500,
  fadeColor = '#090a0f',
  cornerRadius = 20,
  onChange,
  onItemClick,
  className = '',
  style,
}) {
  const list = items.filter((item) => item?.src)
  const count = list.length
  const rootRef = useRef(null)
  const angleRef = useRef(0)
  const speedRef = useRef(direction === 'right' ? speed : -speed)
  const dragRef = useRef(null)
  const hoverRef = useRef(false)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
  const step = count ? 360 / count : 360
  const cardHeight = cardWidth / aspectRatio
  const radius = useMemo(() => {
    if (count < 2) return cardWidth
    return Math.max(cardWidth * 0.8, ((cardWidth + gap) / 2) / Math.tan(Math.PI / count))
  }, [cardWidth, count, gap])

  const updateActive = useCallback((angle) => {
    if (!count) return
    const next = wrapIndex(Math.round(-angle / step), count)
    setActive((current) => {
      if (current !== next) onChange?.(next)
      return next
    })
  }, [count, onChange, step])

  useEffect(() => {
    if (!count) return undefined
    const root = rootRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = performance.now()
    let visible = true
    const render = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragRef.current && autoplay !== 'off' && !reduce && !(pauseOnHover && hoverRef.current)) {
        const desired = direction === 'right' ? Math.abs(speed) : -Math.abs(speed)
        speedRef.current += (desired - speedRef.current) * (1 - Math.exp(-dt / 0.5))
        angleRef.current += speedRef.current * dt
      }
      root.style.setProperty('--cc-angle', `${angleRef.current}deg`)
      updateActive(angleRef.current)
      if (visible) raf = requestAnimationFrame(render)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        setReady(true)
        if (!raf) {
          last = performance.now()
          raf = requestAnimationFrame(render)
        }
      } else {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    observer.observe(root)
    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [autoplay, count, direction, pauseOnHover, speed, updateActive])

  const focusIndex = (index) => {
    const desired = -index * step
    angleRef.current = desired + 360 * Math.round((angleRef.current - desired) / 360)
    rootRef.current?.style.setProperty('--cc-angle', `${angleRef.current}deg`)
    updateActive(angleRef.current)
  }
  const onPointerDown = (event) => {
    if (!draggable || event.button !== 0) return
    dragRef.current = { id: event.pointerId, x: event.clientX, angle: angleRef.current, moved: false }
    rootRef.current?.setPointerCapture?.(event.pointerId)
  }
  const onPointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    const delta = event.clientX - drag.x
    drag.moved ||= Math.abs(delta) > 5
    angleRef.current = drag.angle + delta * 0.22
    setDragging(drag.moved)
  }
  const onPointerUp = (event) => {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
    rootRef.current?.releasePointerCapture?.(event.pointerId)
  }
  const onKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    focusIndex(wrapIndex(active + (event.key === 'ArrowRight' ? 1 : -1), count))
  }
  if (!count) return null
  return (
    <div
      ref={rootRef}
      className={`circular-carousel${dragging ? ' is-dragging' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, '--cc-card-w': `${cardWidth}px`, '--cc-card-h': `${cardHeight}px`, '--cc-radius': `${radius}px`, '--cc-perspective': `${perspective}px`, '--cc-tilt': `${tilt}deg`, '--cc-corner': `${cornerRadius}px`, '--cc-fade': fadeColor, '--cc-angle': '0deg' }}
      role="region"
      aria-roledescription="carousel"
      aria-label="精选作品圆形轮播"
      tabIndex={0}
      data-preset={preset}
      data-intro={intro}
      data-ready={ready ? '' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => { hoverRef.current = true }}
      onPointerLeave={() => { hoverRef.current = false }}
      onKeyDown={onKeyDown}
    >
      <div className="circular-carousel__viewport">
        <div className="circular-carousel__ring">
          {list.map((item, index) => (
            <button
              type="button"
              className="circular-carousel__card"
              style={{ '--cc-i': index, '--cc-step': `${step}deg`, '--cc-delay': `${Math.min(index, 7) * 72}ms` }}
              key={`${item.src}-${index}`}
              aria-label={`${item.title || item.alt || `作品 ${index + 1}`}，第 ${index + 1} 张，共 ${count} 张`}
              onClick={() => {
                if (dragging) return
                if (focusOnClick) focusIndex(index)
                onItemClick?.(item, index)
              }}
            >
              <img src={item.src} alt={item.alt || ''} draggable="false" />
              <span className="circular-carousel__shade" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
