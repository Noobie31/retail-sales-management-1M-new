import './SortDropdown.css';

function SortDropdown({ value, onChange }) {
  return (
    <div className="sort-dropdown">
      <label>Sort by:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="tid-asc">Transaction ID (Ascending)</option>
        <option value="tid-desc">Transaction ID (Descending)</option>
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="quantity-desc">Quantity (High to Low)</option>
        <option value="quantity-asc">Quantity (Low to High)</option>
        <option value="name-asc">Customer Name (A-Z)</option>
        <option value="name-desc">Customer Name (Z-A)</option>
      </select>
    </div>
  );
}

export default SortDropdown;  