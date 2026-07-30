# Product Requirements Document (PRD)

## Project Name

VastraChakra – Circular Fashion Platform

Version: 1.0

Document Owner: Product Team

Status: MVP Planning

Development Methodology: Agile

---

# 1. Product Overview

VastraChakra is a web-based circular fashion platform that promotes sustainable clothing practices by extending the lifecycle of garments. Instead of allowing usable clothes to end up in landfills, the platform enables users to either resell wearable clothing or responsibly recycle worn-out garments.

The platform is built around the principles of the Circular Economy:

• Reuse
• Recycle
• Recreate (Future Phase)

The MVP focuses on creating a seamless experience for buying, selling, and recycling clothing while preparing the platform for future expansion into upcycled fashion.

---

# 2. Problem Statement

Millions of wearable garments remain unused in wardrobes while damaged clothing contributes significantly to textile waste.

Current marketplaces such as OLX allow users to sell general second-hand goods, but there is no dedicated platform focused on clothing that combines resale with responsible recycling.

Users currently face problems such as:

• No dedicated marketplace for pre-loved clothing
• No convenient recycling process for unusable garments
• Lack of awareness regarding sustainable fashion
• Textile waste ending up in landfills

VastraChakra addresses these problems by providing a single ecosystem for resale and recycling.

---

# 3. Vision

To become India's leading circular fashion platform where every garment receives a second life through reuse, recycling, or upcycling.

---

# 4. Mission

To reduce textile waste by creating an accessible digital platform that encourages sustainable fashion choices while providing economic value to individuals and recycling partners.

---

# 5. Business Goals

• Reduce textile waste
• Increase clothing reuse
• Build a sustainable marketplace
• Partner with textile recycling industries
• Create measurable environmental impact
• Generate revenue through marketplace transactions and partnerships

---

# 6. Target Audience

Primary Users

• Students
• Young Professionals
• Families
• Sustainable Fashion Enthusiasts

Secondary Users

• Textile Recycling Companies
• NGOs
• Thrift Stores
• Clothing Collection Organizations

Future Users

• Local Artisans
• Fashion Designers
• Upcycling Businesses

---

# 7. Product Scope

## Tier 1 – Pre-loved Marketplace (MVP)

Users can:

• Create product listings
• Upload images
• Upload videos
• Add product details
• Set selling price
• Browse products
• Purchase clothing
• Search products
• Apply filters
• Save wishlist

---

## Tier 2 – Textile Recycling (MVP)

Users can:

• Request clothing pickup
• Donate clothes
• Sell clothes by weight
• Track pickup status
• View recycling history

Industry Partners can:

• Accept recycling batches
• Update processing status
• Maintain collection records

---

## Tier 3 – Upcycled Products (Future)

Users will be able to:

• Purchase handcrafted upcycled products

Artisans will be able to:

• Receive reusable fabric
• Create new products
• Sell products through the platform

---

# 8. User Personas

## Persona 1 – Seller

Goals

• Earn money from unused clothes
• Sell easily
• Reach interested buyers

Pain Points

• No clothing-focused marketplace
• Difficult selling process

---

## Persona 2 – Buyer

Goals

• Affordable fashion
• Branded clothing
• Verified quality

Pain Points

• Limited affordable options
• Trust issues

---

## Persona 3 – Recycler

Goals

• Dispose clothes responsibly
• Support sustainability

Pain Points

• No convenient collection system

---

## Persona 4 – Industry Partner

Goals

• Source recyclable textiles
• Manage collection efficiently

Pain Points

• Inconsistent supply
• Manual coordination

---

# 9. User Journey

Visitor

↓

Landing Page

↓

Register/Login

↓

Choose Action

↓

Buy Clothes
OR

Sell Clothes
OR

Book Recycling Pickup

↓

Order/Pickup Confirmation

↓

Status Tracking

---

# 10. Features

## Authentication

Priority: High

Features

