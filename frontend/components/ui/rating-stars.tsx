import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  showCount?: boolean
  count?: number
  size?: "sm" | "md" | "lg"
}

export function RatingStars({ rating, showCount = false, count, size = "md" }: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  const sizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn(sizes[size], "fill-warning text-warning")} />
        ))}
        {hasHalfStar && <StarHalf className={cn(sizes[size], "fill-warning text-warning")} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizes[size], "text-muted-foreground/30")} />
        ))}
      </div>
      {showCount && count !== undefined && <span className="text-sm text-muted-foreground">({count})</span>}
    </div>
  )
}
