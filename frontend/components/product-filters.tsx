"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { categories } from "@/data/mock"
import { X } from "lucide-react"

interface ProductFiltersProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedRating: number
  setSelectedRating: (rating: number) => void
  inStockOnly: boolean
  setInStockOnly: (value: boolean) => void
  onClose?: () => void
}

export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  inStockOnly,
  setInStockOnly,
  onClose,
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange)
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setPriceRange([0, 500000])
    setLocalPriceRange([0, 500000])
    setSelectedRating(0)
    setInStockOnly(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Category</h4>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="text-sm font-normal cursor-pointer">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.slug} id={category.slug} />
              <Label htmlFor={category.slug} className="text-sm font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Price Range</h4>
        <Slider
          value={localPriceRange}
          onValueChange={handlePriceChange}
          max={500000}
          min={0}
          step={100}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>₹{localPriceRange[0]}</span>
          <span>₹{localPriceRange[1]}</span>
        </div>
        <Button variant="outline" size="sm" onClick={applyPriceFilter} className="w-full bg-transparent">
          Apply Price
        </Button>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Minimum Rating</h4>
        <RadioGroup value={selectedRating.toString()} onValueChange={(v) => setSelectedRating(Number(v))}>
          {[0, 4, 3, 2].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer">
                {rating === 0 ? "All Ratings" : `${rating}+ Stars`}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm text-foreground">Availability</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  )
}
