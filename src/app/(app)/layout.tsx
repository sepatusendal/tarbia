import Link from "next/link"
import Image from "next/image"

import { requireUser } from "@/lib/auth-helpers"
import { NavLinks } from "@/components/layout/nav-links"
import { UserMenu } from "@/components/layout/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { SiteFooter } from "@/components/layout/site-footer"
import { SocialLinks } from "@/components/layout/social-links"
import { BottomNav } from "@/components/layout/bottom-nav"
import { FloatingQuickAction } from "@/components/layout/floating-quick-action"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireUser()

  return (
    <div className="flex min-h-screen flex-1">
      <aside className="hidden w-64 shrink-0 bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <Image
              src="/logo-icon.png"
              alt="Tarbia"
              width={32}
              height={35}
              className="dark:invert"
              unoptimized
              priority
            />
            Tarbia
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <NavLinks />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard" className="md:hidden">
            <Image
              src="/logo-full.png"
              alt="Tarbia"
              width={100}
              height={34}
              className="h-8 w-auto dark:invert"
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
        <main className="flex flex-1 flex-col overflow-y-auto p-4 pb-28 md:p-6 md:pb-6">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
            <div className="flex-1">{children}</div>
            <div className="hidden md:block">
              <SiteFooter />
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
      <FloatingQuickAction />
      <div className="hidden md:block">
        <SocialLinks />
      </div>
    </div>
  )
}
