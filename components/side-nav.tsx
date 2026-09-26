'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  CalendarRange,
  Gauge,
  Calculator,
  LifeBuoy,
  Landmark,
  Menu,
  X,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const navItems = [
  { id: 'home', label: 'Dashboard', hint: 'Network overview', icon: LayoutDashboard },
  { id: 'schedule', label: 'Unified Schedule', hint: 'All departments', icon: CalendarRange },
  { id: 'speed', label: 'Live Speed Tracker', hint: 'Real-time monitoring', icon: Gauge },
  { id: 'overtake', label: 'Overtake Calculator', hint: 'Loop planning', icon: Calculator },
  { id: 'helpdesk', label: 'Helpdesk', hint: 'Control office', icon: LifeBuoy },
]

export function SideNav() {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function handleSelect(id: string) {
    setActive(id)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex size-11 items-center justify-center rounded-xl border border-white/60 bg-white/40 text-foreground shadow-lg backdrop-blur-xl lg:hidden"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="side-nav"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        id="side-nav"
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-4 left-4 z-50 flex w-72 flex-col overflow-hidden rounded-3xl border border-white/60 bg-[oklch(0.62_0.1_50/0.22)] p-4 text-foreground shadow-[0_24px_60px_-20px_rgba(120,53,15,0.55),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-[1.8] transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]',
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/55 via-white/15 to-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-white/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative flex items-start justify-between gap-2 px-2 pb-5 pt-2">
          <a href="#home" className="flex items-center gap-3" onClick={() => handleSelect('home')}>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-white/50">
              <Landmark className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="font-serif text-base font-semibold leading-tight">
                Rail Operations Portal
              </span>
              <span className="text-xs text-muted-foreground">Department of Railways</span>
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-white/40 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="relative mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

        <p className="relative px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Operations
        </p>

        <ul className="relative flex flex-1 flex-col gap-2">
          {navItems.map(({ id, label, hint, icon: Icon }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => handleSelect(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-300 ease-out active:scale-[0.97]',
                    isActive
                      ? '-translate-y-1 bg-white/80 text-primary shadow-[0_14px_28px_-10px_rgba(120,53,15,0.55)] ring-1 ring-white/80'
                      : 'text-foreground/85 hover:-translate-y-0.5 hover:bg-white/40 hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white/50 text-primary group-hover:bg-white/70',
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">{label}</span>
                    <span
                      className={cn(
                        'text-xs',
                        isActive ? 'text-primary/75' : 'text-muted-foreground',
                      )}
                    >
                      {hint}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="relative rounded-2xl border border-white/60 bg-white/45 p-4 shadow-inner">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <PhoneCall className="size-4 text-primary" />
            Control Office
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            24x7 divisional control for operational emergencies.
          </p>
          <a
            href="tel:139"
            className="mt-3 block rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Dial 139
          </a>
        </div>

        <a
          href="#"
          className="relative mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-white/40"
        >
          <ShieldCheck className="size-5 text-primary" />
          Officer sign in
        </a>
      </nav>
    </>
  )
}
