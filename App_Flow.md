# App Flow Document
**Owner:** Sukriti
**Status:** Rough Draft v1 — for review with Ariba (UI/UX) and team
**Note on concept:** Since the core idea isn't finalized yet, this draft covers a **hybrid model** — combining (a) cloth collection for industry recycling and (b) a resale marketplace where sellers list clothes for consumers to buy. This can be trimmed down once the PRD locks the final scope.

---

## 1. App Concept (Working Assumption)

The platform connects three kinds of participants:
- **Consumers/Sellers** — regular users who can either (i) list used clothes for sale to other consumers, or (ii) hand over clothes they don't want to sell for recycling.
- **Industry Partners** — businesses that pick up/receive recyclable clothing in bulk from the platform and process it.
- **Admin** — manages users, listings, pickups, and platform health.

A single user can be both a buyer and a seller. Industry accounts are a separate account type with their own dashboard.

---

## 2. User Types & Login Structure

### 2.1 Account Types
| Type | Who | Access |
|---|---|---|
| Normal User | Individual buyers/sellers of clothes | Browse, list, buy, request recycling pickup |
| Industry User | Recycling companies / bulk buyers | View available recycling batches, schedule pickups, bulk order dashboard |
| Admin | Internal team | Full platform control |

### 2.2 Login/Register Flow
1. Landing page has **two top-level entry buttons**: "Login" and "Register" (Admin login is *not* shown publicly — separate hidden/admin-only URL or a small "Admin" link in the footer).
2. On clicking **Register**, user is asked to choose account type first:
   - "I'm an individual" → Normal User signup
   - "I'm a business/recycler" → Industry signup (may require extra verification fields — business name, GST/registration no., pickup address)
3. **Normal User Registration:** Name, email/phone, password, address, OTP verification → Home
4. **Industry Registration:** Business name, contact person, email/phone, password, business address, business proof upload → held in "Pending Verification" until Admin approves → confirmation email → can then log in
5. **Login:** Email/phone + password (or OTP). System checks account type and redirects to the correct dashboard (Normal Home / Industry Dashboard / Admin Panel).
6. **Forgot Password:** Standard email/OTP reset flow.
7. **Logout:** Available from profile/account menu on every page → clears session → redirects to Landing Page.

---

## 3. Main / Landing Page Layout

The landing page is public (visible without login) and should inform first-time visitors what the platform does before pushing them to sign up.

**Sections (top to bottom):**
1. **Navbar:** Logo | How it Works | Sell Clothes | Recycle With Us | For Industries | Login | Register
2. **Hero Section:** One-line value proposition + two CTA buttons: "Start Selling" and "Recycle Your Clothes" (both route to Register if not logged in, or to the relevant flow if logged in)
3. **Informative Section — "How it Works":** 3-step visual for sellers (List → Get Discovered → Sell), 3-step visual for recyclers (Schedule Pickup → We Collect → Sent to Industry)
4. **Featured/Trending Listings:** Grid of clothing items currently for sale (clickable → Product Detail Page)
5. **For Industry Partners Section:** Short pitch + "Partner With Us" button → Industry Register
6. **Impact/Stats Section (optional):** e.g., kilos of clothes recycled, items resold — builds trust
7. **Footer:** About, Contact, Terms, Admin link (small, unobtrusive)

**Button behavior:**
- If **not logged in**, any action button (Sell, Buy, Recycle) → redirects to Login/Register modal first, then continues the intended action after auth.
- If **logged in**, buttons go straight to the relevant page.

---

## 4. Normal User Flow (Post-Login)

### 4.1 Home / Dashboard
- Navbar now shows: Home | Browse/Buy | Sell an Item | Recycle Pickup | My Orders | Profile | Logout
- Central feed of listings (filterable by category, size, price, condition)

### 4.2 Buying Flow
1. Browse listings → click item → **Product Detail Page** (photos, price, condition, seller info, "Buy Now" / "Add to Cart" buttons)
2. Add to Cart → Cart Page → Checkout (address, payment method)
3. Order Confirmation Page → order appears in "My Orders"
4. Order status updates: Placed → Shipped/Handover Scheduled → Delivered

### 4.3 Selling Flow
1. Click "Sell an Item" → Form: photos, title, description, category, size, condition, price
2. Submit → Listing goes live immediately (or "Pending Review" if Admin moderation is required — TBD with team)
3. Seller manages listings under "My Listings" (Edit / Mark as Sold / Delete)
4. When an item sells, seller gets notified → arranges handover/shipping per platform rules

### 4.4 Recycle Pickup Flow (for clothes not being sold)
1. Click "Recycle Pickup" → Form: number of items/weight (approx.), pickup address, preferred date/time
2. Submit → Request goes into a queue visible to Admin (and/or matched Industry partner)
3. User sees status: Requested → Scheduled → Picked Up → (optionally) "Thank you" impact message
4. This queue is what Industry users see and can claim on their end (see 5.2)

### 4.5 Profile Page
- Edit personal details, saved addresses, payment methods
- Tabs: My Listings | My Purchases | My Recycle Requests | Settings | Logout

---

## 5. Industry User Flow (Post-Login)

### 5.1 Industry Dashboard
- Navbar: Dashboard | Available Batches | My Pickups | Profile | Logout

### 5.2 Claiming Recycling Batches
1. Dashboard shows list/map of pending recycle-pickup requests (individually or bundled by Admin into a "batch" for efficiency — TBD)
2. Industry user selects a batch → confirms pickup → schedule gets locked
3. Status: Claimed → Picked Up → Marked Received/Processed
4. History log of all batches processed (for their own records/reporting)

### 5.3 Profile Page
- Business details, verification status, pickup history, contact info

---

## 6. Admin Flow

### 6.1 Admin Login
- Separate/hidden login route, not linked from main navbar
- Admin credentials are pre-created, not self-registered

### 6.2 Admin Panel Sections
- **User Management:** View/approve/suspend Normal and Industry accounts (Industry accounts specifically need approval before activation)
- **Listings Management:** Moderate/remove flagged listings
- **Recycle Requests:** View all pickup requests, optionally assign/bundle them for Industry partners
- **Orders:** View all buy/sell transactions, handle disputes
- **Analytics:** Basic stats — active users, items sold, kilos recycled, etc.
- **Logout**

---

## 7. Cross-Cutting Notes for Ariba (UI/UX)

- Two very different "modes" exist on the same platform (marketplace vs recycling) — UI should make it clear which mode a user is in at any time, without feeling like two separate apps.
- Buttons that require login should still be visible to logged-out visitors (not hidden) — clicking them triggers the login/register modal, so the value proposition stays visible.
- Industry Dashboard is a distinct visual "mode" (more utilitarian/data-driven) compared to the Normal User marketplace feel (more visual/product-driven).
- Admin panel doesn't need to be pretty — clarity and speed matter more.

---

## 8. Open Questions (for team discussion)

- Is the core idea one platform doing **both** resale and recycling, or should we pick one to keep scope tight for a first version?
- Does Admin need to manually approve every listing, or only Industry account signups?
- Are recycle pickups matched to a specific Industry partner automatically, or does Admin manually assign/batch them?
- Payment handling for the marketplace side — in scope for v1 or later?

