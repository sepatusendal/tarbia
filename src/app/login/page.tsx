import Image from "next/image"

import { GithubIcon, InstagramIcon } from "@/components/icons/brand-icons"
import { LoginBackground } from "./login-background"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-[100dvh] text-black">
      <LoginBackground />

      {/* Desktop top-left brand mark */}
      <div
        className="login-animate-item absolute top-8 left-8 hidden items-center gap-2 sm:flex"
        style={{ animationDelay: "0ms" }}
      >
        <Image
          src="/logo-icon.png"
          alt="Tarbia"
          width={22}
          height={24}
          unoptimized
        />
        <span className="text-sm font-semibold tracking-wide">TARBIA</span>
      </div>

      {/* Desktop top-right quote */}
      <div
        className="login-animate-item absolute top-8 right-8 hidden max-w-[240px] text-right sm:block"
        style={{ animationDelay: "80ms" }}
      >
        <p className="text-2xl leading-none text-black/20">&ldquo;</p>
        <p className="-mt-2 text-sm leading-relaxed text-black/60">
          Every step you take today shapes your better tomorrow.
        </p>
        <div className="mt-2 ml-auto h-px w-8 bg-black/20" />
      </div>

      {/* Content column: on mobile, logo / card / quote all flow normally so they
          can never overlap, regardless of real device viewport height (browser
          chrome, safe areas, etc). On desktop only the card is visible here. */}
      <div className="flex min-h-[100dvh] flex-col items-center justify-between gap-6 px-4 py-8 sm:justify-center sm:gap-0 sm:py-4 sm:items-end sm:pr-[7%] md:pr-[11%]">
        {/* Mobile top logo + tagline (outside card) */}
        <div
          className="login-animate-item flex flex-col items-center sm:hidden"
          style={{ animationDelay: "0ms" }}
        >
          <Image
            src="/logo-full.png"
            alt="Tarbia — Every step matters."
            width={190}
            height={65}
            unoptimized
            priority
            className="h-auto w-[190px] drop-shadow-sm"
          />
        </div>

        <div className="w-full max-w-[420px]">
          <div
            className="login-animate-item overflow-hidden rounded-[32px] border border-white/50 bg-white/65 shadow-2xl shadow-black/10 backdrop-blur-xl"
            style={{ animationDelay: "160ms" }}
          >
            <div className="p-8 sm:p-10">
              <div className="mb-8 hidden justify-center sm:flex">
                <Image
                  src="/logo-full.png"
                  alt="Tarbia — Every step matters."
                  width={190}
                  height={65}
                  unoptimized
                  priority
                  className="h-auto w-[190px]"
                />
              </div>
              <LoginForm />
            </div>

            {/* Footer credit, inside the card */}
            <div className="flex flex-col items-center gap-2 border-t border-black/5 bg-black/[0.02] px-8 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-[11px] text-black/45">
                Dibuat untuk UPA Ash-Habul Kahfi · Cibitung, Kab. Bekasi
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-black/40">
                  built with ❤️ by wira
                </span>
                <div className="flex items-center gap-0.5">
                  <a
                    href="https://github.com/sepatusendal"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub wira"
                    className="flex size-6 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
                  >
                    <GithubIcon className="size-3.5" />
                  </a>
                  <a
                    href="https://instagram.com/wirarajaofficial"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram @wirarajaofficial"
                    className="flex size-6 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black/70"
                  >
                    <InstagramIcon className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom quote, over the fog */}
        <div
          className="login-animate-item max-w-[280px] text-center sm:hidden"
          style={{ animationDelay: "260ms" }}
        >
          <p className="text-sm leading-relaxed text-white/85">
            &ldquo;Grow together, one week at a time.&rdquo;
          </p>
          <div className="mx-auto mt-3 h-px w-8 bg-white/30" />
        </div>
      </div>
    </div>
  )
}
