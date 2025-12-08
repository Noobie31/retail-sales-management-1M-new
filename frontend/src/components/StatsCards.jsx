import './StatsCards.css';

function StatsCards({ statistics }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total units sold</span>
          <button className="info-button" title="Total quantity of products sold">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="stat-value">{formatNumber(statistics.totalUnits)}</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Amount</span>
          <button className="info-button" title="Total sales amount before discount">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="stat-value">
          {formatCurrency(statistics.totalAmount)}
          <span className="stat-count">
            ({statistics.totalRecords || 0} SRs)
          </span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Discount</span>
          <button className="info-button" title="Total discount given across all sales">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v4M8 5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="stat-value">
          {formatCurrency(statistics.totalDiscount)}
          <span className="stat-count">
            ({statistics.totalRecords || 0} SRs)
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;