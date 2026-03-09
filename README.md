# Tenton Ramen & Tonkatsu – Online Ordering & Reservation System

A full-stack restaurant web application that allows customers to place online orders, make reservations, and enables administrators to manage orders and reservations in real time.

This project simulates a real restaurant digital ordering system with a modern UI, responsive design, and secure admin management tools.

---

# Features

## Customer Features

### Online Ordering

- Browse menu categories and items
- Customize menu items with options
- Add items to cart
- Review order summary
- Submit order for pickup

### Reservation System

- Select reservation date and time
- Enter party size and customer information
- Input validation for phone, email, and guest count
- Reservation confirmation page

### Order Confirmation

- Displays order details after checkout
- Shows pickup time and order information

### Responsive Design

- Fully responsive layout
- Mobile-friendly reservation cards
- Desktop admin tables

---

## Admin Features

### Admin Dashboard

- View all orders
- View all reservations
- Filter and search records

### Order Management

- View order details
- Track order status
- Update cooking status

### Reservation Management

- View reservations grouped by date
- Search by:
  - Name
  - Phone
  - Email
  - Notes
- Sort by:
  - Date/time
  - Party size
  - Customer name

### Statistics

- Total bookings in range
- Total guests

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js API Routes
- Drizzle ORM Neon
- PostgreSQL

## Authentication

- Admin authentication via secure server middleware

## Deployment

- Vercel compatible architecture

---

# Project Structure

app
├ api
│ └ admin
│ ├ orders
│ └ reservations
│
├ order
│ └ confirmed
│
├ reservation
│ └ confirmed
│
├ tentonAdmin
│ ├ orders
│ └ reservations
│
components
├ order
├ reservation
├ admin
└ ui

lib
├ server
└ adminApi

utils
db

---

# Installation

Install dependencies

npm install

Run the development server

npm run dev

Open in browser

http://localhost:3000

---

# Environment Variables

Create a `.env.local` file.

Example:

DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your_admin_password

---

# API Endpoints

## Orders

GET /api/admin/orders  
GET /api/admin/orders/[id]  
PATCH /api/admin/orders/[id]

## Reservations

GET /api/admin/reservations  
GET /api/admin/reservations/[id]  
DELETE /api/admin/reservations/[id]

---

# Key Design Decisions

### App Router Architecture

The project uses the Next.js App Router for improved routing structure and server-side capabilities.

### Typed API Layer

All API responses are strongly typed using TypeScript interfaces to improve maintainability.

# Future Improvements

- Online payment integration
