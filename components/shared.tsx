'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Landmark } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ---------- GlassCard: frosted glass box used everywhere ---------- */
export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/60 bg-white/45 p-6 shadow-[0_18px_40px_-18px_rgba(120,53,15,0.35),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl backdrop-saturate-150 md:p-8',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------- SectionHeading: small label + big title + description ---------- */
export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

/* ---------- Reveal: slides sections upward on scroll (change translate-y-16 for distance) ---------- */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setShown(entry.isIntersecting), { threshold: 0.08 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------- TopBar: "Government Portal | Ministry of Railways" + live IST clock ---------- */
function formatIST(date: Date) {
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/40 px-4 py-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-2 font-medium text-foreground">
        <Landmark className="size-4 text-primary" aria-hidden="true" />
        Government Portal
        <span className="text-muted-foreground" aria-hidden="true">
          |
        </span>
        <span className="text-muted-foreground">Ministry of Railways</span>
      </p>
      <p className="flex items-center gap-2 tabular-nums text-muted-foreground">
        <Clock className="size-4" aria-hidden="true" />
        <span>{now ? `${formatIST(now)} IST` : 'Loading time…'}</span>
      </p>
    </header>
  )
}
