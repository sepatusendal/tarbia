import { LoginBackground } from "./login-background"
import { LoginCard } from "./login-card"
import { HeroSection } from "./hero-section"
import { FloatingQuote } from "./floating-quote"

export default function LoginPage() {
  return (
    <div className="relative min-h-[100dvh] text-black">
      <LoginBackground />

      {/* Card-only up through tablet/landscape-phone widths — the hero
          copy + 420px card together need real desktop room (~1024px+).
          Between 640-900px (a phone in landscape, or a tablet) they used
          to collide and the card overflowed off-screen. */}
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-4 py-20 lg:flex-row lg:justify-between lg:gap-12 lg:px-20 lg:py-0">
        <div className="hidden shrink-0 self-center lg:-mt-24 lg:ml-[20vw] lg:block">
          <HeroSection />
        </div>
        <LoginCard />
      </div>

      {/* Floating quote — desktop only, bottom-left. Hidden below lg to avoid crowding the login card */}
      <div className="absolute bottom-8 left-20 hidden lg:block">
        <FloatingQuote />
      </div>
    </div>
  )
}
