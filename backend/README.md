# Sales Management System - Backend

Express.js REST API with MongoDB for retail sales data management.

## Features

- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Full-text search with indexes
- Multi-dimensional filtering
- Server-side pagination
- Aggregation pipelines for statistics
- CSV bulk import utility

## Prerequisites

- Node.js v18+
- MongoDB 6.0+
- npm or yarn

## Installation

```bash
npm install
```

## Environment Setup

Create `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/salesDB
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Importing Data

### Import from CSV
```bash
npm run import path/to/sales_data.csv
```

### Import Options
The script will:
1. Ask if you want to clear existing data
2. Show progress bar during import
3. Process 10,000 records per batch
4. Create indexes after import
5. Display import statistics

Example output:
```
Analyzing CSV file...
Import Progress |████████████████████| 100% | 1000000/1000000
Import completed!
  Total records: 1000000
  Errors: 0
Duration: 180.52s
```

## API Endpoints

### Get Sales Data
```
GET /api/sales
```

**Query Parameters:**
- `search` - Search customer name or phone
- `customerRegion[]` - Filter by region (multi-select)
- `gender[]` - Filter by gender (multi-select)
- `ageMin` - Minimum age
- `ageMax` - Maximum age
- `productCategory[]` - Filter by category (multi-select)
- `tags[]` - Filter by tags (multi-select)
- `paymentMethod[]` - Filter by payment method (multi-select)
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)
- `sortBy` - Sort field (date-desc, quantity-desc, name-asc, etc.)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```bash
curl "http://localhost:5000/api/sales?search=John&customerRegion=North&gender=Male&ageMin=25&ageMax=45&sortBy=date-desc&page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [...],
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

### Get Filter Options
```
GET /api/sales/filters
```

Returns unique values for all filterable fields.

**Response:**
```json
{
  "success": true,
  "data": {
    "customerRegion": ["North", "South", "East", "West"],
    "gender": ["Male", "Female"],
    "productCategory": ["Electronics", "Clothing", ...],
    "tags": ["Premium", "Seasonal", ...],
    "paymentMethod": ["Card", "Cash", "UPI", ...]
  }
}
```

### Get Statistics
```
GET /api/sales/statistics
```

Accepts same query parameters as `/api/sales` for filtered statistics.

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

### Get Age Range
```
GET /api/sales/age-range
```

**Response:**
```json
{
  "success": true,
  "data": {
    "min": 18,
    "max": 85
  }
}
```

### Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-06T10:30:00.000Z",
  "mongodb": "connected"
}
```

## Project Structure

```
src/
├── controllers/
│   └── salesController.js
├── services/
│   └── salesService.js
├── models/
│   └── Sales.js
├── routes/
│   └── salesRoutes.js
├── utils/
│   ├── queryBuilder.js
│   └── validation.js
└── index.js

scripts/
└── importData.js
```

## Database Schema

```javascript
{
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

## Performance Optimization

### Indexes
- Text indexes on customerName and phoneNumber for search
- Single field indexes on all filterable fields
- Compound indexes for common query patterns

### Query Optimization
- Uses `.lean()` for faster queries
- Implements pagination to limit data transfer
- Aggregation pipelines for statistics

### Batch Processing
- CSV import processes 10,000 records per batch
- Prevents memory overflow on large datasets

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

### Manual Testing
```bash
curl http://localhost:5000/health

curl http://localhost:5000/api/sales?page=1&limit=5

curl http://localhost:5000/api/sales?search=John

curl http://localhost:5000/api/sales?customerRegion=North&gender=Male
```

### MongoDB Queries
```javascript
db.sales.countDocuments()

db.sales.findOne()

db.sales.getIndexes()

db.sales.find({ customerRegion: "North" }).explain("executionStats")
```

## Troubleshooting

### MongoDB Connection Failed
```bash
mongosh

sudo systemctl restart mongod
brew services restart mongodb-community
```

### Import Errors
```bash
ls -la path/to/file.csv

head -n 5 sales_data.csv

node scripts/importData.js /absolute/path/to/sales_data.csv
```

### Port Already in Use
```bash
PORT=5001

lsof -i :5000
kill -9 <PID>
```

## Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `morgan` - HTTP logger
- `dotenv` - Environment variables
- `csv-parser` - CSV parsing
- `cli-progress` - Progress bars

### Development
- `nodemon` - Auto-reload during development

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run import <file>` - Import CSV data

## Contributing

1. Follow existing code structure
2. Maintain separation of concerns (routes → controllers → services)
3. Add error handling for all async operations
4. Update this README if adding new endpoints

## License

MIT
