"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/ui/rating-stars"
import { useStore } from "@/store/use-store"
import type { Product } from "@/data/mock"
import { cn } from "@/lib/utils"
import { BACKEND_URL } from "@/lib/config"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const productId = (product as any)._id || product.id
  const inWishlist = mounted ? isInWishlist(productId) : false

  return (
    <div className="group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images?.[0] ?
              (product.images[0].startsWith('http') ? product.images[0] : `${BACKEND_URL}${product.images[0]}`)
              : "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {product.discount && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded pointer-events-none">
            -{product.discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inWishlist) {
              removeFromWishlist(productId);
            } else {
              addToWishlist(product);
            }
          }}
          className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors z-10"
        >
          <Heart
            className={cn("h-4 w-4", inWishlist ? "fill-destructive text-destructive" : "text-muted-foreground")}
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.title}
          </h3>
        </Link>
        <div className="mb-3">
          <RatingStars rating={product.rating} showCount count={product.reviewCount} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <Button size="icon" variant="secondary" onClick={() => addToCart(product)} className="h-9 w-9">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div >
  )
}
