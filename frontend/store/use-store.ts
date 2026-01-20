"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem, User, Order } from "@/data/mock"
import { mockOrders } from "@/data/mock"
import { API_URL } from "@/lib/config"

interface StoreState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: "customer" | "seller") => void
  logout: () => void
  signup: (name: string, email: string, password: string, role: "customer" | "seller") => void
  checkAuth: () => Promise<void>

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  fetchCart: () => Promise<void>

  // Wishlist
  wishlist: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean

  // Orders
  orders: Order[]
  addOrder: (order: Partial<Order>) => Promise<Order | null>
  fetchMyOrders: () => Promise<void>
  fetchOrderById: (id: string) => Promise<Order | null>

  // Toast
  toast: { message: string; type: "success" | "error" | "info" } | null
  showToast: (message: string, type: "success" | "error" | "info") => void
  hideToast: () => void

  // Seller Dashboard
  sellerProfile: any | null
  fetchSellerProfile: () => Promise<void>
  updateSellerProfile: (data: any) => Promise<void>
  sellerProducts: Product[]
  sellerOrders: Order[]
  sellerStats: {
    totalRevenue: number
    totalOrders: number
    totalProducts: number
    totalCustomers: number
  } | null
  fetchSellerProducts: () => Promise<void>
  fetchSellerOrders: () => Promise<void>
  fetchSellerStats: () => Promise<void>

  // Public Products
  products: Product[]
  fetchAllProducts: () => Promise<void>
  fetchProductBySlug: (slug: string) => Promise<Product | null>
  // Create fetchWishlist type definition in interface
  fetchWishlist: () => Promise<void>;
  addProductReview: (productId: string, rating: number, comment: string) => Promise<boolean>
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: async (email, password, role) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Important: Save cookie from response
          })
          const data = await res.json()

          if (!res.ok) throw new Error(data.message)

          set({ user: data, isAuthenticated: true })
          get().fetchWishlist();
          get().fetchCart();
          get().showToast(`Welcome back, ${data.name}!`, "success")
        } catch (error: any) {
          get().showToast(error.message || "Login failed", "error")
        }
      },
      logout: async () => {
        try {
          await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include", // Important: Clear cookie on server
          });
        } catch (error) {
          console.error("Logout failed", error);
        }
        set({ user: null, isAuthenticated: false })
        get().showToast("You have been logged out", "info")
      },
      signup: async (name, email, password, role) => {
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role }),
            credentials: "include", // Important: Save cookie from response
          })
          const data = await res.json()

          if (!res.ok) throw new Error(data.message)

          set({ user: data, isAuthenticated: true })
          get().showToast(`Welcome, ${data.name}! Your account has been created.`, "success")
        } catch (error: any) {
          get().showToast(error.message || "Signup failed", "error")
        }
      },
      checkAuth: async () => {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Important: Send cookies
            // Note: Credentials include happens automatically in browser if SameSite is strict/lax
          })

          if (res.ok) {
            const data = await res.json()
            console.log('[AuthDebug] checkAuth success:', data);
            set({ user: data, isAuthenticated: true })

            // Fetch wishlist
            get().fetchWishlist();
            get().fetchCart();

            // If user is seller, fetch their profile immediately
            if (data.role === 'seller') {
              console.log('[AuthDebug] User is seller, fetching profile...');
              await get().fetchSellerProfile();
            }
          } else {
            console.warn('[AuthDebug] checkAuth failed, status:', res.status);
            // If check fails (token expired), logout logic basically
            set({ user: null, isAuthenticated: false })
          }
        } catch (error) {
          console.error("[AuthDebug] Check Auth Network Error", error);
          set({ user: null, isAuthenticated: false })
        }
      },

      // Wishlist Helper
      fetchWishlist: async () => {
        try {
          const res = await fetch(`${API_URL}/wishlist`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            set({ wishlist: data });
          }
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      },
      // Cart
      cart: [],
      fetchCart: async () => {
        try {
          const res = await fetch(`${API_URL}/cart`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            // Transform backend cart (items inside) to frontend cart structure if needed
            // Backend returns: [{ _id, product: {...}, quantity, ... }] or items array?
            // Controller returns `validCart` which is `user.cart` array: [{ product: Object, quantity: Number, _id: ... }]
            // Frontend expects `CartItem[]`: { product: Product, quantity: number }

            // Map backend structure to frontend structure
            const formattedCart = data.map((item: any) => ({
              product: item.product,
              quantity: item.quantity
            }));
            set({ cart: formattedCart });
          }
        } catch (error) {
          console.error("Failed to fetch cart", error);
        }
      },
      addToCart: async (product, quantity = 1) => {
        const cart = get().cart;
        const productId = (product as any)._id || product.id;

        // Optimistic Update
        const existingItem = cart.find((item) => item.product.id === product.id);
        let newCart;

        if (existingItem) {
          newCart = cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          newCart = [...cart, { product, quantity }];
        }
        set({ cart: newCart });
        get().showToast(`${product.title} added to cart`, "success");

        try {
          await fetch(`${API_URL}/cart/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
            credentials: "include",
          });
          // We could generic re-fetch here to be safe, but optimistic is fine for now
          // get().fetchCart(); 
        } catch (error) {
          console.error("Failed to add to cart backend", error);
          // Revert on error would go here
        }
      },
      removeFromCart: async (productId) => {
        const previousCart = get().cart;
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
        get().showToast("Item removed from cart", "info");

        // Use _id if available, finding the product in previousCart to get the right backend ID if needed
        const productToRemove = previousCart.find(item => item.product.id === productId);
        const backendId = productToRemove ? ((productToRemove.product as any)._id || productId) : productId;

        try {
          await fetch(`${API_URL}/cart/remove/${backendId}`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (error) {
          console.error("Failed to remove from cart backend", error);
          set({ cart: previousCart }); // Revert
        }
      },
      updateQuantity: async (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const previousCart = get().cart;
        set({
          cart: get().cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        });

        // Find backend ID
        const productToUpdate = previousCart.find(item => item.product.id === productId);
        const backendId = productToUpdate ? ((productToUpdate.product as any)._id || productId) : productId;

        try {
          await fetch(`${API_URL}/cart/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: backendId, quantity }),
            credentials: "include",
          });
        } catch (error) {
          console.error("Failed to update cart quantity backend", error);
          set({ cart: previousCart }); // Revert
        }
      },
      clearCart: async () => {
        const previousCart = get().cart;
        set({ cart: [] });

        try {
          await fetch(`${API_URL}/cart/clear`, {
            method: "DELETE",
            credentials: "include",
          });
        } catch (error) {
          console.error("Failed to clear cart backend", error);
          set({ cart: previousCart });
        }
      },
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0)
      },

      // Wishlist
      wishlist: [],
      addToWishlist: async (product) => {
        const productId = (product as any)._id || product.id;
        const currentWishlist = get().wishlist || [];

        if (!get().isInWishlist(productId)) {
          // Optimistic Update
          set({ wishlist: [...currentWishlist, product] });
          get().showToast(`${product.title} added to wishlist`, "success");

          try {
            const res = await fetch(`${API_URL}/wishlist/add`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: productId }),
              credentials: 'include'
            });

            if (res.ok) {
              const updatedWishlist = await res.json();
              set({ wishlist: updatedWishlist });
            } else {
              // Revert if failed
              get().showToast("Failed to sync wishlist", "error");
            }
          } catch (err) {
            console.error(err);
          }
        }
      },
      removeFromWishlist: async (productId) => {
        // Optimistic Update
        const currentWishlist = get().wishlist || [];
        const previousWishlist = currentWishlist; // Save for revert

        set({
          wishlist: currentWishlist.filter((p) => {
            const pId = (p as any)._id || p.id;
            return pId !== productId;
          })
        });
        get().showToast("Item removed from wishlist", "info");

        // Only call API if ID is valid MongoDB ObjectId (24 hex chars)
        if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
          console.log("Skipping backend remove for non-mongo ID:", productId);
          return;
        }

        try {
          const res = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
          });

          if (res.ok) {
            const updatedWishlist = await res.json();
            set({ wishlist: updatedWishlist });
          } else {
            set({ wishlist: previousWishlist });
            get().showToast("Failed to remove from wishlist", "error");
          }
        } catch (err) {
          console.error(err);
          set({ wishlist: previousWishlist });
        }
      },
      isInWishlist: (productId) => {
        const currentWishlist = get().wishlist || [];
        return currentWishlist.some((p) => p.id === productId || (p as any)._id === productId)
      },

      // Orders
      orders: mockOrders,
      addOrder: async (order) => {
        try {
          // Prepare payload for backend
          const payload = {
            orderItems: order.items?.map((item) => ({
              product: (item.product as any)._id || item.product.id,
              title: item.product.title,
              quantity: item.quantity,
              image: item.product.images?.[0] || '/placeholder.svg',
              price: item.product.price
            })),
            shippingAddress: {
              fullName: order.shippingAddress?.fullName || "Guest",
              address: order.shippingAddress?.street || "No Address",
              city: order.shippingAddress?.city || "Unknown",
              postalCode: order.shippingAddress?.zipCode || "00000",
              country: order.shippingAddress?.country || "United States",
              phone: order.shippingAddress?.phone || "0000000000"
            },
            paymentMethod: order.paymentMethod || 'Online Payment',
            totalPrice: order.total
          };

          console.log('[StoreDebug] Sending Order Payload:', JSON.stringify(payload, null, 2));

          const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
          });

          if (res.ok) {
            const newOrder = await res.json();
            set({ orders: [newOrder, ...get().orders] });
            get().showToast("Order placed successfully!", "success");
            return newOrder; // Return for navigation
          } else {
            const err = await res.json();
            console.error('[StoreDebug] Order creation failed response:', err);
            get().showToast(err.message || "Failed to place order", "error");
            return null;
          }
        } catch (error) {
          console.error("Order creation failed", error);
          get().showToast("Network error while placing order", "error");
          return null;
        }
      },

      fetchMyOrders: async () => {
        try {
          const res = await fetch(`${API_URL}/orders/myorders`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            // Transform backend orders to frontend structure
            const formattedOrders = data.map((order: any) => ({
              id: order._id,
              userId: order.user,
              items: order.orderItems.map((item: any) => ({
                product: {
                  id: item.product?._id || item.product,
                  title: item.title,
                  price: item.price || 0,
                  images: [item.image],
                  slug: ''
                },
                quantity: item.quantity
              })),
              status: order.status,
              total: order.totalPrice || 0,
              shippingAddress: {
                fullName: order.shippingAddress.fullName,
                street: order.shippingAddress.address,
                city: order.shippingAddress.city,
                state: "",
                zipCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone
              },
              paymentMethod: order.paymentMethod,
              createdAt: new Date(order.createdAt).toLocaleDateString(),
              updatedAt: new Date(order.updatedAt).toLocaleDateString(),
              trackingNumber: order.trackingNumber
            }));
            set({ orders: formattedOrders });
          }
        } catch (error) {
          console.error("Failed to fetch orders", error);
        }
      },

      fetchOrderById: async (id: string) => {
        try {
          // Check if we already have it in state
          const existingOrder = get().orders.find(o => o.id === id);
          // We might want to re-fetch to get latest status, so we won't return early strictly
          // if (existingOrder) return existingOrder;

          const res = await fetch(`${API_URL}/orders/${id}`, { credentials: "include" });
          if (res.ok) {
            const orderData = await res.json();
            const formattedOrder = {
              id: orderData._id,
              userId: orderData.user._id || orderData.user,
              items: orderData.orderItems.map((item: any) => ({
                product: {
                  id: item.product?._id || item.product,
                  title: item.title,
                  price: item.price || 0,
                  images: [item.image],
                  slug: '',
                  sellerName: 'Unknown Seller'
                },
                quantity: item.quantity
              })),
              status: orderData.status,
              total: orderData.totalPrice || 0,
              shippingAddress: {
                fullName: orderData.shippingAddress.fullName,
                street: orderData.shippingAddress.address,
                city: orderData.shippingAddress.city,
                state: "",
                zipCode: orderData.shippingAddress.postalCode,
                country: orderData.shippingAddress.country,
                phone: orderData.shippingAddress.phone
              },
              paymentMethod: orderData.paymentMethod,
              createdAt: new Date(orderData.createdAt).toLocaleDateString(),
              updatedAt: new Date(orderData.updatedAt).toLocaleDateString(),
              trackingNumber: orderData.trackingNumber
            } as Order;

            // Update the specific order in the orders array if it exists
            const currentOrders = get().orders;
            const orderIndex = currentOrders.findIndex(o => o.id === id);
            if (orderIndex >= 0) {
              const updatedOrders = [...currentOrders];
              updatedOrders[orderIndex] = formattedOrder;
              set({ orders: updatedOrders });
            } else {
              set({ orders: [...currentOrders, formattedOrder] });
            }

            return formattedOrder;
          }
          return null;
        } catch (error) {
          console.error("Failed to fetch order", error);
          return null;
        }
      },

      // Toast
      toast: null,
      showToast: (message, type) => {
        set({ toast: { message, type } })
        setTimeout(() => get().hideToast(), 3000)
      },
      hideToast: () => set({ toast: null }),

      // Seller Dashboard Implementation
      sellerProfile: null,
      sellerProducts: [],
      sellerOrders: [],
      sellerStats: null,

      fetchSellerProfile: async () => {
        try {
          console.log('[AuthDebug] Fetching seller profile...');
          const res = await fetch(`${API_URL}/sellers/me`, {
            credentials: "include"
          });
          if (res.ok) {
            const data = await res.json();
            console.log('[AuthDebug] Seller profile fetched:', data);
            set({ sellerProfile: data });
          } else {
            console.warn('[AuthDebug] Failed to fetch seller profile:', res.status);
          }
        } catch (error) {
          console.error("Failed to fetch seller profile", error);
        }
      },

      updateSellerProfile: async (data) => {
        try {
          const res = await fetch(`${API_URL}/sellers/me`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include"
          });

          if (res.ok) {
            const updatedProfile = await res.json();
            set({ sellerProfile: updatedProfile });
            get().showToast("Profile updated successfully", "success");
          } else {
            throw new Error("Failed to update profile");
          }
        } catch (error) {
          get().showToast("Error updating profile", "error");
          console.error(error);
        }
      },

      fetchSellerProducts: async () => {
        try {
          const res = await fetch(`${API_URL}/products/seller`, {
            credentials: "include"
          });
          if (res.ok) {
            const data = await res.json();
            set({ sellerProducts: data });
          }
        } catch (error) {
          console.error("Failed to fetch seller products", error);
        }
      },

      fetchSellerOrders: async () => {
        try {
          const res = await fetch(`${API_URL}/orders/seller`, {
            credentials: "include"
          });
          if (res.ok) {
            const data = await res.json();
            set({ sellerOrders: data });
          }
        } catch (error) {
          console.error("Failed to fetch seller orders", error);
        }
      },

      fetchSellerStats: async () => {
        try {
          const res = await fetch(`${API_URL}/sellers/analytics`, {
            credentials: "include"
          });
          if (res.ok) {
            const data = await res.json();
            set({ sellerStats: data });
          }
        } catch (error) {
          console.error("Failed to fetch seller stats", error);
        }
      },

      // Public Products
      products: [],
      fetchAllProducts: async () => {
        try {
          const res = await fetch(`${API_URL}/products`);
          if (res.ok) {
            const data = await res.json();
            set({ products: data.products || data }); // Handle if backend returns { products: [...] } or just [...]
          }
        } catch (error) {
          console.error("Failed to fetch products", error);
        }
      },
      addProductReview: async (productId: string, rating: number, comment: string) => {
        try {
          const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating, comment }),
            credentials: 'include'
          });

          if (res.ok) {
            // Determine if we need to refresh the current product
            // Ideally, the caller will re-fetch, or we can update local state if we had a detailed product in state
            get().showToast("Review submitted successfully!", "success");
            return true;
          } else {
            const error = await res.json();
            get().showToast(error.message || "Failed to add review", "error");
            return false;
          }
        } catch (error) {
          console.error("Error submitting review:", error);
          get().showToast("Network error submitting review", "error");
          return false;
        }
      },

      fetchProductBySlug: async (slug) => {
        try {
          const res = await fetch(`${API_URL}/products/${slug}`);
          if (res.ok) {
            const data = await res.json();
            return data;
          }
          return null;
        } catch (error) {
          console.error("Failed to fetch product by slug", error);
          return null;
        }
      }
    }),
    {
      name: "marketplace-storage",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
