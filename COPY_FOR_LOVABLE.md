# LOVABLE DEV PROMPT - Copy This Directly

**Here's your complete lovable.dev prompt to copy and paste:**

---

# AirBear PWA - Ultimate Lovable.dev Prompt

## Project Overview
Build a futuristic solar-powered ride-sharing Progressive Web App called "AirBear" - a revolutionary transportation service that combines zero-emission rides with mobile bodegas across Binghamton, NY. The app features holographic ambiance, real-time tracking, and a seamless booking experience.

## Core Features & Functionality

### 1. Hero Landing Page
- **Gradient Background**: Slate-900 to cyan-700 to emerald-500 gradient with glass morphism
- **Tagline**: "Glide with AirBear, ride without a care"
- **Description**: "AirBear blends zero-emission rides, mobile bodegas, and holographic ambiance across Binghamton so every trip feels like a festival on wheels"
- **Role Cards**: Three interactive cards for Driver, Passenger, and Admin roles
- **Live Stats Section**: ETA (4m), Distance (1.2 mi), Solar Charge (84%)
- **Promo Section**: CEO-signed $100 T-Shirt offer with unlimited rides

### 2. Interactive Map System
- **Live Map**: Interactive Leaflet map centered on Binghamton (42.0987, -75.9179)
- **16 Strategic Spots**: All major Binghamton locations with green markers
- **Real-time Availability**: Shows available AirBears at each spot
- **Booking Dialog**: Click green markers to book rides
- **Battery Tracking**: Solar battery levels for each vehicle
- **ETA Calculation**: Instant ride time and fare estimates
- **Map Controls**: Zoom in/out, refresh, and map legend

### 3. Mobile Bodega Experience
- **Product Categories**: Beverages, Food, Snacks, Accessories
- **Search & Filter**: Real-time product search with categories
- **Shopping Cart**: Add-to-cart with sparkle animations
- **Eco Products**: Green badges for sustainable items
- **Stock Management**: Low stock alerts and availability tracking
- **Checkout Process**: "Checkout on Arrival" with order placement

### 4. User Authentication & Roles
- **Three User Types**: Guest, Passenger, Driver, Admin
- **Protected Routes**: Role-based dashboard access
- **Session Management**: Persistent login state
- **Sign In/Sign Out**: Clean authentication flow

### 5. Dashboard System
- **Passenger Dashboard**: Ride history, eco-impact tracking
- **Driver Dashboard**: Vehicle management, earnings, battery status
- **Admin Dashboard**: Fleet analytics, revenue tracking, system monitoring

## UI/UX Design Specifications

### Color Palette
- **Primary**: Cyan-300, Cyan-200, Cyan-700
- **Secondary**: Emerald-500, Lime-50
- **Background**: Slate-950, Slate-900
- **Accent**: Amber-300 (for promos), Green-500 (for eco)
- **Glass Effects**: White/5%, White/10% with backdrop-blur

### Typography
- **Headers**: Bold, modern sans-serif
- **Body**: Clean, readable font with good spacing
- **Uppercase Tracking**: [0.3em], [0.4em], [0.5em] for navigation
- **Font Weights**: 600 (semibold), 700 (bold)

### Layout Components
- **Glass Morphism**: backdrop-blur effects with subtle borders
- **Rounded Corners**: 2xl (1rem) border radius
- **Shadows**: Shadow-2xl with color-specific shadows (cyan-500/20)
- **Animations**: Fade-in, slide-up, hover-lift effects

## Key Interactive Components

### 1. AirBear Wheel Component
- **Spinning Animation**: Continuous rotation with CSS transforms
- **Color Gradients**: Cyan to emerald gradient
- **Sizes**: sm, md, lg, xl variants
- **Usage**: Status indicators, loading spinners, navigation elements

### 2. Map Component
- **Leaflet Integration**: Full interactive map functionality
- **Custom Markers**: AirBear-themed markers for each spot
- **Clustering**: Group nearby markers for better UX
- **Routing**: Visual route display between pickup and destination

### 3. Shopping Cart
- **Sparkle Effects**: Particle animations on add-to-cart
- **Quantity Controls**: + / - buttons with smooth transitions
- **Cart Badge**: Dynamic counter in navigation
- **Checkout Flow**: Modal-based cart with order summary

### 4. Real-time Data Display
- **Live Statistics**: Active spots, available AirBears, charging status
- **Battery Levels**: Visual battery indicators with percentages
- **ETA Calculations**: Dynamic wait time estimates
- **Fleet Status**: Real-time vehicle location and availability

## Technical Implementation

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Routing**: Client-side routing (Wouter or React Router)
- **State Management**: React Context or Zustand
- **Data Fetching**: TanStack Query for API calls
- **Animations**: Framer Motion for smooth transitions
- **Maps**: Leaflet for interactive mapping
- **UI Components**: Radix UI primitives with custom styling

### Backend Integration
- **API Endpoints**:
  - `/api/spots` - Get all AirBear locations
  - `/api/rickshaws/available` - Get available vehicles
  - `/api/rides` - Book and manage rides
  - `/api/bodega/items` - Get products inventory
  - `/api/orders` - Process shopping orders
  - `/api/auth` - User authentication

### Progressive Web App Features
- **Manifest**: Full PWA configuration
- **Service Worker**: Offline functionality
- **Push Notifications**: Driver availability alerts
- **Mobile Optimization**: Touch-friendly interface
- **Fast Loading**: Optimized assets and code splitting

## Specific Page Requirements

### Home Page (`/`)
- Hero section with gradient background
- Three role description cards
- Live stats display with real-time data
- Promotional section for CEO t-shirt
- Navigation to all other pages

### Map Page (`/map`)
- Full-screen interactive map
- 16 location markers with availability status
- Booking dialog with fare calculation
- Map controls (zoom, refresh, legend)
- Stats cards showing fleet status

### Bodega Page (`/bodega`)
- Product grid with category tabs
- Search and filter functionality
- Shopping cart with animations
- Product cards with eco badges
- Checkout modal with order summary

### Dashboard Pages (`/dashboard/:role`)
- Role-specific content and layouts
- Real-time data visualization
- Interactive charts and graphs
- Fleet management interfaces

### Login Page (`/login`)
- Clean authentication form
- Role selection for new users
- Session state management
- Redirect after successful login

## Animation & Interaction Details
- **Page Transitions**: Fade in/out with staggered loading
- **Button Hover**: Subtle scale and glow effects
- **Card Interactions**: Lift on hover with shadow enhancement
- **Form Animations**: Smooth focus states and validation feedback
- **Loading States**: Skeleton screens and spinners
- **Sparkle Effects**: Particle bursts on successful actions

## Mobile Responsiveness
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Collapsible mobile menu
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Viewport**: Proper mobile viewport configuration

## Performance Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Size**: Tree shaking and minimal dependencies
- **Caching**: Aggressive caching strategies
- **SEO**: Proper meta tags and structured data

---

**IMPORTANT**: This should be a production-ready, pixel-perfect implementation of a futuristic transportation platform that feels both professional and magical. Every interaction should be smooth, every animation should delight, and the entire experience should make users excited about sustainable transportation.

The app should feel like something from 2030 - sleek, intuitive, and environmentally conscious while maintaining excellent usability and performance.

---

**That's it! Just copy the entire prompt above and paste it into lovable.dev. Once they generate the code, use the QUICK_DEPLOYMENT_GUIDE.md for the 15-minute setup process.**
