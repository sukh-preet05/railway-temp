'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Pause, Play, XCircle } from 'lucide-react'
import { GlassCard, SectionHeading } from '@/components/shared'
import { cn } from '@/lib/utils'

/* =====================================================================
   1. UNIFIED SCHEDULE
   ===================================================================== */

const departments = ['Operations', 'Engineering', 'Signal & Telecom', 'Electrical', 'Mechanical', 'Commercial'] as const

type Department = (typeof departments)[number]
type Status = 'Scheduled' | 'In progress' | 'Completed' | 'Pending approval'
type Entry = { id: string; start: string; end: string; activity: string; section: string; department: Department; status: Status }

// Timetable rows: edit or add here
const entries: Entry[] = [
  { id: 'e1', start: '06:00', end: '08:00', activity: 'Track renewal block', section: 'Rampur – Devgarh', department: 'Engineering', status: 'In progress' },
  { id: 'e2', start: '07:00', end: '09:00', activity: 'OHE maintenance block', section: 'Rampur – Devgarh', department: 'Electrical', status: 'Scheduled' },
  { id: 'e3', start: '08:30', end: '09:30', activity: 'Point machine testing', section: 'Sonpur Junction', department: 'Signal & Telecom', status: 'Scheduled' },
  { id: 'e4', start: '09:00', end: '10:00', activity: 'Rake examination', section: 'Devgarh Yard', department: 'Mechanical', status: 'Completed' },
  { id: 'e5', start: '10:00', end: '12:00', activity: 'Special train path – 02417', section: 'Kalyan Nagar – Sonpur', department: 'Operations', status: 'Pending approval' },
  { id: 'e6', start: '11:00', end: '12:30', activity: 'Interlocking upgrade', section: 'Kalyan Nagar – Sonpur', department: 'Signal & Telecom', status: 'Scheduled' },
  { id: 'e7', start: '13:00', end: '14:00', activity: 'Crowd management drill', section: 'Sonpur Junction', department: 'Commercial', status: 'Scheduled' },
  { id: 'e8', start: '14:00', end: '16:00', activity: 'Bridge No. 214 inspection', section: 'Kalyan Nagar – Sonpur', department: 'Engineering', status: 'Scheduled' },
  { id: 'e9', start: '15:30', end: '17:00', activity: 'Traction substation inspection', section: 'Devgarh Yard', department: 'Electrical', status: 'Pending approval' },
]

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Clash = same section, different department, overlapping time
const conflictIds = new Set(
  entries
    .filter((a) =>
      entries.some(
        (b) =>
          a.id !== b.id &&
          a.section === b.section &&
          a.department !== b.department &&
          toMinutes(a.start) < toMinutes(b.end) &&
          toMinutes(b.start) < toMinutes(a.end),
      ),
    )
    .map((e) => e.id),
)

const statusStyles: Record<Status, string> = {
  Scheduled: 'bg-foreground/5 text-foreground/80',
  'In progress': 'bg-primary/12 text-primary',
  Completed: 'bg-emerald-600/10 text-emerald-700',
  'Pending approval': 'bg-amber-500/15 text-amber-800',
}

