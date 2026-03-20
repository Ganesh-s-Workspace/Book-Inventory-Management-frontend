function OverviewSection({
  totalTitles,
  totalCopies,
  totalGenres,
  lowStockCount,
  handleFocusForm,
  setActivePage,
  handleResetFilters,
}) {
  return (
    <>
      <header className="page-hero">
        <div>
          <p className="eyebrow">Inventory Control</p>
          <h1>Keep every shelf accurate, clean, and searchable.</h1>
          <p className="subtitle">
            Jump into quick actions or review your latest inventory health at a glance.
          </p>
        </div>
        <div className="hero-actions">
          <button className="primary" type="button" onClick={handleFocusForm}>
            Add new book
          </button>
          <button className="ghost" type="button" onClick={() => setActivePage('inventory')}>
            Browse inventory
          </button>
        </div>
      </header>

      <section className="overview-grid">
        <article className="panel overview-card">
          <h3>Inventory snapshot</h3>
          <p className="muted">Live totals updated with every change.</p>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Titles</span>
              <span className="stat-value">{totalTitles}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Copies</span>
              <span className="stat-value">{totalCopies}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Genres</span>
              <span className="stat-value">{totalGenres}</span>
            </div>
          </div>
        </article>

        <article className="panel overview-card">
          <h3>Quick actions</h3>
          <p className="muted">Keep your records tidy and current.</p>
          <div className="quick-actions">
            <button className="primary" type="button" onClick={handleFocusForm}>
              Add a book
            </button>
            <button className="ghost" type="button" onClick={() => setActivePage('inventory')}>
              Review inventory
            </button>
            <button className="ghost" type="button" onClick={handleResetFilters}>
              Reset filters
            </button>
          </div>
        </article>

        <article className="panel overview-card highlight">
          <h3>Low stock watch</h3>
          <p className="muted">Titles with 2 or fewer copies.</p>
          <div className="stock-count">
            <span className="stock-number">{lowStockCount}</span>
            <span className="stock-label">need attention</span>
          </div>
          <button className="ghost" type="button" onClick={() => setActivePage('inventory')}>
            View titles
          </button>
        </article>
      </section>
    </>
  );
}

export default OverviewSection;
