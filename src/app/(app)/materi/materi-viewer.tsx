import { FileText, PlayCircle, StickyNote } from "lucide-react"

// The primary use case is opening this mid-liqo on a phone, so the PDF
// button needs to be the biggest, least-missable thing on the screen —
// not a small inline text link buried next to everything else.
export function MateriViewer({
  judul,
  ringkasan,
  fileUrl,
  videoUrl,
  catatan,
}: {
  judul: string
  ringkasan: string | null
  fileUrl: string | null
  videoUrl: string | null
  catatan: string | null
}) {
  return (
    <div className="grid gap-4">
      <div>
        <p className="text-lg font-semibold">{judul}</p>
        {ringkasan && (
          <p className="mt-1 text-sm text-muted-foreground">{ringkasan}</p>
        )}
      </div>

      <div className="grid gap-2.5">
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 items-center gap-3 rounded-2xl bg-primary px-4 text-primary-foreground shadow-sm transition-opacity active:opacity-90"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
              <FileText className="size-4.5" />
            </span>
            <span className="flex-1 text-[15px] font-semibold">Buka PDF Materi</span>
          </a>
        )}
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4 transition-colors active:bg-muted/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <PlayCircle className="size-4.5" />
            </span>
            <span className="flex-1 text-[15px] font-medium">Tonton Video</span>
          </a>
        )}
      </div>

      {catatan && (
        <div className="grid gap-1.5 rounded-2xl bg-muted/60 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            <StickyNote className="size-3.5" />
            Catatan
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-line">{catatan}</p>
        </div>
      )}
    </div>
  )
}
