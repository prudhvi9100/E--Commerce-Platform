"use client"

import { useEffect } from "react"
import { useStore } from "@/store/use-store"
import { DollarSign, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderStatusBadge } from "@/components/ui/order-status-badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SellerDashboard() {
  const { sellerStats, sellerOrders, fetchSellerStats, fetchSellerOrders } = useStore()

  useEffect(() => {
    fetchSellerStats()
    fetchSellerOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stats = [
    {
      title: "Total Revenue",
      value: sellerStats ? `₹${sellerStats.totalRevenue.toLocaleString()}` : "₹0",
      change: 0, // Pending backend implementation
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: sellerStats?.totalOrders || 0,
      change: 0,
      icon: ShoppingCart,
    },
    {
      title: "Total Products",
      value: sellerStats?.totalProducts || 0,
      change: 0,
      icon: Package,
    },
    {
      title: "Total Customers",
      value: sellerStats?.totalCustomers || 0,
      change: 0,
      icon: TrendingUp, // Changed from Conversion Rate to Customers
    },
  ]

  const recentOrders = sellerOrders.slice(0, 5)

  // Mock data for charts (Backend doesn't provide time-series yet)
  const mockSalesData = [
    { date: "Mon", revenue: 0 },
    { date: "Tue", revenue: 0 },
    { date: "Wed", revenue: 0 },
    { date: "Thu", revenue: 0 },
    { date: "Fri", revenue: 0 },
    { date: "Sat", revenue: 0 },
    { date: "Sun", revenue: 0 }
  ]

  const mockTopProducts = [
    { name: "No Data", sales: 0 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
        </div>
        <Link href="/seller/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change >= 0

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                {/* 
                <div className="flex items-center gap-1 text-xs mt-1">
                  ... (Change indicators temporarily hidden until backend supports it)
                </div> 
                */}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={120}
                    tickFormatter={(value) => (value.length > 15 ? `${value.slice(0, 15)}...` : value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/seller/orders">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{order._id.substring(0, 8)}...</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{order.user?.name || "Customer"}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">No orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
