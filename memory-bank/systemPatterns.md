# AirBear System Patterns

## Architectural Overview

### Codebase Structure
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Design system primitives
│   │   ├── features/       # Feature-specific components
│   │   ├── pages/          # Page-level components
│   │   └── layout/         # Layout and navigation
│   ├── hooks/              # Custom hooks for business logic
│   ├── lib/                # Utility functions and config
│   └── types/              # TypeScript type definitions

server/
├── routes/                 # API route handlers by domain
├── middleware/             # Express middleware
├── services/               # Business logic services
├── lib/                    # Server utilities
└── types/                  # Server-side type definitions

shared/
├── schema.ts               # Database schemas and validation
└── types.ts                # Shared type definitions
```

## Core Design Patterns

### Component Architecture

#### UI Component Pattern
- **Design System**: Radix UI primitives with custom styling layers
- **Composition**: Small, composable components that build upon each other
- **Consistent APIs**: Prop interfaces follow the same patterns across components
- **Accessibility**: Built-in ARIA support with Radix UI foundations

**Example Pattern:**
```typescript
// Base component with variants
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Usage with composition
<Button variant="primary" onClick={handleAction}>
  <Icon name="save" />
  Save Changes
</Button>
```

#### Feature-Based Organization
- **Domain Grouping**: Related components grouped by feature (auth, cart, etc.)
- **Index Exports**: Clean barrel exports from each feature directory
- **Private/Public APIs**: Clear distinction between feature internals and public APIs

**Structure Pattern:**
```
features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── index.ts               # Public exports
```

### State Management Patterns

#### Server State Pattern (TanStack Query)
- **Query Keys**: Hierarchical, descriptive keys for cache management
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Background Refetching**: Automatic data freshness management
- **Error Boundaries**: Graceful error handling with retry logic

**Query Key Pattern:**
```typescript
// Hierarchical keys for precise invalidation
const queryKeys = {
  all: ['products'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...queryKeys.lists(), filters] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};
```

#### Context Pattern with Hooks
- **Provider Composition**: Nested providers for different concerns
- **Custom Hooks**: Encapsulated logic with clear APIs
- **Type Safety**: Strongly typed context values and consumers

### API Design Patterns

#### RESTful Route Organization
- **Feature-Based Routes**: Routes grouped by business domain
- **Consistent Response Format**: Standardized success/error responses
- **Middleware Chain**: Common validation, auth, and error handling

**Route Structure Pattern:**
```typescript
// server/routes/orders.ts
router.post('/', validateOrderData, async (req, res) => {
  // Business logic
});

router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, updateOrderStatus);
```

#### Schema Validation Pattern
- **Zod Schemas**: Runtime type validation with TypeScript generation
- **Reusable Validators**: Shared schemas across client and server
- **Transform Pipelines**: Data transformation during validation

### Database Patterns

#### Row Level Security (RLS)
- **Policy-Based Access**: Database-level access control via policies
- **Role-Based Permissions**: Admin, Driver, User permission hierarchies
- **Secure Defaults**: Least privilege access by default

**RLS Policy Pattern:**
```sql
-- Users can only access their own orders
CREATE POLICY "orders_owner_or_admin" ON public.orders
  FOR ALL USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

#### Event-Driven Inventory
- **Inventory as Events**: Append-only event log for stock changes
- **Computed Views**: Real-time inventory levels from event aggregation
- **Audit Trail**: Complete history of all inventory changes

**Inventory Pattern:**
```sql
-- Events table for inventory changes
CREATE TABLE inventory_events (
  product_id UUID REFERENCES products(id),
  delta INTEGER NOT NULL,  -- +1 for stock in, -1 for stock out
  reason TEXT,
  created_by UUID DEFAULT auth.uid()
);

-- Computed view for current stock
CREATE VIEW inventory AS
SELECT product_id, SUM(delta) as stock_level
FROM inventory_events
GROUP BY product_id;
```

### Component Relationship Patterns

#### Container/Presentational Split
- **Presentational Components**: Pure UI components, props-only
- **Container Components**: Data fetching and state management
- **Custom Hooks**: Extracted business logic for reusability

**Hook Pattern:**
```typescript
// Container logic extracted to hook
function useProductList() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return { products: data, isLoading };
}

// Presentational component
function ProductGrid({ products, isLoading }) {
  if (isLoading) return <SkeletonGrid />;

  return (
    <div className="grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Error Handling Patterns

#### Boundary Pattern
- **Error Boundaries**: Component-level error isolation
- **Fallback UI**: User-friendly error displays
- **Error Reporting**: Centralized error logging and monitoring

**Error Boundary Pattern:**
```typescript
class ProductErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ProductErrorFallback />;
    }

    return this.props.children;
  }
}
```

#### API Error Pattern
- **Typed Errors**: Structured error responses with types
- **Toast Notifications**: User feedback for operations
- **Retry Logic**: Automatic retry for transient failures

### Performance Patterns

#### Code Splitting Pattern
- **Route-Based Splitting**: Lazy loading by page/feature
- **Component Splitting**: Expensive components loaded on demand
- **Prefetching**: Proactively loading likely-needed code

**Dynamic Import Pattern:**
```typescript
const MapView = lazy(() => import('./components/MapView'));
const CheckoutFlow = lazy(() => import('./features/checkout'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/map" element={<MapView />} />
        <Route path="/checkout" element={<CheckoutFlow />} />
      </Routes>
    </Suspense>
  );
}
```

#### Virtual Scrolling Pattern
- **Large Lists**: Efficient rendering of map locations and products
- **Windowing**: Only render visible items in viewport
- **Infinite Scrolling**: Progressive loading of additional data

### Testing Patterns

#### Component Testing Pattern
- **React Testing Library**: User-centric testing approach
- **Custom Renderers**: App wrapper for consistent test setup
- **Mock Data**: Realistic test data with factories

**Test Pattern:**
```typescript
function renderProductCard(product = mockProduct()) {
  return render(<ProductCard product={product} />, {
    wrapper: MemoryRouter,
  });
}

test('displays product information correctly', () => {
  renderProductCard();
  expect(screen.getByText('Solar Bear Mug')).toBeInTheDocument();
});
```

### Critical Implementation Paths

#### Ride Request Flow
1. **User Location** → Geolocation API → Map positioning
2. **Destination Selection** → Interactive map → Route calculation
3. **Ride Calculation** → Pricing algorithm → Fare estimation
4. **Vehicle Matching** → AI matching → Driver notification
5. **Real-time Tracking** → GPS updates → Live map markers
6. **Payment Processing** → Stripe integration → Receipt generation

#### Mobile Bodega Integration
1. **Inventory Sync** → Real-time stock levels → UI updates
2. **Order Placement** → Shopping cart → Payment gateway
3. **Driver Fulfillment** → Order delivery → Transaction completion
4. **Commission Tracking** → Revenue calculation → Vendor payouts

#### PWA Lifecycle
1. **App Installation** → Manifest detection → Add to home screen
2. **Service Worker** → Cache management → Offline support
3. **Push Notifications** → Background sync → Real-time updates
4. **Background Processing** → Task queuing → Network recovery

#### Authentication Flow
1. **User Registration** → Form validation → Supabase auth
2. **Role Assignment** → Profile creation → Permission setup
3. **Session Management** → JWT handling → Route protection
4. **Profile Updates** → Form submission → RLS policy updates

These patterns ensure consistent, maintainable, and scalable code across the entire AirBear platform while supporting the complex requirements of a multi-role, real-time transportation system.
