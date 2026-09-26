import { ArrowRight, CalendarRange, Gauge, Calculator, Megaphone, Mail, MapPin, PhoneCall } from 'lucide-react'
import { GlassCard, SectionHeading } from '@/components/shared'

/* =====================================================================
   HERO (top of the page): title, buttons, network summary, notices, tool cards
   ===================================================================== */

// Network summary numbers
const kpis = [
  { label: 'Trains running', value: '1,284', note: '+36 vs yesterday' },
  { label: 'On-time performance', value: '91.4%', note: 'Division average' },
  { label: 'Avg. sectional speed', value: '78 km/h', note: 'Mail / Express' },
  { label: 'Departments synced', value: '6 / 6', note: 'Schedules unified' },
]

// The 3 tool cards
const tools = [
  { href: '#schedule', title: 'Unified Schedule', body: 'One timetable of blocks and activities across all departments, with clash detection.', icon: CalendarRange },
  { href: '#speed', title: 'Live Speed Tracker', body: 'Monitor running speed against permitted limits with over-speed alerts.', icon: Gauge },
  { href: '#overtake', title: 'Overtake Calculator', body: 'Find the right loop station and detention time for precedence moves.', icon: Calculator },
]

// Notices strip
const notices = [
  'Circular No. OPS/2026/114: Revised block timings on Rampur – Devgarh section effective 01 Oct.',
  'Monsoon patrolling to continue on ghat sections until further orders.',
  'All departments to submit weekly maintenance blocks by Friday 17:00 hrs.',
]

export function Hero() {
  return (
    <section id="home" className="scroll-mt-6 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-stretch">
        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-bottom-10 duration-700">
          <p className="w-fit rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur-md">
            Official Operations &amp; Coordination Portal
          </p>
          <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
            Unified Railway Operations Portal
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A single window for all departments to coordinate schedules, monitor train speeds in real time and plan
            overtakes at loop stations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#schedule"
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
            >
              View unified schedule <ArrowRight className="size-4" />
            </a>
            <a
              href="#speed"
              className="rounded-xl border border-white/60 bg-white/45 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/65"
            >
              Open speed tracker
            </a>
          </div>
        </div>

        <GlassCard className="p-5 animate-in fade-in slide-in-from-bottom-12 duration-700 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Network summary</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
              Live
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-white/60 bg-white/50 p-3.5">
                <dt className="text-xs text-muted-foreground">{k.label}</dt>
                <dd className="mt-1 font-serif text-2xl font-semibold text-foreground">{k.value}</dd>
                <dd className="mt-0.5 text-[11px] text-muted-foreground">{k.note}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>

      <div className="mt-6 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/40 px-4 py-3 backdrop-blur-xl">
        <span className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          <Megaphone className="size-3.5" aria-hidden="true" />
          Notices
        </span>
        <ul className="flex min-w-0 flex-1 gap-8 overflow-x-auto whitespace-nowrap text-sm text-foreground/85 [scrollbar-width:none]">
          {notices.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {tools.map(({ href, title, body, icon: Icon }, i) => (
          <li
            key={title}
            className="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
            style={{ animationDelay: `${150 + i * 120}ms` }}
          >
            <a
              href={href}
              className="group flex h-full flex-col rounded-2xl border border-white/60 bg-white/45 p-5 shadow-[0_18px_40px_-22px_rgba(120,53,15,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/60"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <span className="mt-4 font-serif text-lg font-semibold">{title}</span>
              <span className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</span>
              <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                Open tool
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* =====================================================================
   HELPDESK + FOOTER (bottom of the page)
   ===================================================================== */

const contacts = [
  { icon: PhoneCall, title: 'Divisional Control', detail: '139 (24x7)', href: 'tel:139' },
  { icon: Mail, title: 'Operations Cell', detail: 'ops-cell@railways.gov.in', href: 'mailto:ops-cell@railways.gov.in' },
  { icon: MapPin, title: 'Divisional Office', detail: 'Rail Bhawan, Sonpur Junction', href: '#' },
]

const footerLinks = ['Terms of Use', 'Privacy Policy', 'Accessibility Statement', 'RTI', 'Sitemap']

export function HelpdeskSection() {
  return (
    <section id="helpdesk" className="scroll-mt-6">
      <SectionHeading
        eyebrow="Support"
        title="Helpdesk"
        description="For portal access, schedule corrections or operational emergencies, contact the offices below."
      />

      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {contacts.map(({ icon: Icon, title, detail, href }) => (
          <li key={title}>
            <a href={href} className="block h-full transition-transform duration-300 hover:-translate-y-1">
              <GlassCard className="h-full p-5 md:p-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="mt-3 font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{detail}</p>
              </GlassCard>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-10 rounded-2xl border border-white/60 bg-white/40 px-5 py-5 text-sm backdrop-blur-xl">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
            {footerLinks.map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-primary hover:underline">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Content owned and maintained by the Department of Railways. Data shown on this portal is for operational
          coordination and is subject to confirmation by the Divisional Control.
        </p>
      </footer>
    </section>
  )
}
