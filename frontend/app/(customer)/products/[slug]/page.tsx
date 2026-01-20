"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Minus, Plus, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RatingStars } from "@/components/ui/rating-stars"
import { ProductCard } from "@/components/product-card"
import { useStore } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { BACKEND_URL } from "@/lib/config"
import type { Product } from "@/data/mock"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, fetchProductBySlug, products } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      const data = await fetchProductBySlug(slug)
      if (data) {
        setProduct(data)
      }
      setLoading(false)
    }
    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  const productId = (product as any)._id || product.id
  const inWishlist = isInWishlist(productId)
  // Simple related products logic (mock for now or filter from loaded products)
  const relatedProducts = products.filter((p) => p.category === product.category && ((p as any)._id || p.id) !== productId).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push("/cart")
  }

  // Helper for Image Src
  const getImageUrl = (url?: string) => {
    if (!url) return "/placeholder.svg"
    return url.startsWith('http') ? url : `${BACKEND_URL}${url}`
  }

  // Mock reviews (Backend doesn't have reviews yet)
  const reviews = [
    {
      id: 1,
      user: "Sarah M.",
      rating: 5,
      date: "2024-02-15",
      comment: "Excellent quality! Exceeded my expectations.",
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(product.images?.[selectedImage])}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{product.discount}% OFF
                </Badge>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all",
                    selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50",
                  )}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-primary font-medium mb-1">{product.brand || "Generic"}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{product.title}</h1>
              <div className="flex items-center gap-4">
                <RatingStars rating={product.rating || 0} showCount count={product.reviewCount || 0} />
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Save ₹{(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", product.stock > 0 ? "bg-success" : "bg-destructive")} />
              <span className={cn("font-medium", product.stock > 0 ? "text-success" : "text-destructive")}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-1 gap-3">
                <Button className="flex-1 gap-2" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => (inWishlist ? removeFromWishlist(productId) : addToWishlist(product))}
                >
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-destructive text-destructive")} />
                </Button>
              </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={handleBuyNow} disabled={product.stock === 0}>
              Buy Now
            </Button>

            {/* Seller Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sold by</p>
                  <p className="font-medium text-foreground">{(product.seller as any)?.storeName || "Verified Seller"}</p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Free Delivery</p>
                  <p className="text-muted-foreground">Estimated delivery: 3-5 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Easy Returns</p>
                  <p className="text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Secure Payment</p>
                  <p className="text-muted-foreground">100% protected transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.reviewCount || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Product Details</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Brand: {product.brand || "Generic"}</li>
                      <li>Category: {product.category}</li>
                      <li>Tags: {product.tags?.join(", ") || "None"}</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Shipping Information</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>Free shipping on orders over ₹5000</li>
                      <li>Standard delivery: 3-5 business days</li>
                      <li>Express delivery available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="pt-6">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Reviews List */}
                <div className="md:col-span-2 space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review: any) => (
                      <div key={review._id} className="border-b pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                              {review.userAvatar ? (
                                <Image src={getImageUrl(review.userAvatar)} alt={review.name} width={40} height={40} className="object-cover" />
                              ) : (
                                <span className="font-medium text-foreground">{review.name ? review.name[0].toUpperCase() : 'U'}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{review.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <RatingStars rating={review.rating} size="sm" />
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="md:col-span-1">
                  <div className="bg-card border rounded-lg p-6 sticky top-24">
                    <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                    {/* We need to check if user is authenticated */}
                    {/* Importing useStore at top level, but using inline check here for simplicity if needed, or better pass props */}
                    {/* Since this is a client component, we use useStore() */}
                    <ReviewForm productId={(product as any)._id || product.id} onReviewAdded={() => {
                      // Ideally refresh product
                      const loadProduct = async () => {
                        // Re-fetch product logic here or trigger parent reload
                        // For now, we rely on page refresh or parent re-fetch if we lift state
                        window.location.reload();
                      }
                      loadProduct();
                    }} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={(p as any)._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewForm({ productId, onReviewAdded }: { productId: string, onReviewAdded: () => void }) {
  const { isAuthenticated, addProductReview } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">Please sign in to write a review.</p>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full">Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await addProductReview(productId, rating, comment);
    if (success) {
      setComment("");
      setRating(5);
      onReviewAdded();
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={cn(
                "text-2xl transition-colors",
                star <= rating ? "text-yellow-400" : "text-muted"
              )}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          required
          className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm"
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
