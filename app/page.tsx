import Image from 'next/image'
import { SideNav } from '@/components/side-nav'
import { TopBar, Reveal } from '@/components/shared'
import { Hero, HelpdeskSection } from '@/components/home-sections'
import { ScheduleSection, SpeedTrackerSection, OvertakeSection } from '@/components/railway-tools'

export default function Page() {
  return (
    <div className="relative min-h-svh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* Background train photo + cream overlay */}
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <Image src="/images/train-hero.png" alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-secondary/65" />
      </div>

      <SideNav />

      {/* lg:ml-[19.5rem] leaves room for the nav bar on desktop */}
      <main id="main" className="px-4 pb-8 pt-20 md:px-8 lg:ml-[19.5rem] lg:pt-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-20">
          <div>
            <TopBar />
            <Hero />
          </div>
          <Reveal>
            <ScheduleSection />
          </Reveal>
          <Reveal>
            <SpeedTrackerSection />
          </Reveal>
          <Reveal>
            <OvertakeSection />
          </Reveal>
          <Reveal>
            <HelpdeskSection />
          </Reveal>
        </div>
      </main>
    </div>
  )
}
