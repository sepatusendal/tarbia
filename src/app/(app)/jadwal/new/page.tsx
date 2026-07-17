import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/auth-helpers"
import { createMeeting } from "../actions"
import { MeetingForm } from "../meeting-form"

export default async function NewMeetingPage() {
  await requireRole(["ADMIN"])

  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Jadwal Baru</h1>
        <p className="text-muted-foreground">Buat jadwal pertemuan liqo.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Pertemuan</CardTitle>
        </CardHeader>
        <CardContent>
          <MeetingForm action={createMeeting} submitLabel="Buat Jadwal" />
        </CardContent>
      </Card>
    </div>
  )
}
