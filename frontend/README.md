# Sales Management System - Frontend

React-based user interface for retail sales data visualization and management.

## Features

- Real-time search with debouncing
- Multi-select filters across 7 dimensions
- Dynamic sorting (Date, Quantity, Name)
- Server-side pagination
- Responsive design
- Statistics dashboard
- Clean, minimal UI

## Tech Stack

- **React** 18.2 - UI framework
- **Vite** - Build tool & dev server
- **Vanilla CSS** - Styling (no UI libraries)
- **Fetch API** - HTTP requests

## Prerequisites

- Node.js v18+
- npm or yarn
- Backend server running on port 5000

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the App

### Development Mode
```bash
npm run dev
```

Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
```

Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── SearchBar.css
│   ├── FilterPanel.jsx
│   ├── FilterPanel.css
│   ├── StatsCards.jsx
│   ├── StatsCards.css
│   ├── SortDropdown.jsx
│   ├── SortDropdown.css
│   ├── TransactionTable.jsx
│   ├── TransactionTable.css
│   ├── Pagination.jsx
│   ├── Pagination.css
│   ├── Sidebar.jsx
│   └── Sidebar.css
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Component Architecture

```
App (State Management)
├── Sidebar (Navigation)
└── MainContent
    ├── Header
    │   ├── Title
    │   └── SearchBar (Debounced input)
    ├── FilterPanel (Multi-select dropdowns)
    ├── StatsCards (Total units, amount, discount)
    ├── TableControls
    │   ├── ResultCount
    │   └── SortDropdown
    ├── TransactionTable (10 rows per page)
    └── Pagination (Page navigation)
```

## State Management

### Main App State
```javascript
{
  sales: [],
  pagination: { ... },
  
  search: '',
  filters: {
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    dateFrom: '',
    dateTo: ''
  },
  
  sortBy: 'date-desc',
  loading: false,
  error: null,
  
  filterOptions: { ... }
}
```

## Features Implementation

### Search
- Debounced input (500ms delay)
- Searches customer name and phone number
- Case-insensitive
- Maintains active filters

**Code:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    onChange(localValue);
  }, 500);
  return () => clearTimeout(timer);
}, [localValue]);
```

### Filters
- 7 filter dimensions
- Multi-select for categories
- Range inputs for age and date
- Immediate state update
- Resets page to 1 on change

**Available Filters:**
1. Customer Region (multi-select)
2. Gender (multi-select)
3. Age Range (min/max)
4. Product Category (multi-select)
5. Tags (multi-select)
6. Payment Method (multi-select)
7. Date Range (from/to)

### Sorting
- Date (Newest/Oldest First)
- Quantity (High/Low)
- Customer Name (A-Z/Z-A)
- Preserves search and filters

### Pagination
- 10 items per page
- Next/Previous buttons
- Page number buttons with ellipsis
- Maintains all active states
- Smooth scroll to top on page change

## API Integration

### Service Layer (`api.js`)

```javascript
fetchSales({ search, filters, sortBy, page, limit })

fetchFilterOptions()

fetchStatistics({ search, filters })

fetchAgeRange()
```

### Request Format
```javascript
{
  search: 'John',
  customerRegion: ['North', 'South'],
  gender: ['Male'],
  ageMin: 25,
  ageMax: 45,
  sortBy: 'date-desc',
  page: 1,
  limit: 10
}
```

## Styling Approach

### CSS Architecture
- Component-scoped CSS - Each component has its own CSS file
- No CSS-in-JS - Pure CSS for maintainability
- No UI frameworks - Custom components matching Figma design
- Responsive - Mobile-friendly breakpoints

### Design System
```css
--primary: #007aff;
--text: #1d1d1f;
--text-secondary: #666;
--border: #d2d2d7;
--background: #f5f5f7;

--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
```

## User Experience Features

### Loading States
- Spinner animation during data fetch
- Disabled buttons while loading
- Skeleton loading (can be added)

### Error Handling
- User-friendly error messages
- Retry functionality
- Network error detection

### Empty States
- "No results" message
- Clear filters button
- Helpful guidance

### Interactive Elements
- Hover effects on buttons and rows
- Copy phone number to clipboard
- Active state indicators
- Smooth transitions

## Performance Optimizations

1. Debounced Search - Reduces API calls
2. Pagination - Loads only 10 records at a time
3. Efficient Re-renders - Proper state management
4. Vite HMR - Fast development experience
5. Code Splitting - Automatic via Vite

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Hot Module Replacement
Vite provides instant HMR - changes reflect immediately without full reload.

### Component Development
```bash
npm run dev
```

### Adding New Components
1. Create component file: `src/components/NewComponent.jsx`
2. Create styles: `src/components/NewComponent.css`
3. Import in parent component
4. Add to component hierarchy

## Building for Production

```bash
npm run build

npm run preview

```

### Optimization
- Minified JavaScript
- CSS extraction and minification
- Asset optimization
- Tree shaking (removes unused code)

## Deployment

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

### Manual Deployment
1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure server to redirect to `index.html`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

All Vite env vars must start with `VITE_`

## Troubleshooting

### Port Already in Use
```bash
server: { port: 5174 }
```

### API Connection Issues
```bash
VITE_API_URL=http://localhost:5000/api

curl http://localhost:5000/health
```

### Build Errors
```bash
rm -rf node_modules .vite package-lock.json
npm install

npm run build
```

### CORS Errors
- Ensure backend has CORS enabled
- Check backend CORS configuration includes frontend URL
- Verify proxy settings in `vite.config.js`

## Testing (To Be Implemented)

### Component Tests
```bash
npm install --save-dev @testing-library/react vitest
```

### E2E Tests
```bash
npm install --save-dev cypress
```


## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

