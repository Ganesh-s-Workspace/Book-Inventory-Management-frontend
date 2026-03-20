function Navbar({ activePage, setActivePage, handleFocusForm }) {
  return (
    <nav className="top-nav">
      <div className="brand">
        <span className="brand-mark">BI</span>
        <div>
          <p className="brand-title">Book Inventory</p>
          <p className="brand-subtitle">Simple CRUD workspace</p>
        </div>
      </div>
      <div className="nav-links">
        <button
          className={`nav-link ${activePage === 'overview' ? 'active' : ''}`}
          type="button"
          onClick={() => setActivePage('overview')}
        >
          Overview
        </button>
        <button
          className={`nav-link ${activePage === 'manage' ? 'active' : ''}`}
          type="button"
          onClick={() => setActivePage('manage')}
        >
          Manage Books
        </button>
        <button
          className={`nav-link ${activePage === 'inventory' ? 'active' : ''}`}
          type="button"
          onClick={() => setActivePage('inventory')}
        >
          Inventory
        </button>
      </div>
      <div className="nav-actions">
        <button className="primary" type="button" onClick={handleFocusForm}>
          New Book
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
