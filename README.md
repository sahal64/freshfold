# 🧺 FreshFold — Modern Doorstep Laundry & Operations Web App

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Mongoose-forestgreen.svg)](https://www.mongodb.com/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-v3-38bdf8.svg)](https://tailwindcss.com/)
[![Pricing](https://img.shields.io/badge/Currency-INR_(%E2%82%B9)-orange.svg)](#)
[![Security](https://img.shields.io/badge/Security-JWT_%2B_bcryptjs-crimson.svg)](#)

FreshFold is a full-stack MERN application built for on-demand doorstep laundry, dry cleaning, and store operations management. Designed with a **Clean Architecture** approach, it decouples business rules from Express transport routes and separates React presentation from API network calls.

All service rates and invoices are calculated and formatted in **Indian Rupees (₹)** (e.g., ₹79/kg, ₹119/kg, ₹1,299).

---

## 🌟 Key Application Features

### 👤 Customer-Facing (Zero Sign-Up Required)
1. **Responsive Landing Page**:
   - Modern hero section with trust badges (Free Pickup & Delivery, Antiseptic Wash, 24-48h Delivery).
   - Dynamic services showcase reading live plans from MongoDB with transparent INR (₹) rates.
   - One-click service selection that pre-fills and scrolls to the booking form.
2. **Pickup Order Booking Form**:
   - Customer name, 10-digit Indian mobile number validation (`+91` format), full address, and city/pincode.
   - Dynamic load estimator with real-time bill calculation in ₹.
   - Pickup date picker and scheduled time windows (Morning, Afternoon, Evening, Night).
   - Special care instructions field.
3. **Order Confirmation & Tracking ID Generation**:
   - Automatic generation of collision-resistant, human-friendly order IDs (e.g. `FF-2026-5759`).
   - Confirmation pop-up modal with an instant "Copy Tracking ID" button and order summary.
4. **Live Order Status Tracker**:
   - Quick search by tracking ID.
   - Interactive 6-stage visual pipeline:
     `Order Placed` ➔ `Pickup Scheduled` ➔ `In Wash & Care` ➔ `Steam Ironed` ➔ `Out for Delivery` ➔ `Delivered`
   - Real-time synchronization: when an admin advances a booking's status, the customer's tracking screen immediately reflects the update.

### 🛡️ Admin Operations Console (Password Hashed & JWT Protected)
1. **Secure Admin Sign-In**:
   - Dedicated authentication portal using `bcryptjs` password hashing and signed JWT Bearer tokens (24-hour validity).
   - Server-side route protection via `authMiddleware` (never relying merely on hiding React UI elements).
2. **Laundry Plan Management (CRUD)**:
   - Create, edit, toggle active/inactive, and delete laundry plans/services.
   - Configure plan name, description, price in INR (₹), pricing unit (`per kg`, `per piece`, `per pair`, `per item`), turnaround time, multi-line features, and "Most Popular" ribbon.
   - Changes immediately reflect on the public customer site.
   - **Snapshot Pricing Safety**: Modifying or deleting a plan never modifies past customer orders. Existing orders retain the exact service name and price that applied at booking time.
3. **Customer Bookings Dashboard**:
   - KPI metric cards: Total Orders, In-Progress Count, Delivered Count, Total Estimated Revenue in ₹.
   - Real-time search across Customer Name, Phone Number, Tracking ID, and Address.
   - Status filtering dropdown (`All Statuses`, `Placed`, `Pickup Scheduled`, `In Wash & Care`, `Steam Ironed`, `Out for Delivery`, `Delivered`).
   - Interactive status dropdown per order row that immediately updates MongoDB and propagates to the customer's tracking screen.

---

## 🏗️ Architecture & Project Structure

The project follows a lightweight **Clean Architecture** to ensure high maintainability, testability, and separation of concerns.

```text
freshfold/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection logic via Mongoose
│   │   ├── middleware/
│   │   │   └── authMiddleware.js   # JWT verification middleware protecting admin endpoints
│   │   ├── models/
│   │   │   ├── Admin.js            # Mongoose schema for Admin accounts (email, password hash)
│   │   │   ├── Order.js            # Mongoose schema for Orders (snapshot service, price, status)
│   │   │   └── Plan.js             # Mongoose schema for Plans (INR rates, units, active flag)
│   │   ├── services/
│   │   │   ├── authService.js      # Business rules for admin login, seeding, and JWT signing
│   │   │   ├── orderService.js     # Business rules for orders, tracking codes, and status updates
│   │   │   └── planService.js      # Business rules for plan CRUD and catalog seeding
│   │   ├── controllers/
│   │   │   ├── authController.js   # HTTP transport for admin login and profile
│   │   │   ├── orderController.js  # HTTP transport for customer & admin order operations
│   │   │   └── planController.js   # HTTP transport for public & admin plan operations
│   │   ├── routes/
│   │   │   ├── adminRoutes.js      # Protected admin endpoints (/api/admin/*)
│   │   │   ├── orderRoutes.js      # Public customer order endpoints (/api/orders/*)
│   │   │   └── planRoutes.js       # Public catalog endpoint (/api/plans)
│   │   └── server.js               # Express application bootstrap & route mounting
│   ├── .env.example                # Template with environment variable placeholders
│   ├── .env                        # Local active environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLogin.jsx      # Modal for admin credentials sign-in
│   │   │   │   ├── AdminDashboard.jsx  # Operations console (Bookings & Plans tabs)
│   │   │   │   └── PlanModal.jsx       # Modal for creating and editing laundry plans
│   │   │   ├── Navbar.jsx          # Header with logo, phone helpline, and Admin portal button
│   │   │   ├── Hero.jsx            # Hero banner with value proposition and CTAs
│   │   │   ├── Services.jsx        # Dynamic services grid showing live ₹ rates
│   │   │   ├── OrderForm.jsx       # Pickup booking form with validation and live INR estimates
│   │   │   ├── OrderModal.jsx      # Confirmation modal with tracking number & copy helper
│   │   │   ├── OrderStatus.jsx     # Live tracking timeline & search
│   │   │   ├── WhyUs.jsx           # Trust highlights & guarantees
│   │   │   └── Footer.jsx          # Operating hours, contacts, and Admin Portal link
│   │   ├── services/
│   │   │   └── api.js              # Centralized API client (auth headers, orders, plans)
│   │   ├── data/
│   │   │   └── servicesData.js     # Default fallback catalog & INR currency formatter
│   │   ├── App.jsx                 # Top-level state and customer/admin view orchestration
│   │   ├── index.css               # Tailwind directives and Google Font styling
│   │   └── main.jsx                # React root mount
│   ├── index.html                  # HTML template with meta descriptions & favicon
│   ├── tailwind.config.js          # Tailwind CSS custom palette & configuration
│   ├── vite.config.js              # Vite dev server with /api proxy to port 5000
│   └── package.json
│
├── .gitignore                      # Git ignore rules for node_modules, .env, and dist
└── README.md                       # Comprehensive documentation & interview guide
```

### Why Clean Architecture Matters Here
- **Decoupled Business Rules**: `orderService.js`, `planService.js`, and `authService.js` have **zero Express dependencies** (`req`, `res`). If the web framework is ever swapped or functions are executed via background tasks, the core business rules remain untouched.
- **Frontend Isolation**: `api.js` centralizes all HTTP communication. If authorization headers change, or if a backend URL prefix moves, updates happen in `api.js` without touching React components.
- **Order Snapshot Preservation**: When an administrator changes a plan's price from ₹79 to ₹99, previous bookings retain their original ₹79 price because `Order.js` stores static snapshot attributes rather than a fragile live database reference.

---

## 🔐 Admin Credentials & Environment Configuration

### Default Credentials
Upon initial boot, the backend automatically initializes an administrator account in MongoDB:
- **Admin Email**: `admin@freshfold.in`
- **Admin Password**: `FreshFold@Admin2026`

### Environment Variables (`backend/.env`)

Configure your environment settings in `backend/.env` (use `backend/.env.example` as a template):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/freshfold
CLIENT_URL=http://localhost:5173
JWT_SECRET=freshfold_super_secret_jwt_key_2026_dev
ADMIN_EMAIL=admin@freshfold.in
ADMIN_PASSWORD=FreshFold@Admin2026
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: v18.x or v20+ installed ([nodejs.org](https://nodejs.org/))
- **MongoDB**: Local MongoDB instance running on `127.0.0.1:27017` or a MongoDB Atlas connection string

---

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```
   > The server will start on port 5000, connect to MongoDB, seed the default admin account, and seed the initial laundry plans:
   > ```text
   > 🍃 MongoDB Connected: 127.0.0.1/freshfold
   > 👤 Admin account seeded: admin@freshfold.in
   > 🧺 Initial laundry service plans seeded successfully
   > 🚀 FreshFold Server listening on port 5000
   > ```

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > Vite will start on `http://localhost:5173`.

4. Open your browser at **`http://localhost:5173`**.

---

## 📖 How to Use the Application

### Customer Experience (Public)
1. **Browse Services**: Scroll through the Services grid to view current laundry offerings and rates in ₹ (e.g. Wash & Fold at ₹79/kg).
2. **Book a Pickup**:
   - Click **Select & Book** on any service to auto-select it in the booking form.
   - Enter your Full Name, 10-digit mobile number, address, and desired pickup time slot.
   - Observe the live estimated total bill in ₹.
   - Click **Schedule Pickup Now**.
3. **Save Tracking ID**:
   - A confirmation modal pops up with your order tracking number (e.g. `FF-2026-5759`). Click **Copy** to save it.
4. **Track Live Progress**:
   - Click **Track Live Status** or scroll down to the search box, enter your tracking number, and see the interactive 6-stage status tracker.

### Administrator Experience (Protected)
1. **Sign In**:
   - Click the **Admin** button in the header (or **Admin Operations Portal** in the footer).
   - Enter `admin@freshfold.in` and `FreshFold@Admin2026`.
2. **Manage Bookings**:
   - View all customer orders with pickup schedules, customer details, and price in ₹.
   - Use the status dropdown on any order to advance it (e.g., from `Pickup Scheduled` ➔ `In Wash & Care` ➔ `Steam Ironed` ➔ `Out for Delivery` ➔ `Delivered`).
   - Switch back to the customer site to verify that the customer's tracking page immediately displays the updated stage!
3. **Manage Plans & Rates**:
   - Switch to the **Plans & Pricing** tab.
   - Click **Create New Plan** to add a new service.
   - Click **Edit Plan** to adjust prices, turnaround times, or descriptions.
   - Click the **Active / Inactive** badge to instantly hide or show a plan on the public website.

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api` (or `/api` via Vite dev proxy)

### 1. Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime and health check |
| `GET` | `/plans` | Fetch all active laundry plans for public website |
| `POST` | `/orders` | Submit a new customer pickup order |
| `GET` | `/orders/:trackingId` | Look up live order details and status timeline by tracking code |

#### Example: Create Pickup Order (`POST /api/orders`)
```json
{
  "customerName": "Aarav Patel",
  "phone": "9812345678",
  "address": "402 Sunshine Apts, 12th Main, Indiranagar, Bengaluru - 560038",
  "service": "Premium Dry Cleaning",
  "serviceId": "dry-clean",
  "quantity": 3,
  "unit": "per piece",
  "estimatedPrice": 597,
  "pickupDate": "2026-09-26",
  "pickupTimeSlot": "Afternoon (01:00 PM - 04:00 PM)",
  "specialInstructions": "Please deliver on hangers"
}
```
**Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Pickup order scheduled successfully!",
  "order": {
    "trackingId": "FF-2026-5759",
    "customerName": "Aarav Patel",
    "status": "PICKUP_SCHEDULED",
    "estimatedPrice": 597,
    "currency": "INR",
    "createdAt": "2026-09-24T14:33:32.346Z"
  }
}
```

---

### 2. Admin Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/admin/login` | Sign in with email and password to receive JWT Bearer token |
| `GET` | `/admin/me` | Protected route returning authenticated admin profile |

#### Example: Admin Sign-In (`POST /api/admin/login`)
```json
{
  "email": "admin@freshfold.in",
  "password": "FreshFold@Admin2026"
}
```
**Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Admin signed in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "6ab53c98452c7841cae825a6",
    "email": "admin@freshfold.in",
    "name": "FreshFold Admin",
    "role": "admin"
  }
}
```

---

### 3. Admin Protected Operations (Require `Authorization: Bearer <token>`)

#### Plan / Service Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/plans` | List all laundry plans (active and inactive) |
| `POST` | `/admin/plans` | Create a new laundry plan |
| `PUT` | `/admin/plans/:id` | Update an existing plan's price, turnaround, or details |
| `PATCH` | `/admin/plans/:id/status` | Toggle plan between Active and Inactive |
| `DELETE` | `/admin/plans/:id` | Delete a laundry plan (past orders remain preserved) |

#### Booking / Order Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/orders?search=&status=` | List all customer bookings with search and status filtering |
| `PATCH` | `/admin/orders/:id/status` | Update booking status (`IN_WASH`, `OUT_FOR_DELIVERY`, etc.) |

---

## 💡 Interview Talking Points (Key Technical Decisions)

1. **Why Clean Architecture?**
   > *"Rather than cluttering Express route handlers with database calls and validation logic, I separated them into Controllers, Services, and Models. Services contain pure business rules and are completely decoupled from Express `req` and `res` objects. This allows easy unit testing and future framework flexibility."*

2. **How is security handled for the Admin Area?**
   > *"We never rely solely on hiding admin components in React. Admin API routes are protected on the Express server using a JWT verification middleware. Admin passwords are never stored in plain text; they are hashed using `bcryptjs` with salt rounds. Tokens expire in 24 hours, and secrets are read from environment variables."*

3. **How do you prevent breaking past orders when a plan's price changes?**
   > *"In `Order.js`, the service name, price, and units are stored as independent snapshot fields captured at the exact moment of booking. If an administrator edits a plan's price or description tomorrow, historical orders maintain their original quoted price and details."*

4. **How does live tracking synchronize with the admin console?**
   > *"Both the customer tracking endpoint (`GET /api/orders/:trackingId`) and the admin status updater (`PATCH /api/admin/orders/:id/status`) query MongoDB directly. When an admin selects a new stage, MongoDB updates the order document. Any customer looking up the tracking ID immediately receives the updated stage."*

5. **Why Indian Rupee (₹) localization?**
   > *"The application is tailored for the Indian market, incorporating `Intl.NumberFormat('en-IN')` currency formatting (`₹1,299`), 10-digit Indian mobile number validation (`+91`), and realistic INR laundry rate benchmarks (e.g. ₹79/kg Wash & Fold)."*

---

## 📄 License
ISC License. Built for educational and internship interview demonstration purposes.
