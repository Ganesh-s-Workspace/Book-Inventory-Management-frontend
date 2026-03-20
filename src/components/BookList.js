function BookList({
  loading,
  books,
  filteredBooks,
  searchTerm,
  setSearchTerm,
  genreFilter,
  setGenreFilter,
  genres,
  sortBy,
  setSortBy,
  activeFilters,
  handleResetFilters,
  handleFocusForm,
  handleEdit,
  handleDelete,
}) {
  return (
    <section className="inventory-layout">
      <div className="panel list-panel">
        <div className="panel-header">
          <h2>Inventory overview</h2>
          <p>Browse, update, or remove books instantly.</p>
          <span className="count">{filteredBooks.length} shown</span>
        </div>

        <div className="list-actions">
          <div className="search">
            <div className="search-group">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search title, author, ISBN"
              />
              {searchTerm ? (
                <button className="chip" type="button" onClick={() => setSearchTerm('')}>
                  Clear
                </button>
              ) : null}
            </div>
          </div>
          <div className="filters">
            <label>
              Genre
              <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
                <option value="all">All genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
                <option value="year">Newest year</option>
                <option value="copies">Most copies</option>
              </select>
            </label>
            <div className="filter-meta">
              <span className="filter-count">{activeFilters} active</span>
              <button className="chip" type="button" onClick={handleResetFilters}>
                Reset filters
              </button>
            </div>
          </div>
        </div>

        {loading ? <p className="muted">Loading inventory...</p> : null}
        {!loading && books.length === 0 ? (
          <div className="empty-state">
            <p className="muted">No books yet. Add your first record.</p>
            <button className="primary" type="button" onClick={handleFocusForm}>
              Add your first book
            </button>
          </div>
        ) : null}
        {!loading && books.length > 0 && filteredBooks.length === 0 ? (
          <p className="muted">No matches. Try a different search or filter.</p>
        ) : null}

        <div className="book-grid">
          {filteredBooks.map((book, index) => (
            <article key={book.id} className="book-card" style={{ '--delay': `${index * 0.04}s` }}>
              <div>
                <h3>{book.title}</h3>
                <p className="meta">by {book.author}</p>
              </div>
              <div className="book-details">
                <span>{book.genre || 'Genre not set'}</span>
                <span>Year: {book.publishedYear || 'N/A'}</span>
                <span>ISBN: {book.isbn || 'N/A'}</span>
                <span>Copies: {book.quantity ?? 0}</span>
              </div>
              <div className="card-actions">
                <button className="ghost" type="button" onClick={() => handleEdit(book)}>
                  Edit
                </button>
                <button className="danger" type="button" onClick={() => handleDelete(book.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookList;
