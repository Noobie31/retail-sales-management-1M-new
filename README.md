# Retail Sales Management System

A full-stack MERN application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

## Overview

This system processes and displays 1 million+ sales records with real-time search, multi-select filtering across 7+ dimensions, and performant pagination. Built with MongoDB for efficient querying, Express/Node.js for robust API handling, and React for a responsive user interface.

## Tech Stack

**Frontend:**
- React 18.2
- Vite (Build Tool)
- Vanilla CSS (No UI libraries)
- Fetch API for HTTP requests

**Backend:**
- Node.js v18+
- Express.js 4.18
- MongoDB 6.0+ with Mongoose 8.0
- CSV Parser for data import

## Search Implementation Summary

Full-text search across Customer Name and Phone Number fields using MongoDB regex with case-insensitive matching. Implements 500ms debouncing on the frontend to reduce API calls. Search maintains state alongside all active filters and sorting options.

## Filter Implementation Summary

Multi-select filtering with independent and combined operation support across 7 dimensions: Customer Region, Gender, Age Range (numeric range), Product Category, Tags, Payment Method, and Date Range. Backend uses MongoDB `$and` operator to combine all active filters. Frontend manages filter state and syncs with URL parameters for shareable links.

## Sorting Implementation Summary

Three sorting modes: Date (Newest/Oldest First), Quantity (High/Low), and Customer Name (A-Z/Z-A). Implemented using MongoDB's `.sort()` method with indexed fields for performance. Sorting preserves all active search and filter states.

## Pagination Implementation Summary

Server-side pagination with 10 items per page. Uses MongoDB's `skip()` and `limit()` methods with total count aggregation. Frontend displays page numbers with ellipsis for large datasets and Previous/Next navigation. Page state persists through filter and sort changes.

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- MongoDB 6.0 or higher (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd retail-sales-management
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

4. **Configure environment variables:**

Backend (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/salesDB
PORT=5000
NODE_ENV=development
```

Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Import CSV data:**
```bash
cd backend
npm run import ../path/to/sales_data.csv
```

6. **Start the application:**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

7. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### MongoDB Atlas Setup (Alternative)

If using MongoDB Atlas instead of local MongoDB:

1. Create a cluster at https://cloud.mongodb.com
2. Get your connection string
3. Update `MONGODB_URI` in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salesDB
```

## API Endpoints

- `GET /api/sales` - Get sales with filters, sorting, pagination
- `GET /api/sales/filters` - Get available filter options
- `GET /api/sales/statistics` - Get summary statistics
- `GET /api/sales/age-range` - Get age range from dataset

## Project Structure

See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.

## Development

**Backend development:**
```bash
cd backend
npm run dev  
```

**Frontend development:**
```bash
cd frontend
npm run dev  
```

**Build for production:**
```bash
cd frontend
npm run build  
```

## Features

✅ Full-text search across customer data  
✅ Multi-select filtering with 7 dimensions  
✅ Three sorting modes  
✅ Server-side pagination (10 items/page)  
✅ Real-time statistics dashboard  
✅ Copy-to-clipboard for phone numbers  
✅ Responsive design  
✅ Loading states and error handling  
✅ URL state management for shareable links  

## Performance Optimizations

- MongoDB indexes on frequently queried fields
- Debounced search input (500ms)
- Efficient aggregation pipelines for statistics
- Batch data import with progress tracking
- Frontend memoization of expensive computations