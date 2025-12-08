import './Sidebar.css';

function Sidebar({ isOpen, onToggle }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d={isOpen ? "M10 4L6 8l4 4" : "M6 4l4 4-4 4"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>
              </svg>
            </div>
            {isOpen && (
              <div className="brand-info">
                <h3>Vault</h3>
                <p>Anurag Yadav</p>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item" title="Dashboard">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {isOpen && <span>Dashboard</span>}
          </a>

          <a href="#" className="nav-item" title="Nexus">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {isOpen && <span>Nexus</span>}
          </a>

          <a href="#" className="nav-item" title="Intake">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {isOpen && <span>Intake</span>}
          </a>

          <div className="nav-section">
            <button className="nav-item nav-item-expandable" title="Services">
              <div className="nav-item-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {isOpen && <span>Services</span>}
              </div>
              {isOpen && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>

            {isOpen && (
              <div className="nav-subitems">
                <a href="#" className="nav-subitem">Pre-active</a>
                <a href="#" className="nav-subitem active">Active</a>
                <a href="#" className="nav-subitem">Blocked</a>
                <a href="#" className="nav-subitem">Closed</a>
              </div>
            )}
          </div>

          <div className="nav-section">
            <button className="nav-item nav-item-expandable" title="Invoices">
              <div className="nav-item-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 2v4M14 2v4M3 8h14M5 4h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                {isOpen && <span>Invoices</span>}
              </div>
              {isOpen && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              )}
            </button>

            {isOpen && (
              <div className="nav-subitems">
                <a href="#" className="nav-subitem">Proforma Invoices</a>
                <a href="#" className="nav-subitem">Final Invoices</a>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle}></div>
      )}
    </>
  );
}

export default Sidebar;