export interface Review {
  _id?: string
  user: string | { _id: string, name: string, avatar?: string }
  name: string
  rating: number
  comment: string
  userAvatar?: string
  createdAt: string
}

export interface Product {
  id: string
  _id?: string
  slug: string
  title: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  brand: string
  rating: number
  reviewCount: number
  stock: number
  images: string[]
  sellerId: string
  sellerName: string
  tags: string[]
  createdAt: string
  reviews?: Review[]
  seller?: { storeName: string }
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  productCount: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "customer" | "seller"
  avatar?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  _id?: string
  userId: string
  items: CartItem[]
  status: "confirmed" | "packed" | "shipped" | "delivered"
  total: number
  shippingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export const categories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", icon: "Smartphone", productCount: 245 },
  { id: "2", name: "Fashion", slug: "fashion", icon: "Shirt", productCount: 523 },
  { id: "3", name: "Home & Living", slug: "home-living", icon: "Home", productCount: 187 },
  { id: "4", name: "Sports", slug: "sports", icon: "Dumbbell", productCount: 156 },
  { id: "5", name: "Books", slug: "books", icon: "BookOpen", productCount: 342 },
  { id: "6", name: "Beauty", slug: "beauty", icon: "Sparkles", productCount: 278 },
  { id: "7", name: "Toys", slug: "toys", icon: "Gamepad2", productCount: 134 },
  { id: "8", name: "Grocery", slug: "grocery", icon: "ShoppingBasket", productCount: 456 },
]

