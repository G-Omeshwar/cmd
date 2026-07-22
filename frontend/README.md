# Frontend README

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API URL
nano .env
```

### Running the Application

```bash
# Development mode
npm start

# Production build
npm run build

# Test
npm test
```

Application runs on `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.tsx             # Main layout with navbar/sidebar
│   │   └── ProtectedRoute.tsx     # Auth-protected routes
│   ├── context/
│   │   └── AuthContext.tsx        # Authentication state
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Customers.tsx
│   │   ├── CustomerDetail.tsx
│   │   ├── Products.tsx
│   │   ├── Challans.tsx
│   │   ├── ChallanCreate.tsx
│   │   ├── ChallanDetail.tsx
│   │   └── Inventory.tsx
│   ├── services/
│   │   └── api.ts                 # Axios API client
│   ├── index.css                  # Global styles
│   ├── index.tsx                  # Entry point
│   └── App.tsx                    # Main app component
├── .env.example                   # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_APP_NAME=ERP CRM Portal
```

## Pages Overview

### Login Page
- User authentication
- Test credentials displayed
- JWT token stored locally

### Dashboard
- Overview statistics
- Quick action buttons
- Key metrics display

### Customers
- View all customers
- Search and filter
- Create new customers
- View customer details
- Manage follow-ups

### Products
- Product catalog
- Search and category filter
- Add new products
- Stock status indicators

### Sales Challans
- List all challans
- Filter by status
- Create new challan
- Confirm/cancel challan
- View challan details

### Inventory
- Stock movement history
- Low stock alerts
- Manual stock adjustments
- Movement tracking

## Key Features

✅ Responsive UI (Mobile-friendly)
✅ Authentication with JWT
✅ Role-based access control
✅ Form validation
✅ Pagination
✅ Search and filter
✅ Real-time error handling
✅ Loading states
✅ Empty states
✅ Bootstrap 5 styling

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Bootstrap 5**: CSS framework
- **Bootstrap Icons**: Icon library
- **Context API**: State management

## Component Hierarchy

```
App
├── AuthProvider
│   ├── Login (public route)
│   └── ProtectedRoute
│       └── Layout
│           ├── Navbar
│           ├── Sidebar
│           └── Content Area
│               ├── Dashboard
│               ├── Customers
│               ├── Products
│               ├── Challans
│               └── Inventory
```

## Authentication Flow

1. User enters credentials on Login page
2. Submit to `/auth/login` API
3. Receive JWT token
4. Store token and user info in localStorage
5. Set Authorization header for all requests
6. Token validated by AuthContext
7. ProtectedRoute redirects unauthorized users

## API Integration

### API Service
```typescript
// services/api.ts
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Auto-refresh on 401
api.interceptors.response.use(...)
```

### Usage in Components
```typescript
const response = await api.get('/customers');
const { data } = await api.post('/customers', formData);
```

## Styling

- **Bootstrap 5**: Grid, components, utilities
- **Custom CSS**: `index.css` for custom styles
- **Responsive**: Mobile-first design
- **Dark Mode**: Can be added via Bootstrap themes

## Form Handling

- Local state management
- Client-side validation
- Server-side validation feedback
- Success/error alerts
- Loading states

## Error Handling

- API error messages displayed
- User-friendly error text
- 401 redirects to login
- Network error handling
- Validation error display

## Performance

- Code splitting via React Router
- Lazy loading of pages (can be added)
- Pagination for large lists
- Debounced search
- Optimized re-renders

## Troubleshooting

### API Connection Error
```
Fix: Check REACT_APP_API_BASE_URL in .env
     Ensure backend is running
     Check CORS settings on backend
```

### Login Not Working
```
Fix: Verify backend /auth/login endpoint
     Check credentials in test credentials
     Check browser console for errors
```

### Blank Page
```
Fix: Check browser console for errors
     Clear browser cache: Ctrl+Shift+Del
     Verify API is accessible
```

## Development

### Hot Reload
Changes auto-reload in development mode

### Debugging
- React DevTools extension
- Browser DevTools
- Console logging

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Add sidebar link in `Layout.tsx`

## Building for Production

```bash
npm run build

# Output in build/ directory
# Ready to deploy to Vercel/Netlify
```

## Deployment

See `docs/DEPLOYMENT.md` for deployment instructions.

## License

MIT
