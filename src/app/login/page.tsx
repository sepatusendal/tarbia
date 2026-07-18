import { LoginBackground } from "./login-background"
import { LoginCard } from "./login-card"
import { HeroSection } from "./hero-section"
import { FloatingQuote } from "./floating-quote"

export default function LoginPage() {
  return (
    <div className="relative min-h-[100dvh] text-black">
      <LoginBackground />

      {/* Mobile: card centered, hero hidden. Desktop: hero + card side by side */}
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-4 py-20 sm:flex-row sm:justify-between sm:gap-12 sm:px-10 sm:py-0 lg:px-20">
        <div className="hidden shrink-0 self-center sm:-mt-16 sm:ml-[16vw] sm:block lg:-mt-24 lg:ml-[20vw]">
          <HeroSection />
        </div>
        <LoginCard />
      </div>

      {/* Floating quote — desktop only, bottom-left. Hidden on mobile to avoid crowding the login card */}
      <div className="absolute bottom-8 left-10 hidden sm:block lg:left-20">
        <FloatingQuote />
      </div>
    </div>
  )
}
