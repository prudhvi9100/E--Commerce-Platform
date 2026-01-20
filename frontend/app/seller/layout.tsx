import type React from "react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { SellerTopbar } from "@/components/seller/seller-topbar"
import { ToastNotification } from "@/components/ui/toast-notification"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SellerSidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <SellerTopbar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <ToastNotification />
    </div>
  )
}
