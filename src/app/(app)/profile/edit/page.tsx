import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/auth-helpers"
import { ProfileForm } from "../profile-form"

export default async function EditProfilePage() {
  const user = await requireUser()

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Ubah Profil</h1>
        <p className="text-muted-foreground">Perbarui nama atau password kamu.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Data Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultNama={user.name ?? ""} />
        </CardContent>
      </Card>
    </div>
  )
}