export function ScheduleSection() {
  const [filter, setFilter] = useState<Department | 'All'>('All')
  const visible = filter === 'All' ? entries : entries.filter((e) => e.department === filter)

  const summary = [
    { label: 'Total activities', value: entries.length },
    { label: 'Clashes to resolve', value: conflictIds.size / 2 },
    { label: 'Pending approval', value: entries.filter((e) => e.status === 'Pending approval').length },
  ]

  return (
    <section id="schedule" className="scroll-mt-6">
      <SectionHeading
        eyebrow="Inter-departmental coordination"
        title="Unified schedule"
        description="All blocks and activities from every department in one timetable. Overlapping work on the same section is flagged so control can coordinate in advance."
      />

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {summary.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/60 bg-white/45 p-4 backdrop-blur-xl">
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="mt-1 font-serif text-2xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <GlassCard className="mt-4 p-4 md:p-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by department">
          {(['All', ...departments] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilter(d)}
              aria-pressed={filter === d}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                filter === d
                  ? '-translate-y-0.5 bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : 'border border-white/70 bg-white/50 text-foreground/80 hover:bg-white/80',
              )}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Unified departmental schedule for today</caption>
            <thead>
              <tr className="border-b border-foreground/10 text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-3 pr-4 font-semibold">Time</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Activity</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Section</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Department</th>
                <th scope="col" className="py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => {
                const clash = conflictIds.has(e.id)
                return (
                  <tr key={e.id} className="border-b border-foreground/5 last:border-0">
                    <td className="py-3 pr-4 font-medium tabular-nums">
                      {e.start}–{e.end}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-medium">{e.activity}</span>
                      {clash && (
                        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-destructive">
                          <AlertTriangle className="size-3.5" aria-hidden="true" />
                          Overlaps another department
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{e.section}</td>
                    <td className="py-3 pr-4">{e.department}</td>
                    <td className="py-3">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusStyles[e.status])}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </section>
  )
}

/* =====================================================================
   2. LIVE SPEED TRACKER
   ===================================================================== */

// limit = permitted speed (MPS), base = typical running speed
const trains = [
  { no: '22436', name: 'Vande Bharat Express', limit: 160, base: 138, startKm: 12 },
  { no: '12301', name: 'Rampur Mail', limit: 130, base: 112, startKm: 40 },
  { no: '17032', name: 'Devgarh Passenger', limit: 100, base: 72, startKm: 60 },
  { no: 'GD-41', name: 'Container Goods', limit: 75, base: 62, startKm: 90 },
]

const stations = [
  { name: 'Rampur', km: 0 },
  { name: 'Hathgaon', km: 28 },
  { name: 'Devgarh', km: 54 },
  { name: 'Kalyan Nagar', km: 87 },
  { name: 'Sonpur Jn', km: 120 },
]

const SECTION_KM = 120
const HISTORY = 32
const GAUGE_MAX = 180

const seedHistory = (base: number) => Array.from({ length: HISTORY }, (_, i) => Math.round(base + Math.sin(i / 3) * 5))

export function SpeedTrackerSection() {
  const [trainNo, setTrainNo] = useState(trains[0].no)
  const [history, setHistory] = useState(() => seedHistory(trains[0].base))
  const [km, setKm] = useState(trains[0].startKm)
  const [paused, setPaused] = useState(false)

  const train = trains.find((t) => t.no === trainNo) ?? trains[0]

  // Demo feed: replace this with your real GPS/API data later
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setHistory((h) => {
        const last = h[h.length - 1]
        const drift = (train.base - last) * 0.15
        const next = Math.round(last + drift + (Math.random() * 12 - 5))
        return [...h.slice(1), Math.max(0, Math.min(train.limit + 12, next))]
      })
      setKm((k) => (k + train.base / 240) % SECTION_KM)
    }, 1000)
    return () => clearInterval(id)
  }, [paused, train])

  function selectTrain(no: string) {
    const t = trains.find((x) => x.no === no) ?? trains[0]
    setTrainNo(t.no)
    setHistory(seedHistory(t.base))
    setKm(t.startKm)
  }

  const speed = history[history.length - 1]
  const overSpeed = speed > train.limit
  const nextStation = stations.find((s) => s.km > km) ?? stations[stations.length - 1]
  const distance = Math.max(0, nextStation.km - km)
  const eta = speed > 0 ? Math.round((distance / speed) * 60) : null
  const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length)
  const gaugePct = Math.min(100, (speed / GAUGE_MAX) * 100)
  const limitPct = (train.limit / GAUGE_MAX) * 100

  return (
    <section id="speed" className="scroll-mt-6">
      <SectionHeading
        eyebrow="Real-time monitoring"
        title="Live speed tracker"
        description="Running speed of trains on the Rampur – Sonpur section against the permitted maximum speed. Over-speed events are highlighted for immediate action."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[18rem_1fr]">
        {/* Train list */}
        <GlassCard className="p-3 md:p-3">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select train</p>
          <ul className="flex flex-col gap-1.5">
            {trains.map((t) => (
              <li key={t.no}>
                <button
                  type="button"
                  onClick={() => selectTrain(t.no)}
                  aria-pressed={t.no === trainNo}
                  className={cn(
                    'flex w-full flex-col rounded-xl px-3 py-2.5 text-left transition-all duration-200',
                    t.no === trainNo ? '-translate-y-0.5 bg-white/80 shadow-md ring-1 ring-white' : 'hover:bg-white/50',
                  )}
                >
                  <span className="text-sm font-semibold">
                    {t.no} · {t.name}
                  </span>
                  <span className="text-xs text-muted-foreground">MPS {t.limit} km/h</span>
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-serif text-xl font-semibold">
                {train.no} · {train.name}
              </p>
              <p className="text-sm text-muted-foreground">Demo feed · updates every second</p>
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/80"
            >
              {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
              {paused ? 'Resume feed' : 'Pause feed'}
            </button>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,16rem)_1fr] md:items-center">
            {/* Speed dial */}
            <div className="relative mx-auto w-full max-w-64">
              <svg viewBox="0 0 200 118" className="w-full" role="img" aria-label={`Current speed ${speed} kilometres per hour`}>
                <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" pathLength={100} className="text-foreground/10" />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={`${gaugePct} 100`}
                  className={cn('transition-all duration-700', overSpeed ? 'text-destructive' : 'text-primary')}
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="20"
                  pathLength={100}
                  strokeDasharray={`0.6 ${limitPct - 0.6} 0.6 100`}
                  strokeDashoffset={-0.3}
                  className="text-foreground/70"
                />
                <text x="100" y="86" textAnchor="middle" className="fill-foreground font-serif text-[36px] font-semibold tabular-nums">
                  {speed}
                </text>
                <text x="100" y="106" textAnchor="middle" className="fill-muted-foreground text-[11px]">
                  km/h
                </text>
              </svg>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {[
                { label: 'Permitted (MPS)', value: `${train.limit} km/h` },
                { label: 'Average (last 32s)', value: `${avg} km/h` },
                { label: 'Next station', value: nextStation.name },
                { label: 'Distance / ETA', value: `${distance.toFixed(1)} km · ${eta ?? '–'} min` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/60 bg-white/50 p-3">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Over-speed warning */}
          <div aria-live="polite">
            {overSpeed && (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
                <AlertTriangle className="size-4" aria-hidden="true" />
                Over-speed: running {speed - train.limit} km/h above permitted limit
              </p>
            )}
          </div>

          {/* Trend bars */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Speed trend</p>
            <div className="mt-2 flex h-20 items-end gap-1" aria-hidden="true">
              {history.map((v, i) => (
                <div
                  key={i}
                  className={cn('flex-1 rounded-t-sm transition-all duration-500', v > train.limit ? 'bg-destructive/70' : 'bg-primary/60')}
                  style={{ height: `${(v / GAUGE_MAX) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Route position */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Section position</p>
            <div className="relative mt-4 h-1.5 rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-primary/50 transition-all duration-700" style={{ width: `${(km / SECTION_KM) * 100}%` }} />
              {stations.map((s) => (
                <span
                  key={s.name}
                  className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-foreground/40"
                  style={{ left: `${(s.km / SECTION_KM) * 100}%` }}
                />
              ))}
              <span
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-md transition-all duration-700"
                style={{ left: `${(km / SECTION_KM) * 100}%` }}
                aria-label={`Train at kilometre ${km.toFixed(1)}`}
              />
            </div>
            <ul className="mt-3 flex justify-between text-[11px] text-muted-foreground">
              {stations.map((s) => (
                <li key={s.name} className="text-center">
                  {s.name}
                  <span className="block tabular-nums">{s.km} km</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

/* =====================================================================
   3. OVERTAKE CALCULATOR
   ===================================================================== */

type Inputs = { slowSpeed: number; fastSpeed: number; headway: number; loopDistance: number; clearance: number }

const fields: { key: keyof Inputs; label: string; unit: string; min: number; max: number }[] = [
  { key: 'slowSpeed', label: 'Slow train average speed', unit: 'km/h', min: 10, max: 200 },
  { key: 'fastSpeed', label: 'Fast train average speed', unit: 'km/h', min: 10, max: 200 },
  { key: 'headway', label: 'Fast train running behind by', unit: 'min', min: 1, max: 120 },
  { key: 'loopDistance', label: 'Loop station distance ahead', unit: 'km', min: 1, max: 300 },
  { key: 'clearance', label: 'Required safety margin', unit: 'min', min: 0, max: 30 },
]

// All the maths lives here
function calculate({ slowSpeed, fastSpeed, headway, loopDistance, clearance }: Inputs) {
  if (fastSpeed <= slowSpeed) return null
  const leadKm = (slowSpeed * headway) / 60
  const catchHours = leadKm / (fastSpeed - slowSpeed)
  const catchKm = fastSpeed * catchHours
  const slowArrival = (loopDistance * 60) / slowSpeed - headway
  const fastArrival = (loopDistance * 60) / fastSpeed
  const margin = fastArrival - slowArrival
  const latestLoopKm = (headway - clearance) / (60 * (1 / slowSpeed - 1 / fastSpeed))
  const loopPassed = loopDistance < leadKm
  return {
    leadKm,
    catchKm,
    catchMinutes: catchHours * 60,
    margin,
    latestLoopKm: Math.max(0, latestLoopKm),
    detention: margin + 2,
    loopPassed,
    feasible: !loopPassed && margin >= clearance,
  }
}

const fmt = (n: number, d = 1) => n.toFixed(d)

export function OvertakeSection() {
  const [inputs, setInputs] = useState<Inputs>({ slowSpeed: 60, fastSpeed: 110, headway: 15, loopDistance: 20, clearance: 5 })
  const result = calculate(inputs)

  return (
    <section id="overtake" className="scroll-mt-6">
      <SectionHeading
        eyebrow="Precedence planning"
        title="Overtake calculator"
        description="Check whether a slower train can be placed on a loop line in time for a faster train to overtake, and how long it will be detained."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        {/* Inputs */}
        <GlassCard className="p-5 md:p-6">
          <h3 className="font-serif text-lg font-semibold">Input parameters</h3>
          <form className="mt-4 flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            {fields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{f.label}</span>
                <span className="flex items-center rounded-xl border border-white/70 bg-white/60 focus-within:ring-2 focus-within:ring-ring">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={f.min}
                    max={f.max}
                    value={inputs[f.key]}
                    onChange={(e) => setInputs((prev) => ({ ...prev, [f.key]: Number(e.target.value) || 0 }))}
                    className="w-full bg-transparent px-3 py-2.5 text-sm tabular-nums outline-none"
                  />
                  <span className="pr-3 text-sm text-muted-foreground">{f.unit}</span>
                </span>
              </label>
            ))}
          </form>
        </GlassCard>

        {/* Result */}
        <GlassCard className="p-5 md:p-6">
          <h3 className="font-serif text-lg font-semibold">Result</h3>

          {!result ? (
            <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
              Fast train speed must be higher than slow train speed for an overtake.
            </p>
          ) : (
            <>
              <div
                className={cn(
                  'mt-4 flex items-start gap-3 rounded-xl px-4 py-3',
                  result.feasible ? 'bg-emerald-600/10 text-emerald-800' : 'bg-destructive/10 text-destructive',
                )}
                aria-live="polite"
              >
                {result.feasible ? <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> : <XCircle className="mt-0.5 size-5 shrink-0" />}
                <div>
                  <p className="font-semibold">
                    {result.feasible
                      ? 'Overtake feasible at selected loop'
                      : result.loopPassed
                        ? 'Slow train has already passed this loop'
                        : 'Insufficient margin at selected loop'}
                  </p>
                  <p className="mt-0.5 text-sm opacity-90">
                    {result.feasible
                      ? `Slow train reaches the loop ${fmt(result.margin)} min before the fast train.`
                      : `Choose a loop within ${fmt(result.latestLoopKm)} km of the reference station.`}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Lead of slow train', value: `${fmt(result.leadKm)} km` },
                  { label: 'Catch-up point', value: `${fmt(result.catchKm)} km` },
                  { label: 'Time to catch up', value: `${fmt(result.catchMinutes)} min` },
                  { label: 'Margin at loop', value: `${fmt(result.margin)} min` },
                  { label: 'Latest usable loop', value: `${fmt(result.latestLoopKm)} km` },
                  { label: 'Loop detention (approx.)', value: result.feasible ? `${fmt(result.detention)} min` : '–' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/60 bg-white/50 p-3">
                    <dt className="text-xs text-muted-foreground">{s.label}</dt>
                    <dd className="mt-0.5 font-semibold tabular-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>

              <details className="mt-4 rounded-xl border border-white/60 bg-white/40 px-4 py-3 text-sm">
                <summary className="cursor-pointer font-medium">Method of calculation</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Lead distance = slow speed × headway ÷ 60</li>
                  <li>Catch-up time = lead distance ÷ (fast speed − slow speed)</li>
                  <li>Margin = fast train arrival at loop − slow train arrival at loop</li>
                  <li>Detention includes a 2 min restart allowance after the fast train clears</li>
                </ul>
              </details>
            </>
          )}
        </GlassCard>
      </div>
    </section>
  )
}
