import { useState } from 'react';
import './FilterPanel.css';

function FilterPanel({ filters, onChange, options, onClear }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleMultiSelect = (filterName, value) => {
    const current = filters[filterName] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    onChange({ ...filters, [filterName]: updated });
  };

  const handleRangeChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const getActiveCount = () => {
    let count = 0;
    if (filters.region?.length) count++;
    if (filters.gender?.length) count++;
    if (filters.ageMin || filters.ageMax) count++;
    if (filters.category?.length) count++;
    if (filters.tags?.length) count++;
    if (filters.payment?.length) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  const FilterDropdown = ({ name, label, options, values = [] }) => (
    <div className="filter-dropdown">
      <button 
        className={`filter-button ${values.length > 0 ? 'active' : ''}`}
        onClick={() => toggleDropdown(name)}
      >
        {label}
        {values.length > 0 && <span className="badge">{values.length}</span>}
        <svg 
          className={`chevron ${activeDropdown === name ? 'open' : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {activeDropdown === name && (
        <div className="dropdown-menu">
          {options.map(option => (
            <label key={option} className="dropdown-item">
              <input
                type="checkbox"
                checked={values.includes(option)}
                onChange={() => handleMultiSelect(name, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="filter-panel">
      <div className="filter-controls">
        <button className="reset-button" onClick={onClear}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M14 8A6 6 0 1 0 2 8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path d="M2 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <FilterDropdown
          name="region"
          label="Customer Region"
          options={options.region}
          values={filters.region}
        />

        <FilterDropdown
          name="gender"
          label="Gender"
          options={options.gender}
          values={filters.gender}
        />

        <div className="filter-dropdown">
          <button 
            className={`filter-button ${filters.ageMin || filters.ageMax ? 'active' : ''}`}
            onClick={() => toggleDropdown('ageRange')}
          >
            Age Range
            <svg 
              className={`chevron ${activeDropdown === 'ageRange' ? 'open' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>

          {activeDropdown === 'ageRange' && (
            <div className="dropdown-menu range-menu">
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.ageMin}
                  onChange={(e) => handleRangeChange('ageMin', e.target.value)}
                  min="0"
                  max="120"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.ageMax}
                  onChange={(e) => handleRangeChange('ageMax', e.target.value)}
                  min="0"
                  max="120"
                />
              </div>
            </div>
          )}
        </div>

        <FilterDropdown
          name="category"
          label="Product Category"
          options={options.category}
          values={filters.category}
        />

        <FilterDropdown
          name="tags"
          label="Tags"
          options={options.tags}
          values={filters.tags}
        />

        <FilterDropdown
          name="payment"
          label="Payment Method"
          options={options.payment}
          values={filters.payment}
        />

        <div className="filter-dropdown">
          <button 
            className={`filter-button ${filters.dateFrom || filters.dateTo ? 'active' : ''}`}
            onClick={() => toggleDropdown('date')}
          >
            Date
            <svg 
              className={`chevron ${activeDropdown === 'date' ? 'open' : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16"
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>

          {activeDropdown === 'date' && (
            <div className="dropdown-menu range-menu">
              <div className="date-inputs">
                <div className="date-field">
                  <label>From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleRangeChange('dateFrom', e.target.value)}
                  />
                </div>
                <div className="date-field">
                  <label>To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleRangeChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {getActiveCount() > 0 && (
        <div className="active-filters-info">
          {getActiveCount()} filter{getActiveCount() > 1 ? 's' : ''} active
        </div>
      )}
    </div>
  );
}

export default FilterPanel;