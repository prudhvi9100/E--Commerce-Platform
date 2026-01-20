import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: "confirmed" | "packed" | "shipped" | "delivered"
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusStyles = {
    confirmed: "bg-primary/10 text-primary border-primary/20",
    packed: "bg-warning/10 text-warning-foreground border-warning/20",
    shipped: "bg-secondary text-secondary-foreground border-secondary",
    delivered: "bg-success/10 text-success border-success/20",
  }

  const statusLabels = {
    confirmed: "Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
  }

  return (
    <span className={cn("px-2.5 py-1 text-xs font-medium rounded-full border", statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}
