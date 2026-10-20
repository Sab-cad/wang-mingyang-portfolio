import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import './FlipCard.css'

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value))
const snap = (degrees) => Math.round(degrees / 180) * 180
const isBack = (degrees) => Math.abs(Math.round(degrees / 180)) % 2 === 1

export default function FlipCard({
  front = null,
  back = null,
  flipped,
  defaultFlipped = false,
  onFlipChange,
  axis = 'y',
  flipOnClick = true,
  draggable = true,
  dragDistance = 0,
  tilt = true,
  tiltMax = 12,
  glare = true,
  glareOpacity = 0.22,
  hoverScale = 1.03,
  perspective = 1100,
  stiffness = 170,
  damping = 20,
  width = 300,
  height = 400,
  radius = 22,
  background = '#27272a',
  color = '#f5f5f5',
  shadow = true,
  shadowColor = '#000000',
  shadowOpacity = 0.45,
  disabled = false,
  ariaLabel = 'Flip card',
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const controlled = flipped !== undefined
  const [innerFlipped, setInnerFlipped] = useState(defaultFlipped)
  const [dragging, setDragging] = useState(false)
  const shown = controlled ? flipped : innerFlipped
  const shownRef = useRef(shown)
  const rootRef = useRef(null)
  const gripRef = useRef(null)
  const animationRef = useRef(null)
  const targetRef = useRef(shown ? 180 : 0)
  shownRef.current = shown

  const turn = useMotionValue(shown ? 180 : 0)
  const tiltX = useSpring(0, { stiffness: 240, damping: 24, mass: 0.6 })
  const tiltY = useSpring(0, { stiffness: 240, damping: 24, mass: 0.6 })
  const lift = useSpring(1, { stiffness: 320, damping: 26 })
  const sheen = useSpring(0, { stiffness: 320, damping: 26 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const sumX = useTransform([turn, tiltX], ([rotation, x]) => rotation + x)
  const sumY = useTransform([turn, tiltY], ([rotation, y]) => rotation + y)
  const rotateY = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateX(${tiltX}deg) rotateY(${sumY}deg)`
  const rotateX = useMotionTemplate`perspective(${perspective}px) scale(${lift}) rotateY(${tiltY}deg) rotateX(${sumX}deg)`
  const facing = useTransform(turn, (value) => Math.abs(Math.cos((value * Math.PI) / 180)))
  const shadowSpread = useTransform(facing, (value) => 0.08 + 0.92 * value)
  const shadowOpacityValue = useTransform(facing, (value) => 0.1 + 0.9 * value * value)
  const glareXPct = useMotionTemplate`${glareX}%`
  const glareYPct = useMotionTemplate`${glareY}%`

  const settle = (to, velocity = 0, instant = false) => {
    animationRef.current?.stop()
    targetRef.current = to
    if (instant || reduceMotion) turn.jump(to)
    else animationRef.current = animate(turn, to, { type: 'spring', stiffness, damping, velocity, restDelta: 0.05 })
    const next = isBack(to)
    if (next === shownRef.current) return
    shownRef.current = next
    if (!controlled) setInnerFlipped(next)
    onFlipChange?.(next)
  }

  const flip = (instant = false) => {
    const base = snap(turn.get())
    settle(isBack(base) ? base - 180 : base + 180, 0, instant)
  }

  const resetHover = () => {
    tiltX.set(0)
    tiltY.set(0)
    sheen.set(0)
    lift.set(1)
  }

  useEffect(() => {
    if (!controlled || isBack(targetRef.current) === flipped) return
    const base = targetRef.current
    settle(isBack(base) ? base - 180 : base + 180)
  }, [flipped])

  useEffect(() => () => animationRef.current?.stop(), [])

  const onPointerDown = (event) => {
    if (disabled || event.button !== 0 || gripRef.current) return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    animationRef.current?.stop()
    gripRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      base: turn.get(),
      moved: false,
      slop: event.pointerType === 'touch' ? 8 : 4,
      history: [],
    }
    if (!reduceMotion) lift.set(hoverScale)
  }

  const onPointerMove = (event) => {
    const grip = gripRef.current
    if (grip?.id === event.pointerId) {
      const delta = axis === 'x' ? event.clientY - grip.y : event.clientX - grip.x
      if (!grip.moved) {
        if (Math.abs(delta) < grip.slop || !draggable || reduceMotion) return
        grip.moved = true
        setDragging(true)
        tiltX.set(0)
        tiltY.set(0)
        sheen.set(0)
      }
      const span = dragDistance > 0 ? dragDistance : axis === 'x' ? height : width
      const degrees = grip.base + (axis === 'x' ? -1 : 1) * (delta / span) * 180
      turn.set(degrees)
      const now = performance.now()
      grip.history.push({ time: now, value: degrees })
      while (grip.history.length > 2 && now - grip.history[0].time > 90) grip.history.shift()
      return
    }
    if (!tilt || reduceMotion || disabled || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)
    tiltX.set((0.5 - y) * 2 * tiltMax)
    tiltY.set((x - 0.5) * 2 * tiltMax)
    glareX.set(x * 100)
    glareY.set(y * 100)
    sheen.set(1)
  }

  const release = (event, cancelled = false) => {
    const grip = gripRef.current
    if (!grip || grip.id !== event.pointerId) return
    gripRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setDragging(false)
    if (event.pointerType === 'touch' || !rootRef.current?.matches(':hover')) resetHover()
    if (!grip.moved) {
      if (!cancelled && flipOnClick) flip()
      else settle(targetRef.current)
      return
    }
    const current = turn.get()
    let velocity = 0
    const first = grip.history[0]
    const last = grip.history.at(-1)
    if (!cancelled && first && last && last.time > first.time && performance.now() - last.time < 60) {
      velocity = ((last.value - first.value) / (last.time - first.time)) * 1000
    }
    const target = cancelled
      ? snap(grip.base)
      : clamp(snap(current + velocity * 0.16), snap(current) - 180, snap(current) + 180)
    settle(target, velocity)
  }

  const rotorStyle = {
    transform: axis === 'x' ? rotateX : rotateY,
    '--fc-gx': glareXPct,
    '--fc-gy': glareYPct,
    '--fc-sheen': sheen,
  }

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={shown}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      className={`flip-card${className ? ` ${className}` : ''}`}
      data-axis={axis}
      data-draggable={draggable && !disabled && !reduceMotion ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-fade={reduceMotion ? (shown ? 'back' : 'front') : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => release(event)}
      onPointerCancel={(event) => release(event, true)}
      onLostPointerCapture={(event) => release(event, true)}
      onPointerEnter={(event) => {
        if (!reduceMotion && !disabled && event.pointerType !== 'touch') lift.set(hoverScale)
      }}
      onPointerLeave={() => {
        if (!gripRef.current) resetHover()
      }}
      onKeyDown={(event) => {
        if (disabled || !['Enter', ' '].includes(event.key)) return
        event.preventDefault()
        if (!event.repeat) flip(true)
      }}
      onClick={(event) => {
        if (!disabled && event.detail === 0) flip(true)
      }}
      onDragStart={(event) => event.preventDefault()}
      style={{
        '--fc-w': `${width}px`,
        '--fc-h': `${height}px`,
        '--fc-radius': `${radius}px`,
        '--fc-bg': background,
        '--fc-ink': color,
        '--fc-shadow': shadowColor,
        '--fc-shadow-o': shadowOpacity,
        '--fc-glare': glareOpacity,
      }}
    >
      {shadow ? (
        <motion.span
          className="flip-card__shadow"
          aria-hidden="true"
          style={axis === 'x' ? { scaleY: shadowSpread, opacity: shadowOpacityValue } : { scaleX: shadowSpread, opacity: shadowOpacityValue }}
        />
      ) : null}
      <motion.div className="flip-card__rotor" style={reduceMotion ? undefined : rotorStyle}>
        <div className="flip-card__face flip-card__face--front" aria-hidden={shown} inert={shown}>
          {front}
          {glare ? <span className="flip-card__glare" aria-hidden="true" /> : null}
        </div>
        <div className="flip-card__face flip-card__face--back" aria-hidden={!shown} inert={!shown}>
          {back}
          {glare ? <span className="flip-card__glare" aria-hidden="true" /> : null}
        </div>
      </motion.div>
    </div>
  )
}
