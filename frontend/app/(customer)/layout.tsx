import type React from "react"
import { Header } from "@/components/customer/header"
import { Footer } from "@/components/customer/footer"
import { ToastNotification } from "@/components/ui/toast-notification"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ToastNotification />
    </div>
  )
}
