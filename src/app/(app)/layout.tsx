import Link from "next/link"
import Image from "next/image"

import { requireUser } from "@/lib/auth-helpers"
import { NavLinks } from "@/components/layout/nav-links"
import { UserMenu } from "@/components/layout/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/layout/site-footer"
import { SocialLinks } from "@/components/layout/social-links"
import { BottomNav } from "@/components/layout/bottom-nav"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar md:sticky md:top-0 md:flex md:h-dvh md:flex-col">
        <div className="flex h-24 items-center px-7">
          <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <Image
              src="/logo-icon.png"
              alt="Tarbia"
              width={35}
              height={38}
              className="dark:invert"
              unoptimized
              priority
            />
            Tarbia
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">Ruang kerja</p>
          <NavLinks />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-border/70 bg-background/75 px-5 backdrop-blur-md md:h-24 md:px-10">
          <Link href="/dashboard" className="md:hidden">
            <Image
              src="/logo-full.png"
              alt="Tarbia"
              width={100}
              height={34}
              className="h-7 w-auto dark:invert"
              unoptimized
              priority
            />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden md:block">
              <UserMenu nama={user.name ?? user.nomorHp} role={user.role} />
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 pb-28 md:px-10 md:py-10 md:pb-8">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
            <div className="flex-1">{children}</div>
            <div className="hidden md:block">
              <SiteFooter />
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
      <div className="hidden md:block">
        <SocialLinks />
      </div>
    </div>
  )
}
