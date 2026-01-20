"use client"

import { use, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Phone, CreditCard, Truck, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrderStatusBadge } from "@/components/ui/order-status-badge"
import { OrderTimeline } from "@/components/order-timeline"
import { useStore } from "@/store/use-store"
import { BACKEND_URL } from "@/lib/config"
import { useState } from "react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const { orders, fetchOrderById } = useStore()
  const [copied, setCopied] = useState(false)
  const [order, setOrder] = useState(orders.find((o) => o.id === id))

  useEffect(() => {
    const loadOrder = async () => {
      if (!order) {
        const fetchedOrder = await fetchOrderById(id)
        if (fetchedOrder) setOrder(fetchedOrder)
      }
    }
    loadOrder()
  }, [id, order, fetchOrderById])

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Loading Order...</h1>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = order.total - subtotal - subtotal * 0.08
  const tax = subtotal * 0.08

  const copyTrackingNumber = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Order {order.id}</h1>
            <p className="text-muted-foreground">Placed on {order.createdAt}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Order Timeline */}
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Order Status</h2>
        <OrderTimeline status={order.status} />
        {order.trackingNumber && (
          <div className="mt-6 flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-medium text-foreground">{order.trackingNumber}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={copyTrackingNumber} className="gap-1">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg">
            <h2 className="text-lg font-semibold text-foreground p-4 border-b">Order Items ({order.items.length})</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4">
                  <Link href={`/products/${item.product.slug}`}>
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">


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
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                        {item.product.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">Sold by {item.product.sellerName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">₹{item.product.price.toFixed(2)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h3>
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
          </div>

          {/* Payment Method */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </h3>
            <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
          </div>

          {/* Order Total */}
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shipping <= 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
