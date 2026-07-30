Technical Requirements Document (TRD)

Project Name

VastraChakra – Circular Fashion Platform

Version: 1.0

Document Type: Technical Requirements Document (TRD)

Development Team: 4 Members

Development Methodology: Agile



1. Project Overview

VastraChakra is a web-based circular fashion platform that aims to reduce textile waste by providing users with multiple sustainable options for their unwanted clothing. The platform focuses on three core services:

Tier 1 – Pre-loved Clothing Marketplace

Tier 2 – Textile Recycling

Tier 3 – Upcycled Products (Future Release)

The Minimum Viable Product (MVP) will include only the first two tiers.



2. Technical Objectives

The system should:

Support secure user authentication and authorization.

Enable users to buy and sell pre-loved clothing.

Allow users to request recycling pickups.

Provide dashboards for users, industries, and administrators.

Store images and videos efficiently.

Be scalable for future mobile application development.

Maintain modular architecture for easy expansion.



3. Technology Stack

Frontend

React.js

Vite

TypeScript

Tailwind CSS

Framer Motion

React Router

Axios

TanStack Query

Backend

Python 3.12

FastAPI

SQLAlchemy

Pydantic

Alembic

Uvicorn

Database

PostgreSQL

Cache

Redis

Storage

Cloudinary

Authentication

JWT Authentication

bcrypt Password Hashing

API Architecture

REST API



4. System Architecture

               React Frontend

                       │

               HTTPS REST APIs

                       │

               FastAPI Backend

        ┌──────────┼──────────┐

        │          │          │

 Authentication  Marketplace  Recycling

        │          │          │

          PostgreSQL Database

                       │

              Cloudinary Storage

                       │

                   Redis Cache





5. User Roles

Customer

Register/Login

Buy Clothes

Sell Clothes

Book Recycling Pickup

View Orders

Manage Listings



Industry Partner

View Recycling Requests

Accept Collection Batches

Update Processing Status



Administrator

Manage Users

Verify Industry Accounts

Approve Listings

Monitor Orders

Manage Recycling Requests

View Analytics



6. Functional Modules

Module 1 – Authentication

Features:

User Registration

User Login

Logout

Forgot Password

Email Verification

JWT Authentication



Module 2 – User Management

Features:

User Profile

Address Management

Saved Addresses

Order History

Listing History

Recycling History



Module 3 – Marketplace

Features:

Create Listing

Edit Listing

Delete Listing

Upload Images

Upload Videos

Browse Products

Product Search

Product Filters

Wishlist

Product Details



Module 4 – Orders

Features:

Shopping Cart

Checkout

Payment

Order Tracking

Purchase History



Module 5 – Recycling

Features:

Book Pickup

Donate Clothes

Sell by Weight

Pickup Status Tracking

Recycling Dashboard



Module 6 – Industry Dashboard

Features:

View Assigned Batches

Accept Pickups

Update Processing Status

Batch History



Module 7 – Admin Panel

Features:

User Management

Industry Verification

Listing Moderation

Analytics Dashboard

Reports

Recycling Management



7. Backend Folder Structure

backend/

│

├── app/

│   ├── api/

│   ├── auth/

│   ├── users/

│   ├── listings/

│   ├── recycling/

│   ├── industry/

│   ├── admin/

│   ├── models/

│   ├── schemas/

│   ├── services/

│   ├── middleware/

│   ├── database/

│   ├── utils/

│   └── main.py

│

├── migrations/

├── tests/

├── requirements.txt

├── Dockerfile

└── README.md





8. Database Design

Core Tables

users

addresses

items

resale_listings

pickup_requests

recycling_batches

factories

orders

payments

wishlist

notifications

admin_logs

Future Tables

tailors

upcycle_requests

upcycled_products



9. API Modules

/auth

/users

/profile

/listings

/orders

/payments

/recycling

/factories

/admin

/search

/upload





10. Security Requirements

Authentication

JWT Access Tokens

Refresh Tokens

Password Security

bcrypt Hashing

Authorization

Role-Based Access Control (RBAC)

Validation

Pydantic

Rate Limiting

Redis

Communication

HTTPS Only



11. Third-Party Integrations

Cloudinary – Image & Video Storage

Razorpay – Payment Gateway

Google Maps API – Address & Pickup Location

SMTP – Email Verification

Twilio (Optional) – OTP Verification



12. Non-Functional Requirements



13. Deployment

Frontend

Vercel

Backend

Railway / Render / AWS EC2

Database

Supabase PostgreSQL / Neon PostgreSQL

Storage

Cloudinary

Monitoring

Sentry



14. Development Workflow

Requirement Gathering

        │

UI/UX Design

        │

Database Design

        │

Backend Development

        │

Frontend Development

        │

API Integration

        │

Testing

        │

Bug Fixes

        │

Deployment





15. Team Responsibilities

Member 1 – Backend Lead

FastAPI Development

Authentication

Database Design

REST APIs

Deployment



Member 2 – Frontend Developer

React Development

API Integration

State Management

Responsive UI



Member 3 – UI/UX Developer

UI Components

Animations

Design System

User Experience



Member 4 – QA & Integration

Testing

Bug Tracking

Documentation

Deployment Support



16. MVP Deliverables

User Authentication

User Profiles

Marketplace Module

Recycling Module

Admin Dashboard

Product Listings

Search & Filters

Image & Video Upload

Order Management

Responsive Design



17. Future Scope

AI-based Clothing Classification

AI Price Recommendation

Carbon Footprint Dashboard

Logistics Partner Integration

Live Chat

Upcycled Marketplace

Mobile Application

Recommendation System

AI-powered Search



18. Success Metrics

Successful User Registration

Active Product Listings

Number of Clothes Recycled

Marketplace Transactions

Average API Response Time

User Retention Rate

Pickup Completion Rate

Platform Uptime (>99%)



19. Assumptions & Constraints

Assumptions

Users have internet access and a modern web browser.

Industry partners are verified before activation.

Payment gateway credentials are available before deployment.

Cloudinary storage is configured for media uploads.

Constraints

Tier 3 (Upcycled Marketplace) is out of scope for MVP.

Mobile application is planned for a future release.

Logistics integration will initially be managed manually.

Marketplace commission percentage will be configurable through the admin panel.



20. Conclusion

VastraChakra is designed as a modular, scalable, and secure circular fashion platform that combines a pre-loved clothing marketplace with a textile recycling ecosystem. The chosen technology stack (React, FastAPI, PostgreSQL, Redis, and Cloudinary) provides a strong foundation for rapid MVP development while supporting future expansion into AI-powered recommendations, logistics integration, and upcycled product marketplaces. The architecture emphasizes maintainability, performance, and scalability, ensuring that additional modules can be integrated with minimal changes to the existing system.

