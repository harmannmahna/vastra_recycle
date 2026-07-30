# VastraChakra (वस्त्रChakra) | Delhi NCR Circular Fashion Ecosystem ♻️

VastraChakra is an innovative early-stage circular fashion startup platform centered in **Delhi NCR**. It builds a 2-tier sustainable apparel ecosystem to close the textile loop in India:

1. **Tier 1 — Curated Pre-Loved Reselling**: Resell wearable, premium pre-loved clothing (purchased within the last 3 years) backed by mandatory seller video previews, hygiene ratings, and screening checks.
2. **Tier 2 — Doorstep Textile Recycling**: Schedule doorstep pickups for worn-out, torn, or unwearable fabric waste by weight (kg). Includes mandatory packed bag/box photo proof to route feedstock directly to Panipat recycling mills and partner NGOs.

---

## 🌟 Key Platform Features

- **Dedicated 3-Tier Role Portals**:
  - **Consumer / Seller Portal**: Browse pre-loved marketplace, list items for resale, and book textile recycling pickups.
  - **Industry Partner Portal**: B2B portal for recycling mills and NGOs in Delhi NCR & Panipat featuring commercial rate cards (₹/kg), warehouse inventory staging, and procurement models. Requires a valid 15-character Indian GSTIN (`07AAACV0902F1Z8`).
  - **Admin Governance Panel**: Protected administrative hub for moderating resale video listings, verifying packed recycling box photos, and approving B2B industry applications.
- **Strict Delhi NCR Geographical Boundary**:
  - Location validator enforces service strictly within Delhi NCR (Delhi, New Delhi, Gurgaon, Noida, Ghaziabad, Faridabad, Sonipat, Panipat with pincodes `11xxxx`, `12xxxx`, `20xxxx`). Requests outside NCR (e.g. Bangalore, Mumbai) are rejected.
- **Client-Side Persistent Database (`localStorage`)**:
  - All registered users, reselling listings, recycling requests, orders, and sessions survive page reloads.
- **High-Contrast Light Themes**:
  - **Consumer**: Warm Beige (`#FDFBF7`) & Terracotta (`#C86D51`).
  - **Industry**: Light Slate (`#F8FAFC`) & Industrial Teal (`#0F766E`).
  - **Admin**: Ivory (`#FAFAF9`) & Executive Amber (`#D97706`).
- **Official Branding**:
  - Integrated wide calligraphic logo banner (`/logo-banner.png`), circular emblem (`/logo-emblem.jpg`), and custom red/pink Chakra icon (`/chakra-icon.png`).

---

## 📁 Complete File & Folder Directory Breakdown

```
web_app/
├── index.html                  # HTML entry point with favicon (<link rel="icon" href="/logo-emblem.jpg">)
├── package.json                # Project dependencies (React 18, Vite, TailwindCSS, Lucide-React)
├── vite.config.ts              # Vite build & dev server configuration (Port 3000)
├── tailwind.config.js          # Custom Tailwind design tokens (Forest, Terracotta, Earthteal, Cream, Warmgold)
├── tsconfig.json               # TypeScript compiler configuration
├── postcss.config.js           # PostCSS configuration for Tailwind processing
├── .gitignore                  # Git exclusion rules (node_modules, dist, env, local databases)
│
├── public/                     # Static Brand Assets
│   ├── logo-banner.png         # Wide rectangular calligraphic banner logo
│   ├── logo-emblem.jpg         # Circular trademark emblem logo
│   ├── chakra-icon.png         # Custom red/pink Chakra flower icon
│   └── logo.png                # Brand logo fallback asset
│
└── src/
    ├── main.tsx                # React application entry point rendering <App /> inside AppProvider
    ├── App.tsx                 # Root layout container rendering Navbar, main active tab view, & Footer
    ├── index.css               # Global Tailwind CSS styles and animations
    │
    ├── context/
    │   └── AppContext.tsx      # React Context Provider managing application state (cart, wishlist, users, items, pickups, orders, authentication, location validation)
    │
    ├── services/
    │   ├── db.ts               # LocalStorage persistent database engine (getItems, getUsers, getPickups, getOrders, getCurrentUser, saveItems, etc.)
    │   └── mockData.ts         # Initial system data definitions and category constants
    │
    ├── types/
    │   └── index.ts            # TypeScript data contracts (User, Item, PickupRequest, Order, Address, ItemCategory, ItemCondition)
    │
    ├── utils/
    │   └── locationValidation.ts # Geographical boundary validator restricting service strictly to Delhi NCR
    │
    └── components/             # React UI Components
        ├── Navbar.tsx          # Top header navigation with Instagram link (@vastrachakra_), circular emblem, search, and user role pill
        ├── LandingPage.tsx     # Homepage with hero section, expanded logo banner, 2-tier dual circular pillars, curated pre-loved showcase, and industry CTA
        ├── Marketplace.tsx    # Pre-loved marketplace catalog with category pills, condition filters, search bar, and cart triggers
        ├── AuthModal.tsx       # 3-Role authentication modal (Consumer, Industry with GSTIN, Admin login) with soft shadow reflection
        ├── SellItemModal.tsx   # Tier 1 listing form with video preview URL, hygiene ratings, brand checks, and condition screening
        ├── RecyclingModal.tsx  # Tier 2 pickup request form with weight calculation, clothing type selector, and mandatory packed box photo upload
        ├── ProductDetailModal.tsx # Detailed view modal for pre-loved garments with video preview, seller info, and hygiene score
        ├── CartDrawer.tsx      # Sliding cart drawer showing items, 10% platform commission breakdown, eco-shipping fees, and checkout button
        ├── CheckoutModal.tsx   # Order checkout modal with address input (Delhi NCR validated), UPI/Card/COD payment options
        ├── AdminDashboard.tsx  # Ivory & Amber light theme governance dashboard for reviewing Tier 1 listings, Tier 2 pickups, and B2B industry applications
        ├── IndustryDashboard.tsx # Slate & Teal light theme B2B portal featuring Delhi NCR/Panipat recyclers directory, rate cards (₹/kg), procurement models, and warehouse inventory
        ├── UserProfile.tsx     # Consumer user profile dashboard showing listed items, order history, and active recycling pickups
        └── Footer.tsx          # Bottom footer with quick links, circular ecosystem services, trademark emblem, and admin portal shortcut
```

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js (v18.x or later)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/harmannmahna/vastra_recycle.git
cd vastra_recycle

# Checkout the sanyam branch
git checkout sanyam

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
# Compile TypeScript & bundle with Vite
npm run build
```

---

## 🔐 Credentials Summary

| Portal | Role | Email | Password | Required Field |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Panel** | Admin Governance | `sanyam0902@gmail.com` | `Gamma@12` | Contact: 8708288911 |
| **Consumer** | Customer / Seller | `sanyam0902@gmail.com` | `User@12` | Email Address |
| **Industry** | B2B Partner | `sanyam0902@gmail.com` | `Industry@12` | GSTIN (`07AAACV0902F1Z8`) |

---

© 2026 VastraChakra Circular Fashion Platform. Built for Delhi NCR Sustainable Fashion.
