import { Plus } from "lucide-react"

import { QuickActionsSheet } from "./quick-actions-sheet"

export function FloatingQuickAction() {
  return (
    <div className="fixed bottom-[max(5.5rem,calc(4.75rem+env(safe-area-inset-bottom)))] left-4 z-40 md:hidden">
      <QuickActionsSheet
        trigger={
          <button
            type="button"
            aria-label="Aksi cepat"
            className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
          >
            <Plus className="size-6" />
          </button>
        }
      />
    </div>
  )
}
