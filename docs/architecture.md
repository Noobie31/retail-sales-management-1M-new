# Architecture Documentation

## System Overview

The Retail Sales Management System follows a three-tier architecture:

1. **Presentation Layer** (React Frontend)
2. **Application Layer** (Express.js Backend)
3. **Data Layer** (MongoDB)

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 5173)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Components  │  │    Services  │  │     Hooks    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/REST
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend (Port 5000)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routes     │─▶│ Controllers  │─▶│   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                         Mongoose ODM
                              │
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB (Port 27017)                      │
│                      Sales Collection                        │
│                     (1M+ Documents)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── salesController.js
│   ├── services/
│   │   └── salesService.js
│   ├── models/
│   │   └── Sales.js
│   ├── routes/
│   │   └── salesRoutes.js
│   ├── utils/
│   │   ├── queryBuilder.js
│   │   └── validation.js
│   └── index.js
├── scripts/
│   └── importData.js
├── package.json
├── .env
└── README.md
```

### Module Responsibilities

#### **1. Models (Data Layer)**
- `Sales.js`: Defines MongoDB schema with 25+ fields
- Implements indexes for search and filter optimization
- Virtual fields for computed properties (transactionId)

**Key Indexes:**
```javascript
- { customerName: 'text', phoneNumber: 'text' }
- { date: -1, quantity: -1 }
- { customerRegion: 1, gender: 1, productCategory: 1 }
```

#### **2. Services (Business Logic)**
- `salesService.js`: Core business logic layer
- **buildQuery()**: Constructs MongoDB queries from filters
- **buildSort()**: Maps sort parameters to MongoDB syntax
- **getSales()**: Main data fetching with pagination
- **getFilterOptions()**: Returns unique filter values
- **getStatistics()**: Aggregates summary data

**Query Building Strategy:**
```javascript
{
  $and: [
    { $or: [
      { customerName: /search/i },
      { phoneNumber: /search/i }
    ]},
    { customerRegion: { $in: ['North', 'South'] } },
    { age: { $gte: 25, $lte: 45 } },
    { date: { $gte: startDate, $lte: endDate } }
  ]
}
```

#### **3. Controllers (Request Handlers)**
- `salesController.js`: HTTP request/response handling
- Validates query parameters
- Parses arrays from URL params
- Calls service layer methods
- Formats responses with proper status codes

#### **4. Routes (API Endpoints)**
- `salesRoutes.js`: Defines RESTful endpoints
- Maps HTTP methods to controller functions
- Documents query parameters

**Endpoints:**
```
GET  /api/sales
GET  /api/sales/filters
GET  /api/sales/statistics
GET  /api/sales/age-range
```

#### **5. Scripts (Utilities)**
- `importData.js`: Batch CSV import with progress tracking
- Processes 10,000 records per batch
- Handles data transformation and validation
- Creates indexes after import

---

## Frontend Architecture

### Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── StatsCards.jsx
│   │   ├── SortDropdown.jsx
│   │   ├── TransactionTable.jsx
│   │   ├── Pagination.jsx
│   │   ├── Sidebar.jsx
│   │   └── *.css
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   ├── useSales.js
│   │   └── useFilters.js
│   ├── utils/
│   │   └── queryString.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

### Component Hierarchy

```
App
├── Sidebar
└── MainContent
    ├── Header
    │   ├── Title
    │   └── SearchBar
    ├── FilterPanel
    │   └── FilterDropdown[]
    ├── StatsCards
    │   └── StatCard[]
    ├── TableControls
    │   ├── ResultCount
    │   └── SortDropdown
    ├── TransactionTable
    │   ├── TableHeader
    │   └── TableBody
    │       └── TableRow[]
    └── Pagination
        ├── PrevButton
        ├── PageNumbers
        └── NextButton