export const products: Product[] = [
  {
    id: "1",
    slug: "wireless-bluetooth-headphones",
    title: "Premium Wireless Bluetooth Headphones",
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and comfortable over-ear design.",
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    category: "electronics",
    brand: "AudioTech",
    rating: 4.5,
    reviewCount: 234,
    stock: 50,
    images: ["/premium-black-wireless-headphones.jpg", "/headphones-side-view.png", "/headphones-with-case.png"],
    sellerId: "seller1",
    sellerName: "TechZone Store",
    tags: ["wireless", "bluetooth", "noise-cancelling"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    slug: "smart-fitness-watch",
    title: "Smart Fitness Watch Pro",
    description:
      "Track your fitness goals with precision. Heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50 meters.",
    price: 249.99,
    originalPrice: 299.99,
    discount: 17,
    category: "electronics",
    brand: "FitGear",
    rating: 4.7,
    reviewCount: 512,
    stock: 35,
    images: ["/smart-fitness-watch-black.jpg", "/smartwatch-on-wrist.png", "/fitness-watch-features.png"],
    sellerId: "seller2",
    sellerName: "Fitness Hub",
    tags: ["fitness", "smartwatch", "health"],
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    slug: "organic-cotton-tshirt",
    title: "Premium Organic Cotton T-Shirt",
    description:
      "Sustainably made from 100% organic cotton. Soft, breathable, and perfect for everyday wear. Available in multiple colors.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "fashion",
    brand: "EcoWear",
    rating: 4.3,
    reviewCount: 89,
    stock: 200,
    images: ["/white-organic-cotton-tshirt.jpg", "/tshirt-fabric-detail.jpg", "/casual-tshirt-model.jpg"],
    sellerId: "seller3",
    sellerName: "Fashion Forward",
    tags: ["organic", "sustainable", "cotton"],
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    slug: "minimalist-desk-lamp",
    title: "Modern Minimalist Desk Lamp",
    description:
      "Elegant LED desk lamp with adjustable brightness and color temperature. USB charging port included. Perfect for home office or study.",
    price: 59.99,
    category: "home-living",
    brand: "LumiDesign",
    rating: 4.6,
    reviewCount: 167,
    stock: 75,
    images: ["/modern-minimalist-desk-lamp.jpg", "/desk-lamp-on-table.jpg", "/lamp-adjustable-arm.jpg"],
    sellerId: "seller1",
    sellerName: "TechZone Store",
    tags: ["lamp", "led", "home-office"],
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    slug: "yoga-mat-premium",
    title: "Premium Non-Slip Yoga Mat",
    description:
      "6mm thick eco-friendly yoga mat with superior grip. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.",
    price: 44.99,
    originalPrice: 54.99,
    discount: 18,
    category: "sports",
    brand: "ZenFit",
    rating: 4.8,
    reviewCount: 423,
    stock: 120,
    images: ["/purple-yoga-mat-rolled.jpg", "/yoga-mat-texture.jpg", "/yoga-mat-in-use.png"],
    sellerId: "seller2",
    sellerName: "Fitness Hub",
    tags: ["yoga", "fitness", "eco-friendly"],
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    slug: "bestseller-novel-collection",
    title: "Bestseller Novel Collection (5 Books)",
    description:
      "A curated collection of the year's best-selling fiction novels. Perfect for book lovers and gift-giving.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: "books",
    brand: "BookWorld",
    rating: 4.4,
    reviewCount: 78,
    stock: 45,
    images: ["/stack-of-novels.jpg", "/diverse-book-collection.png", "/reading-books.jpg"],
    sellerId: "seller4",
    sellerName: "Book Haven",
    tags: ["fiction", "bestseller", "collection"],
    createdAt: "2024-02-20",
  },
  {
    id: "7",
    slug: "skincare-essentials-kit",
    title: "Complete Skincare Essentials Kit",
    description:
      "Everything you need for a complete skincare routine. Includes cleanser, toner, serum, moisturizer, and SPF. Suitable for all skin types.",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    category: "beauty",
    brand: "GlowUp",
    rating: 4.6,
    reviewCount: 312,
    stock: 60,
    images: ["/skincare-products-kit.jpg", "/beauty-products-set.jpg", "/skincare-routine.jpg"],
    sellerId: "seller5",
    sellerName: "Beauty Bliss",
    tags: ["skincare", "beauty", "essentials"],
    createdAt: "2024-02-25",
  },
  {
    id: "8",
    slug: "building-blocks-set",
    title: "Creative Building Blocks Set (500 Pieces)",
    description:
      "Inspire creativity with this massive building blocks set. Compatible with major brands. Includes storage container.",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    category: "toys",
    brand: "BuildFun",
    rating: 4.7,
    reviewCount: 189,
    stock: 80,
    images: ["/colorful-building-blocks.png", "/kids-playing-blocks.jpg", "/block-creations.jpg"],
    sellerId: "seller6",
    sellerName: "Toy Kingdom",
    tags: ["toys", "building", "creative"],
    createdAt: "2024-03-01",
  },
  {
    id: "9",
    slug: "laptop-backpack-pro",
    title: "Professional Laptop Backpack",
    description:
      'Water-resistant backpack with dedicated laptop compartment (fits up to 15.6"). Multiple pockets, USB charging port, and ergonomic design.',
    price: 69.99,
    originalPrice: 89.99,
    discount: 22,
    category: "fashion",
    brand: "UrbanCarry",
    rating: 4.5,
    reviewCount: 267,
    stock: 90,
    images: ["/black-laptop-backpack.jpg", "/backpack-compartments.jpg", "/professional-backpack.jpg"],
    sellerId: "seller3",
    sellerName: "Fashion Forward",
    tags: ["backpack", "laptop", "travel"],
    createdAt: "2024-03-05",
  },
  {
    id: "10",
    slug: "wireless-phone-charger",
    title: "Fast Wireless Phone Charger",
    description:
      "15W fast wireless charging pad compatible with all Qi-enabled devices. LED indicator, compact design, includes USB-C cable.",
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    category: "electronics",
    brand: "ChargeTech",
    rating: 4.4,
    reviewCount: 534,
    stock: 150,
    images: ["/wireless-phone-charger.jpg", "/phone-on-charger.jpg", "/placeholder.svg?height=500&width=500"],
    sellerId: "seller1",
    sellerName: "TechZone Store",
    tags: ["charger", "wireless", "fast-charging"],
    createdAt: "2024-03-10",
  },
  {
    id: "11",
    slug: "ceramic-coffee-mug-set",
    title: "Handcrafted Ceramic Coffee Mug Set",
    description: "Set of 4 beautiful handcrafted ceramic mugs. Microwave and dishwasher safe. 12oz capacity each.",
    price: 39.99,
    category: "home-living",
    brand: "ArtisanHome",
    rating: 4.8,
    reviewCount: 156,
    stock: 40,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    sellerId: "seller7",
    sellerName: "Home Artisan",
    tags: ["mug", "ceramic", "handcrafted"],
    createdAt: "2024-03-15",
  },
  {
    id: "12",
    slug: "resistance-bands-set",
    title: "Professional Resistance Bands Set",
    description:
      "Complete set of 5 resistance bands with different resistance levels. Includes door anchor, handles, and carrying bag.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "sports",
    brand: "PowerFlex",
    rating: 4.6,
    reviewCount: 289,
    stock: 100,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    sellerId: "seller2",
    sellerName: "Fitness Hub",
    tags: ["fitness", "resistance", "workout"],
    createdAt: "2024-03-20",
  },
]

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "customer1",
    items: [
      { product: products[0], quantity: 1 },
      { product: products[9], quantity: 2 },
    ],
    status: "delivered",
    total: 199.97,
    shippingAddress: {
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    paymentMethod: "Online Payment",
    trackingNumber: "TRK123456789",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "ORD-002",
    userId: "customer1",
    items: [
      { product: products[2], quantity: 3 },
      { product: products[4], quantity: 1 },
    ],
    status: "shipped",
    total: 134.96,
    shippingAddress: {
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    paymentMethod: "Cash On Delivery",
    trackingNumber: "TRK987654321",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-20",
  },
  {
    id: "ORD-003",
    userId: "customer1",
    items: [{ product: products[1], quantity: 1 }],
    status: "packed",
    total: 249.99,
    shippingAddress: {
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    paymentMethod: "Online Payment",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-03",
  },
  {
    id: "ORD-004",
    userId: "customer1",
    items: [
      { product: products[6], quantity: 1 },
      { product: products[10], quantity: 1 },
    ],
    status: "confirmed",
    total: 129.98,
    shippingAddress: {
      fullName: "John Doe",
      phone: "+1 234 567 8900",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    paymentMethod: "Online Payment",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
  },
]

export const sellerOrders: Order[] = [
  ...mockOrders,
  {
    id: "ORD-005",
    userId: "customer2",
    items: [{ product: products[0], quantity: 2 }],
    status: "confirmed",
    total: 299.98,
    shippingAddress: {
      fullName: "Jane Smith",
      phone: "+1 234 567 8901",
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "United States",
    },
    paymentMethod: "Online Payment",
    createdAt: "2024-03-12",
    updatedAt: "2024-03-12",
  },
  {
    id: "ORD-006",
    userId: "customer3",
    items: [
      { product: products[3], quantity: 1 },
      { product: products[9], quantity: 3 },
    ],
    status: "shipped",
    total: 134.96,
    shippingAddress: {
      fullName: "Bob Wilson",
      phone: "+1 234 567 8902",
      street: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
    },
    paymentMethod: "Cash On Delivery",
    trackingNumber: "TRK456789123",
    createdAt: "2024-03-08",
    updatedAt: "2024-03-11",
  },
]

export const sellerAnalytics = {
  totalRevenue: 45678.9,
  totalOrders: 234,
  totalProducts: 45,
  conversionRate: 3.2,
  revenueChange: 12.5,
  ordersChange: 8.3,
  productsChange: 5,
  conversionChange: -0.5,
  salesData: [
    { date: "Jan", revenue: 4200, orders: 28 },
    { date: "Feb", revenue: 5100, orders: 35 },
    { date: "Mar", revenue: 4800, orders: 32 },
    { date: "Apr", revenue: 6200, orders: 41 },
    { date: "May", revenue: 5800, orders: 38 },
    { date: "Jun", revenue: 7100, orders: 48 },
    { date: "Jul", revenue: 6500, orders: 43 },
  ],
  topProducts: [
    { name: "Wireless Headphones", sales: 156, revenue: 23344 },
    { name: "Fitness Watch", sales: 98, revenue: 24499 },
    { name: "Desk Lamp", sales: 87, revenue: 5219 },
    { name: "Phone Charger", sales: 234, revenue: 5849 },
    { name: "Laptop Backpack", sales: 67, revenue: 4689 },
  ],
  categoryPerformance: [
    { category: "Electronics", sales: 45, percentage: 40 },
    { category: "Fashion", sales: 28, percentage: 25 },
    { category: "Home & Living", sales: 20, percentage: 18 },
    { category: "Sports", sales: 12, percentage: 10 },
    { category: "Others", sales: 8, percentage: 7 },
  ],
  lowStockProducts: [
    { id: "1", name: "Wireless Headphones", stock: 5 },
    { id: "4", name: "Desk Lamp", stock: 8 },
    { id: "6", name: "Novel Collection", stock: 3 },
  ],
}
