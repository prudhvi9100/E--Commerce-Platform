"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, ArrowRight, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/ui/order-status-badge"
import { useStore } from "@/store/use-store"
import { API_URL, BACKEND_URL } from "@/lib/config"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function OrdersPage() {
  const { orders, isAuthenticated, fetchMyOrders } = useStore()
  const [reviewProduct, setReviewProduct] = useState<any | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders()
    }
  }, [isAuthenticated, fetchMyOrders])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view orders</h1>
          <p className="text-muted-foreground mb-8">Please sign in to view your order history.</p>
          <Link href="/auth/login">
            <Button className="gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">No orders yet</h1>
          <p className="text-muted-foreground mb-8">You haven't placed any orders yet. Start shopping!</p>
          <Link href="/products">
            <Button className="gap-2">
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <p className="text-muted-foreground">{orders.length} orders placed</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-card border rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/50 border-b">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-medium text-foreground">{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Date</p>
                  <p className="font-medium text-foreground">{order.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium text-foreground">₹{(order.total || 0).toFixed(2)}</p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Order Items */}
            <div className="p-4">
              <div className="flex flex-col gap-4 mb-4">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.product.id} className="flex gap-4 items-start border-b last:border-0 pb-4 last:pb-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={
                          item.product.images[0]
                            ? item.product.images[0].startsWith("http")
                              ? item.product.images[0]
                              : `${BACKEND_URL}${item.product.images[0].startsWith("/") ? "" : "/"}${item.product.images[0]}`
                            : "/placeholder.svg"
                        }
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium mt-1">₹{(item.product.price || 0).toFixed(2)}</p>
                        </div>
                        {order.status === 'delivered' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 flex-shrink-0"
                            onClick={() => setReviewProduct(item.product)}
                          >
                            <Star className="h-3 w-3" /> Rate & Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-center pt-2">
                    <span className="text-sm text-muted-foreground">+{order.items.length - 3} more items</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end pt-2">
                <Link href={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal
        product={reviewProduct}
        open={!!reviewProduct}
        onOpenChange={(open) => !open && setReviewProduct(null)}
      />
    </div>
  )
}

function ReviewModal({ product, open, onOpenChange }: { product: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addProductReview } = useStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    const productId = product._id || product.id;
    const success = await addProductReview(productId, rating, comment);
    setSubmitting(false);
    if (success) {
      setComment("");
      setRating(5);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate & Review</DialogTitle>
          <DialogDescription>
            {product.title}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 py-4">
          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
            <Image
              src={
                product.images && product.images[0]
                  ? product.images[0].startsWith("http")
                    ? product.images[0]
                    : `${BACKEND_URL}${product.images[0].startsWith("/") ? "" : "/"}${product.images[0]}`
                  : "/placeholder.svg"
              }
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Label>Your Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={cn(
                    "text-2xl transition-colors focus:outline-none",
                    star <= rating ? "text-yellow-400" : "text-muted-foreground/30"
                  )}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="comment">Write a review</Label>
          <Textarea
            id="comment"
            placeholder="What did you like or dislike?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