```

### State Management

**Main App State:**
```javascript
{
  sales: [],
  pagination: { page, total, totalPages, hasNext, hasPrev },
  
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

### Data Flow

1. **User Interaction**
   - User types in search bar → Debounced (500ms) → Updates state
   - User selects filter → Immediate state update
   - User changes page → Page state update

2. **Effect Trigger**
   - State changes trigger `useEffect` hook
   - Resets page to 1 for search/filter changes
   - Maintains page for navigation changes

3. **API Call**
   - `loadSales()` function builds query params
   - Calls `fetchSales(params)` from api service
   - Simultaneously fetches statistics

4. **Response Handling**
   - Updates sales data and pagination state
   - Updates statistics cards
   - Handles loading and error states

5. **UI Update**
   - React re-renders affected components
   - Table displays new data
   - Pagination buttons update

---

## Data Flow Diagrams

### Search Flow
```
User Input → Debounce (500ms) → setState
                                    ↓
                              useEffect hook
                                    ↓
                            Build query params
                                    ↓
                              API Request
                                    ↓
                    Backend: Build MongoDB query
                                    ↓
                    Execute query with indexes
                                    ↓
                         Return paginated results
                                    ↓
                    Frontend: Update state & UI
```

### Filter Flow
```
User Selection → Toggle filter array → setState
                                           ↓
                                    useEffect hook
                                           ↓
                                 Reset page to 1
                                           ↓
                                Build combined query
                                           ↓
                                    API Request
                                           ↓
          Backend: Combine all filters with $and
                                           ↓
                              Execute filtered query
                                           ↓
                         Return matching records
                                           ↓
                        Frontend: Display results
```

---

## Database Schema

### Sales Collection

```javascript
{
  _id: ObjectId,
  
  customerId: String (indexed),
  customerName: String (text index),
  phoneNumber: String (text index),
  gender: String (indexed),
  age: Number (indexed),
  customerRegion: String (indexed),
  customerType: String,
  
  productId: String (indexed),
  productName: String,
  brand: String,
  productCategory: String (indexed),
  tags: [String] (indexed),
  
  quantity: Number (indexed),
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  
  date: Date (indexed),
  paymentMethod: String (indexed),
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salespersonId: String,
  employeeName: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Index Strategy

**Compound Indexes:**
1. `{ customerName: 'text', phoneNumber: 'text' }` - Full-text search
2. `{ date: -1, quantity: -1 }` - Sorting optimization
3. `{ customerRegion: 1, gender: 1, productCategory: 1 }` - Multi-filter optimization

**Single Field Indexes:**
- All filterable fields (customerRegion, gender, age, productCategory, tags, paymentMethod, date)
- Primary keys (customerId, productId)

---

## API Request/Response Format

### GET /api/sales

**Request:**
```
GET /api/sales?search=John&customerRegion=North&customerRegion=South&gender=Male&ageMin=25&ageMax=45&sortBy=date-desc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "transactionId": "ABC1234",
      "customerName": "John Doe",
      "phoneNumber": "+91 1234567890",
      "age": 32,
      "customerRegion": "North",
      "productCategory": "Electronics",
      "quantity": 2,
      "totalAmount": 50000,
      "date": "2023-10-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1547,
    "totalPages": 155,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET /api/sales/statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUnits": 15420,
    "totalAmount": 8900000,
    "totalDiscount": 445000,
    "totalRecords": 1547
  }
}
```

---

## Performance Considerations

### Backend Optimizations
1. **Indexed Queries**: All filter and sort fields are indexed
2. **Pagination**: Uses `skip()` and `limit()` to fetch only required data
3. **Lean Queries**: `.lean()` returns plain JavaScript objects instead of Mongoose documents
4. **Aggregation Pipelines**: Efficient statistical calculations
5. **Connection Pooling**: MongoDB driver maintains connection pool

### Frontend Optimizations
1. **Debouncing**: Search input debounced to 500ms
2. **State Management**: Minimal re-renders with proper state updates
3. **Lazy Loading**: Only visible data is rendered
4. **Memoization**: Expensive computations are memoized (can be added with useMemo)
5. **Code Splitting**: Vite automatically splits code for optimal loading

### Scalability Strategies
- **Cursor-based Pagination**: Can replace offset pagination for very large datasets
- **Caching**: Redis can cache frequently accessed filter options
- **CDN**: Static assets served via CDN for production
- **Load Balancing**: Multiple backend instances behind load balancer
- **Database Sharding**: MongoDB sharding for horizontal scaling

---

## Security Measures

1. **Input Validation**: All user inputs are sanitized
2. **CORS Configuration**: Restricted to frontend origin
3. **Helmet.js**: Security headers configured
4. **Rate Limiting**: Can be added to prevent abuse
5. **Environment Variables**: Sensitive data in .env files
6. **MongoDB Injection Prevention**: Mongoose sanitizes queries

---

## Error Handling

### Backend Error Flow
```
Error occurs → Try/Catch block → Logger → Error response → Client
```

### Frontend Error Flow
```
API Error → .catch() → setState(error) → Display error UI → Retry option
```

---

## Testing Strategy

### Backend Tests (To Be Implemented)
- Unit tests for service layer functions
- Integration tests for API endpoints
- Database query performance tests

### Frontend Tests (To Be Implemented)
- Component unit tests with React Testing Library
- Integration tests for user flows
- E2E tests with Playwright/Cypress

---

## Deployment Architecture

### Production Setup

```
Users → CDN (Frontend) → Load Balancer → Backend Servers → MongoDB Atlas
```

**Recommended Stack:**
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / AWS EC2
- **Database**: MongoDB Atlas (Managed)
- **CDN**: Cloudflare / AWS CloudFront
