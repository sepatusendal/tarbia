import { LogOut, Phone, Shield } from "lucide-react"

import { requireUser } from "@/lib/auth-helpers"
import { signOut } from "@/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookmarksSection } from "@/components/quran/bookmarks-section"

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  PENGURUS: "Pengurus",
  ANGGOTA: "Anggota",
}

export default async function ProfilePage() {
  const user = await requireUser()
  const nama = user.name ?? user.nomorHp
  const initials = nama
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="grid gap-6 pb-4">
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <Avatar className="size-20 text-xl">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xl font-semibold">{nama}</p>
          <p className="text-muted-foreground text-sm">
            {roleLabel[user.role] ?? user.role}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Phone className="size-4" />
            </span>
            <div>
              <p className="text-muted-foreground text-xs">Nomor HP</p>
              <p className="text-sm font-medium">{user.nomorHp}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Shield className="size-4" />
            </span>
            <div>
              <p className="text-muted-foreground text-xs">Peran</p>
              <p className="text-sm font-medium">
                {roleLabel[user.role] ?? user.role}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <BookmarksSection memberId={user.id} />

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/login" })
        }}
      >
        <Button
          type="submit"
          variant="destructive"
          className="h-12 w-full rounded-2xl"
        >
          <LogOut className="size-4" />
          Keluar
        </Button>
      </form>
    </div>
  )
}
