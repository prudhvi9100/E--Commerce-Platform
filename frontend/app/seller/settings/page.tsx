"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useStore } from "@/store/use-store"

export default function SellerSettingsPage() {
  const { user, sellerProfile, fetchSellerProfile, updateSellerProfile } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const [storeSettings, setStoreSettings] = useState({
    storeName: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    returnPolicy: "",
  })

  useEffect(() => {
    fetchSellerProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sellerProfile) {
      setStoreSettings({
        storeName: sellerProfile.storeName || "",
        email: user?.email || "", // Email usually comes from User model, not Seller
        phone: sellerProfile.phone || "",
        description: sellerProfile.storeDescription || "",
        address: sellerProfile.address || "",
        returnPolicy: sellerProfile.returnPolicy || "",
      })
    }
  }, [sellerProfile, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setStoreSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    await updateSellerProfile({
      storeName: storeSettings.storeName,
      storeDescription: storeSettings.description,
      address: storeSettings.address,
      phone: storeSettings.phone,
      returnPolicy: storeSettings.returnPolicy
    })
    setIsLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              name="storeName"
              value={storeSettings.storeName}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={storeSettings.email}
              disabled
              className="mt-1 bg-muted"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={storeSettings.phone} onChange={handleInputChange} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address">Business Address</Label>
            <Input
              id="address"
              name="address"
              value={storeSettings.address}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              name="description"
              value={storeSettings.description}
              onChange={handleInputChange}
              className="mt-1 min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
          <CardDescription>Set your store policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="returnPolicy">Return Policy</Label>
            <Textarea
              id="returnPolicy"
              name="returnPolicy"
              value={storeSettings.returnPolicy}
              onChange={handleInputChange}
              className="mt-1 min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
