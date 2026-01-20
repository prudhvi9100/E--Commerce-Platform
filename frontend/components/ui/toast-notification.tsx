"use client"

import { useStore } from "@/store/use-store"
import { CheckCircle, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ToastNotification() {
  const { toast, hideToast } = useStore()

  if (!toast) return null

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-success" />,
    error: <XCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-primary" />,
  }

  const bgColors = {
    success: "bg-success/10 border-success/20",
    error: "bg-destructive/10 border-destructive/20",
    info: "bg-primary/10 border-primary/20",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg bg-card", bgColors[toast.type])}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium text-foreground">{toast.message}</p>
        <button onClick={hideToast} className="ml-2 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
