"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Avoid SSR for DropdownMenu to fix hydration mismatch
import dynamic from 'next/dynamic'
const DropdownMenu = dynamic(() => import('@/components/ui/dropdown-menu').then(mod => mod.DropdownMenu), { ssr: false })
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/store/use-store"
import { categories } from "@/data/mock"
import { cn } from "@/lib/utils"

export function Header() {
  const { user, isAuthenticated, logout, getCartCount } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = getCartCount()

  return (
    <header className="sticky top-0 z-50 bg-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">VaultHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, brands, categories..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/products">
              <Button variant="ghost">Shop</Button>
            </Link>
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/products?category=${category.slug}`}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "seller" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/seller">Seller Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t bg-card overflow-hidden transition-all duration-300",
          mobileMenuOpen ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="container mx-auto px-4 py-4 space-y-2">
          <Link
            href="/products"
            className="block px-4 py-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(false)}
          >
            All Products
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span>Cart</span>
            {mounted && cartCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
            )}
          </Link>
          <Link
            href="/wishlist"
            className="block px-4 py-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(false)}
          >
            Wishlist
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(false)}
          >
            My Orders
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
