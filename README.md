# VaultHub - Multi-Vendor E-Commerce Platform

VaultHub is a full-featured multi-vendor e-commerce application built with the MERN stack (MongoDB, Express, React/Next.js, Node.js). It supports customers, sellers, and admins with a modern, responsive UI.

## 🚀 Live Demo
-   **Frontend (Store):** [https://e-commerce-platform-phi-pink.vercel.app](https://e-commerce-platform-phi-pink.vercel.app)
-   **Backend (API):** [https://e-commerce-platform-1-0q7h.onrender.com](https://e-commerce-platform-1-0q7h.onrender.com)

## Features

### 🛍️ Customer
-   **Browse & Search**: Advanced filtering by category, price, rating, and availability.
-   **Product Reviews**: Rate and review purchased products.
-   **Cart & Wishlist**: Persistent cart and wishlist functionality.
-   **Checkout**: Seamless checkout process with order tracking.
-   **User Dashboard**: Manage profile, view order history, and track status.

### 🏪 Seller
-   **Seller Dashboard**: Analytics for revenue, orders, and products.
-   **Product Management**: Add, update, and delete products.
-   **Order Management**: View and process customer orders.

### 🔐 Authentication & Security
-   Secure JWT-based authentication.
-   Role-based access control (Customer, Seller, Admin).
-   HttpOnly cookies for session security.

## Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI, Zustand (State Management).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose ODM).
-   **Authentication**: Passport.js (Local & OAuth).
-   **Email**: Nodemailer.

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd E-Commerce-Platform
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file based on your configuration
    npm start
    ```
    *The backend runs on http://localhost:5000*

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *The frontend runs on http://localhost:3000*

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
