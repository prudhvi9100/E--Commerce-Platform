"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, ChevronLeft, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useStore } from "@/store/use-store"

const navItems = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingCart },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/settings", label: "Settings", icon: Settings },
]

export function SellerSidebar() {
  const pathname = usePathname()
  const { logout, user } = useStore()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/seller") return pathname === "/seller"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-card border rounded-lg shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground z-50 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground font-bold">V</span>
                </div>
                <span className="font-semibold">Seller Hub</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCollapsed(!collapsed)
                setMobileOpen(false)
              }}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            {!collapsed ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{user?.name?.[0] || "S"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || "Seller"}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || "seller@email.com"}</p>
                </div>
              </div>
            ) : null}
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed ? "px-2" : "justify-start",
                )}
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-2">Logout</span>}
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