• Register
• Login
• Forgot Password
• Email Verification
• Logout

---

## Marketplace

Priority: High

Features

• Product Listing
• Product Details
• Search
• Filters
• Wishlist
• Checkout
• Orders

---

## Recycling

Priority: High

Features

• Pickup Request
• Donation
• Sell by Weight
• Pickup Tracking

---

## Profile

Priority: High

Features

• Edit Profile
• Manage Addresses
• View Listings
• View Orders
• View Recycling Requests

---

## Industry Dashboard

Priority: Medium

Features

• Pickup Queue
• Batch Management
• Processing Updates

---

## Admin Dashboard

Priority: High

Features

• User Management
• Industry Verification
• Listing Moderation
• Analytics
• Reports

---

# 11. Functional Requirements

Authentication

• User Registration
• Secure Login
• JWT Authentication

Marketplace

• CRUD Listings
• Image Upload
• Video Upload
• Product Search
• Product Filters
• Wishlist

Orders

• Checkout
• Payment
• Order Tracking

Recycling

• Pickup Scheduling
• Donation Requests
• Weight Estimation
• Recycling Status

Admin

• User Approval
• Listing Management
• Analytics Dashboard

---

# 12. Non-Functional Requirements

Performance

• API Response <300 ms

Availability

• 99% uptime

Security

• HTTPS
• JWT
• Password Encryption
• Role-Based Access

Scalability

• Modular Architecture
• Cloud Deployment

Usability

• Mobile Responsive
• Easy Navigation
• Fast Loading

---

# 13. MVP Features

Included

✔ User Authentication

✔ User Profiles

✔ Marketplace

✔ Product Listings

✔ Search

✔ Filters

✔ Wishlist

✔ Recycling Requests

✔ Industry Dashboard

✔ Admin Dashboard

✔ Responsive Design

Excluded

✖ AI Recommendations

✖ Live Chat

✖ Mobile Application

✖ Upcycled Marketplace

✖ Logistics Automation

---

# 14. Success Metrics (KPIs)

Marketplace

• Number of active users
• Number of listings
• Number of completed sales

Recycling

• Total pickup requests
• Total kilograms collected
• Total recycling batches processed

Business

• User retention
• Monthly active users
• Average order value
• Platform commission generated

Technical

• API uptime
• Average response time
• Crash-free sessions

---

# 15. Risks

• Low user adoption
• Fake listings
• Poor product quality
• Delayed pickups
• Payment failures
• Industry partner availability

Mitigation

• Listing moderation
• Verified partners
• User ratings
• Secure payments
• Pickup tracking

---

# 16. Future Roadmap

Phase 2

• AI-based clothing classification
• AI price recommendation
• Smart search
• Logistics integration
• Carbon footprint dashboard

Phase 3

• Upcycled marketplace
• Artisan dashboard
• Mobile application
• Reward points
• Gamification
• Recommendation engine

---

# 17. Assumptions

• Users have internet access.
• Industry partners are verified before onboarding.
• Cloud storage is available for media uploads.
• Payment gateway credentials are configured before production deployment.

---

# 18. Dependencies

• Cloudinary (Media Storage)
• Razorpay (Payments)
• Google Maps API (Location & Pickup)
• SMTP (Email Verification)
• PostgreSQL Database
• FastAPI Backend
• React Frontend

---

# 19. Out of Scope (MVP)

• Mobile Applications
• AI-powered Recommendations
• Carbon Credits
• Live Chat
• Logistics Automation
• Upcycled Product Marketplace
• Loyalty Program

---

# 20. Product Success Criteria

The MVP will be considered successful if it enables users to register, list and purchase pre-loved clothing, request textile recycling pickups, and allows administrators and industry partners to efficiently manage listings and recycling operations. The platform should provide a smooth, secure, and responsive user experience while demonstrating a practical circular fashion model that can scale into future features such as upcycling, AI-driven recommendations, and logistics automation.