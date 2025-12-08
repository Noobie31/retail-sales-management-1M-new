import './TransactionTable.css';

function TransactionTable({ data, loading }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer region</th>
            <th>Product ID</th>
            <th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              <td className="transaction-id">{row.tid}</td>
              <td>{formatDate(row.date)}</td>
              <td>{row.cid}</td>
              <td className="customer-name">{row.cname}</td>
              <td className="phone-number">
                {row.phone}
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(row.phone)}
                  title="Copy phone number"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 9V3a1 1 0 0 1 1-1h6" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </td>
              <td>{row.gender}</td>
              <td>{row.age}</td>
              <td>
                <span className="category-badge">{row.category}</span>
              </td>
              <td className="quantity">{row.qty}</td>
              <td className="amount">{formatCurrency(row.total)}</td>
              <td>{row.region}</td>
              <td>{row.pid}</td>
              <td className="employee-name">{row.ename}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;