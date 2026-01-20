"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Phone, CreditCard, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/ui/order-status-badge"
import { OrderTimeline } from "@/components/order-timeline"
import { sellerOrders } from "@/data/mock"
import { useStore } from "@/store/use-store"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function SellerOrderDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { showToast } = useStore()

  const order = sellerOrders.find((o) => o.id === id)
  const [status, setStatus] = useState(order?.status || "confirmed")
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "")

  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
        <Link href="/seller/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const handleUpdateStatus = () => {
    showToast("Order status updated successfully!", "success")
  }

  const handleUpdateTracking = () => {
    showToast("Tracking number updated successfully!", "success")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/seller/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order {order.id}</h1>
            <p className="text-muted-foreground">Placed on {order.createdAt}</p>
          </div>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline status={status} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{item.product.title}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.product.id}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">₹{item.product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Order Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as "confirmed" | "packed" | "shipped" | "delivered")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateStatus} className="flex-1">
                  Update Status
                </Button>
                <Button onClick={handleUpdateTracking} variant="outline" className="flex-1 bg-transparent">
                  Save Tracking
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                <p className="flex items-center gap-1 text-muted-foreground mt-2">
                  <Phone className="h-3 w-3" />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{order.paymentMethod}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ₹{order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
