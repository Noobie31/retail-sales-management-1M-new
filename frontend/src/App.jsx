import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import StatsCards from './components/StatsCards';
import SortDropdown from './components/SortDropdown';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';
import { fetchSales, fetchFilterOptions, fetchStatistics } from './services/api';
import './App.css';

function App() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    category: [],
    tags: [],
    payment: [],
    dateFrom: '',
    dateTo: ''
  });

  const [sortBy, setSortBy] = useState('tid-asc');

  const [filterOptions, setFilterOptions] = useState({
    region: [],
    gender: [],
    category: [],
    tags: [],
    payment: []
  });

  const [statistics, setStatistics] = useState({
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0
  });

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadSales();
  }, [search, filters, sortBy, pagination.page]);

  const loadSales = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchSales({
        search,
        ...filters,
        sortBy,
        page: pagination.page,
        limit: pagination.limit
      });

      setSales(result.data);
      setPagination(result.pagination);

      const stats = await fetchStatistics({ search, ...filters });
      setStatistics(stats);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilters({
      region: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      category: [],
      tags: [],
      payment: [],
      dateFrom: '',
      dateTo: ''
    });
    setSortBy('tid-asc');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="header">
          <h1>Sales Management System</h1>
          <SearchBar 
            value={search} 
            onChange={handleSearch}
            placeholder="Name, Phone no."
          />
        </div>

        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          options={filterOptions}
          onClear={handleClearFilters}
        />

        <StatsCards statistics={statistics} />

        <div className="table-controls">
          <div className="active-filters">
            {sales.length > 0 && (
              <span className="result-count">
                Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </span>
            )}
          </div>
          
          <SortDropdown value={sortBy} onChange={handleSortChange} />
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadSales}>Try Again</button>
          </div>
        )}

        <TransactionTable 
          data={sales} 
          loading={loading}
        />

        {!loading && sales.length === 0 && (
          <div className="no-results">
            <p>No transactions found</p>
            <button onClick={handleClearFilters}>Clear Filters</button>
          </div>
        )}

        {sales.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        )}
      </div>
    </div>
  );
}

export default App;