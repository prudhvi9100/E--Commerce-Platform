import { Check, Package, Truck, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderTimelineProps {
  status: "confirmed" | "packed" | "shipped" | "delivered"
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const steps = [
    { id: "confirmed", label: "Order Confirmed", icon: Check },
    { id: "packed", label: "Packed", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
  ]

  const statusOrder = ["confirmed", "packed", "shipped", "delivered"]
  const currentIndex = statusOrder.indexOf(status)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted mx-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isComplete = index <= currentIndex
          const isCurrent = index === currentIndex
          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/20",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center font-medium",
                  isComplete ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
