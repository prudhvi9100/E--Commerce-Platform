"use client"

import React, { useEffect } from "react"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TrendingUp, Zap, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { categories } from "@/data/mock"
import { useStore } from "@/store/use-store"
import * as Icons from "lucide-react"

export default function HomePage() {
  const { products, fetchAllProducts } = useStore()

  useEffect(() => {
    fetchAllProducts()
  }, [])

  const trendingProducts = products.length > 0 ? products.slice(0, 4) : []
  const dealProducts = products.filter((p) => p.discount > 0).slice(0, 4)

  const getCategoryIcon = (iconName: string) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                New Arrivals Every Week
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Discover Products You'll Love
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Shop from thousands of verified sellers. Quality products, competitive prices, and fast delivery
                guaranteed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline">
                    Become a Seller
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">10K+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">500+</p>
                  <p className="text-sm text-muted-foreground">Sellers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">50K+</p>
                  <p className="text-sm text-muted-foreground">Customers</p>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative h-[500px] w-full">
                <Image
                  src="/hero-image.png"
                  alt="Shopping"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card border-y">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Free Shipping</p>
                <p className="text-sm text-muted-foreground">Orders over ₹5000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Secure Payment</p>
                <p className="text-sm text-muted-foreground">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Fast Delivery</p>
                <p className="text-sm text-muted-foreground">2-5 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Best Prices</p>
                <p className="text-sm text-muted-foreground">Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground">Browse our most popular categories</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-3 p-4 bg-card border rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <div className="p-4 bg-secondary rounded-full group-hover:bg-primary/10 transition-colors">
                {getCategoryIcon(category.icon)}
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground text-sm">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.productCount} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
              <p className="text-muted-foreground">Most popular products this week</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={(product as any)._id || product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Best Deals</h2>
            <p className="text-muted-foreground">Don't miss out on these amazing offers</p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={(product as any)._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Start Selling Today</h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of sellers and reach millions of customers. No setup fees, easy to use tools, and dedicated
              support.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Create Seller Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
