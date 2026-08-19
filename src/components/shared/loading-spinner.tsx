"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { randomLoadingMessage } from "@/lib/loading-messages"
import { cn } from "@/lib/utils"

export function LoadingSpinner({
  size = "inline",
  className,
}: {
  size?: "page" | "inline"
  className?: string
}) {
  const [message] = useState(randomLoadingMessage)

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        size === "page" ? "min-h-[60vh] py-16" : "py-10",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={cn(
          "animate-spin text-primary",
          size === "page" ? "size-9" : "size-6"
        )}
      />
      <p
        className={cn(
          "max-w-64 text-muted-foreground",
          size === "page" ? "text-sm font-medium" : "text-xs"
        )}
      >
        {message}
      </p>
    </div>
  )
}
