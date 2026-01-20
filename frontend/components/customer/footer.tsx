import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl">VaultHub</span>
            </div>
            <p className="text-background/70 text-sm mb-4">
              Your trusted multi-vendor marketplace for quality products from verified sellers worldwide.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background/10 rounded-full hover:bg-background/20 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link href="/products" className="hover:text-background transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:text-background transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="hover:text-background transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-living" className="hover:text-background transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-background transition-colors">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-background/70 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button className="shrink-0">Subscribe</Button>
            </div>
            <div className="mt-6 space-y-2 text-sm text-background/70">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@vaulthub.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> New York, NY 10001
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">© 2026 VaultHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-background/70">
            <Link href="#" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
