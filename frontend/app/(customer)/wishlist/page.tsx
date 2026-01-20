"use client"

import Link from "next/link"
import { Heart, ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/store/use-store"

export default function WishlistPage() {
  const { wishlist, addToCart, removeFromWishlist, clearCart } = useStore()

  const addAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1)
    })
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start adding items you love to your wishlist by clicking the heart icon on products.
          </p>
          <Link href="/products">
            <Button className="gap-2">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} items saved</p>
        </div>
        <Button onClick={addAllToCart} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add All to Cart
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={(product as any)._id || product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
