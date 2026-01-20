"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, Banknote, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useStore } from "@/store/use-store"
import { cn } from "@/lib/utils"
import { API_URL, BACKEND_URL } from "@/lib/config"
import type { Address, Order } from "@/data/mock"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart, addOrder, isAuthenticated, user } = useStore()
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>("address")

  const [address, setAddress] = useState<Address>({
    fullName: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const subtotal = getCartTotal()
  const shippingCost = deliveryOption === "express" ? 14.99 : subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const isAddressComplete = () => {
    return (
      address.fullName &&
      address.phone &&
      address.street &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.country
    )
  }

  const handlePlaceOrder = async () => {
    if (!isAddressComplete()) {
      setExpandedSection("address")
      return
    }

    setIsProcessing(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Construct order object compatible with store payload
    const orderPayload: any = {
      items: cart,
      shippingAddress: address,
      paymentMethod: paymentMethod === "online" ? "Online Payment" : "Cash On Delivery",
      total: total
    }

    const createdOrder = await addOrder(orderPayload)

    if (createdOrder) {
      clearCart()
      router.push(`/orders/${createdOrder._id}`)
    } else {
      setIsProcessing(false) // Stop loading if failed
    }
  }

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart")
    }
  }, [cart, router])

  if (cart.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Address Section */}
          <Section
            id="address"
            title="Shipping Address"
            number={1}
            isComplete={!!isAddressComplete()}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={address.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, Apt 4B"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={address.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={address.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className="mt-1"
                />
              </div>
            </div>
          </Section>

          {/* Delivery Options */}
          <Section
            id="delivery"
            title="Delivery Options"
            number={2}
            isComplete={!!deliveryOption}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption} className="space-y-3">
              <label
                htmlFor="standard"
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                  deliveryOption === "standard" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Standard Delivery</p>
                      <p className="text-sm text-muted-foreground">3-5 business days</p>
                    </div>
                  </div>
                </div>
                <span className="font-medium text-foreground">{subtotal > 50 ? "Free" : "$9.99"}</span>
              </label>
              <label
                htmlFor="express"
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors",
                  deliveryOption === "express" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="express" id="express" />
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Express Delivery</p>
                      <p className="text-sm text-muted-foreground">1-2 business days</p>
                    </div>
                  </div>
                </div>
                <span className="font-medium text-foreground">$14.99</span>
              </label>
            </RadioGroup>
          </Section>

          {/* Payment Method */}
          <Section
            id="payment"
            title="Payment Method"
            number={3}
            isComplete={!!paymentMethod}
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          >
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              <label
                htmlFor="online"
                className={cn(
                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                  paymentMethod === "online" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                )}
              >
                <RadioGroupItem value="online" id="online" />
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Online Payment</p>
                  <p className="text-sm text-muted-foreground">Pay with card, UPI, or net banking</p>
                </div>
              </label>
              <label
                htmlFor="cod"
                className={cn(
                  "flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                  paymentMethod === "cod" ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                )}
              >
                <RadioGroupItem value="cod" id="cod" />
                <Banknote className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Cash On Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                </div>
              </label>
            </RadioGroup>
          </Section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

            {/* Items Preview */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={(item.product as any)._id || item.product.id || `${item.product.slug}-${Math.random()}`} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image
                      src={
                        item.product.images[0].startsWith('http')
                          ? item.product.images[0]
                          : `${BACKEND_URL}${item.product.images[0].startsWith('/') ? '' : '/'}${item.product.images[0]}`
                      }
                      alt={item.product.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.title}</p>
                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="text-foreground">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6" onClick={handlePlaceOrder} disabled={isProcessing || !isAddressComplete()}>
              {isProcessing ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const Section = ({
  id,
  title,
  number,
  children,
  isComplete,
  expandedSection,
  setExpandedSection,
}: {
  id: string
  title: string
  number: number
  children: React.ReactNode
  isComplete?: boolean
  expandedSection: string | null
  setExpandedSection: (id: string | null) => void
}) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      onClick={() => setExpandedSection(expandedSection === id ? null : id)}
      className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            isComplete ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground",
          )}
        >
          {isComplete ? <Check className="h-4 w-4" /> : number}
        </div>
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <ChevronDown
        className={cn("h-5 w-5 text-muted-foreground transition-transform", expandedSection === id && "rotate-180")}
      />
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        expandedSection === id ? "max-h-[1000px]" : "max-h-0",
      )}
    >
      <div className="p-4 border-t bg-card">{children}</div>
    </div>
  </div>
)
