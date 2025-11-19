# AirBear Technical Context

## Technology Stack Overview

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern features
- **Build Tool**: Vite for lightning-fast development and optimized production builds
- **Routing**: Wouter for lightweight, fast client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Custom component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom eco-luxury theme and CSS-in-TS approach
- **Animations**: Framer Motion for smooth, performant animations and transitions
- **Forms**: React Hook Form with Zod validation for robust form management

### Backend Architecture
- **Runtime**: Node.js with TypeScript for type-safe server development
- **Framework**: Express.js with RESTful API design
- **Build Process**: ESBuild for ultra-fast server builds
- **Development Server**: tsx for instant TypeScript compilation during development

### Database & Data Layer
- **Database**: PostgreSQL with Supabase as the managed database provider
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Authentication**: Supabase Auth with JWT tokens and Row Level Security (RLS)
- **Real-time**: Supabase real-time subscriptions for live data updates

### Payment Processing
- **Provider**: Stripe for secure payment processing
- **Integration**: Stripe Elements with React components and Express server-side handling
- **Features**: One-time payments, subscription management, webhook handling

### Maps & Geolocation
- **Mapping Library**: Leaflet for interactive, performance-optimized maps
- **Map Tiles**: OpenStreetMap integration with custom marker overlays
- **Geolocation**: Browser Geolocation API with real-time position tracking
- **Data Source**: Custom spots.csv with 16 strategic Binghamton locations

### Development & Quality Tools

#### Testing Suite
- **Framework**: Vitest for fast, ESM-compatible testing
- **UI Testing**: React Testing Library for component testing
- **Coverage**: Built-in coverage reporting and CI integration

#### Code Quality
- **TypeScript**: Strict type checking across the entire application
- **Linting**: ESLint with comprehensive ruleset including unused disable directives
- **Formatting**: Prettier for consistent code formatting
- **Build Verification**: TypeScript compilation checks before deployment

#### Development Experience
- **Hot Reload**: Vite's instant HMR for fast development iterations
- **Type Generation**: Automatic type generation from database schemas
- **Debug Tools**: React DevTools and TanStack Query DevTools integration

## Development Environment

### Package Management
- **Manager**: npm with workspaces for mono-repo structure
- **Lock File**: package-lock.json for reproducible builds
- **Scripts**: Comprehensive npm scripts for all development tasks

### Configuration Files
- **TypeScript**: Dual configuration (client and server-specific)
- **Vite**: Optimized build configuration with plugins and PWA settings
- **Tailwind**: Custom theme with eco-colors and responsive breakpoints
- **PostCSS**: CSS processing with Autoprefixer and other plugins

### Environment Management
- **Local Development**: .env file with local configuration
- **Production**: Environment-specific configuration for different deployment targets
- **Security**: Separate environments for development, staging, and production

## Deployment & Hosting Strategy

### Multiple Deployment Options
- **IONOS FTP**: Traditional web hosting with custom deployment scripts
- **GitHub Actions**: Automated deployment workflows with CI/CD
- **Vercel**: Serverless deployment with edge functions (fallback option)
- **Static Hosting**: Pure static deployment for PWA capabilities

### Build Pipeline
1. **Client Build**: Vite builds optimized bundle with code splitting
2. **Server Build**: ESBuild compiles Node.js server to CommonJS
3. **PWA Assets**: Service worker generation and manifest creation
4. **Asset Optimization**: Image compression and SVG optimization
5. **Dependency Analysis**: Bundle size monitoring and optimization

### Production Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **Asset Optimization**: CSS minimization and unused code elimination
- **Caching Strategy**: Aggressive caching with proper cache busting
- **Performance Monitoring**: Bundle size analysis and core web vitals tracking

## PWA Implementation

### Core Features
- **Service Worker**: Background sync, offline caching, push notifications
- **Web App Manifest**: Install prompts and native app-like experience
- **Responsive Design**: Full mobile-first responsive implementation
- **Offline Support**: Core functionality works without internet connection

### Advanced Capabilities
- **Push Notifications**: Real-time ride updates and eco-achievements
- **Background Sync**: Ride requests and payment processing queue
- **Geofencing**: Location-based notifications and automatic updates
- **Media Handling**: Optimized image handling and lazy loading

## Security Considerations

### Authentication & Authorization
- **Supabase Auth**: Secure authentication with multiple providers
- **Role-Based Access**: Admin, Driver, and User permission systems
- **Row Level Security**: Database-level access controls in PostgreSQL

### Data Protection
- **HTTPS Only**: All communications over secure connections
- **Environment Secrets**: Secure API key management and rotation
- **CSRF Protection**: Request validation and origin checking
- **Input Validation**: Zod schemas with strict type checking

### Payment Security
- **PCI Compliance**: Stripe's secure payment processing
- **Webhook Verification**: Server-side webhook signature validation
- **No Sensitive Storage**: Client-side token handling without server storage

## Performance Optimization Strategies

### Frontend Performance
- **Virtual Scrolling**: Efficient rendering of large lists and maps
- **Image Optimization**: Lazy loading and responsive image handling
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **CPU Throttling**: Optimized animations for lower-end devices

### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Layers**: Redis implementation for session and data caching
- **Connection Pooling**: Efficient database connection management
- **API Rate Limiting**: DDoS protection and fair usage policies

### Monitoring & Metrics
- **Real-Time Monitoring**: Server response times and error tracking
- **Client-Side Metrics**: Core Web Vitals and user interaction analytics
- **Error Boundaries**: Graceful error handling and user feedback
- **Performance Budgets**: Build-time performance budget enforcement

## Development Workflow

### Local Development Command: `npm run dev`
- Starts both client and server with hot reload
- Enables development middleware and debugging tools
- Provides instant feedback during development

### Build Process: `npm run build`
- Client build with optimization and minification
- Server build with TypeScript compilation
- Asset processing and manifest generation

### Testing: `npm test`
- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for critical user journeys

### Deployment Scripts
- Multiple deployment targets with automated scripts
- Environment-specific configuration management
- Rollback capabilities and deployment verification
