<<<<<<< HEAD
import { useCallback, useEffect, useRef, useState } from 'react';
=======

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
>>>>>>> fea107d (old code)
import './App.css';

const AZURE_API_URL =
  'https://booking-backend-bqfrbyeeaactgegx.southeastasia-01.azurewebsites.net/api/books';
const LOCAL_API_URL = 'http://localhost:8080/api/books';

const isLocalFrontend =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API_BASE_URLS = isLocalFrontend
  ? [AZURE_API_URL, LOCAL_API_URL]
  : [AZURE_API_URL];

const emptyForm = {
  id: null,
  title: '',
  author: '',
  isbn: '',
  publishedYear: '',
  genre: '',
  quantity: '1',
};

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);

<<<<<<< HEAD
  // ✅ Fetch API with fallback
=======
  const totalTitles = books.length;
  const totalCopies = useMemo(
    () => books.reduce((sum, book) => sum + (book.quantity || 0), 0),
    [books]
  );
  const genres = useMemo(() => {
    const unique = new Set();
    books.forEach((book) => {
      if (book.genre) {
        unique.add(book.genre);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [books]);
  const totalGenres = genres.length;
  const lowStockCount = useMemo(
    () => books.filter((book) => (book.quantity || 0) <= 2).length,
    [books]
  );
  const filteredBooks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let result = books;

    if (term) {
      result = result.filter((book) => {
        const title = book.title?.toLowerCase() || '';
        const author = book.author?.toLowerCase() || '';
        const isbn = book.isbn?.toLowerCase() || '';
        const genre = book.genre?.toLowerCase() || '';
        return (
          title.includes(term) ||
          author.includes(term) ||
          isbn.includes(term) ||
          genre.includes(term)
        );
      });
    }

    if (genreFilter !== 'all') {
      result = result.filter((book) => book.genre === genreFilter);
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sortBy === 'author') {
        return (a.author || '').localeCompare(b.author || '');
      }
      if (sortBy === 'year') {
        return (b.publishedYear || 0) - (a.publishedYear || 0);
      }
      if (sortBy === 'copies') {
        return (b.quantity || 0) - (a.quantity || 0);
      }
      return (a.title || '').localeCompare(b.title || '');
    });

    return sorted;
  }, [books, genreFilter, searchTerm, sortBy]);

  const activeFilters =
    (searchTerm.trim() ? 1 : 0) + (genreFilter !== 'all' ? 1 : 0) + (sortBy ? 1 : 0);

>>>>>>> fea107d (old code)
  const fetchWithFallback = useCallback(async (path = '', options = {}) => {
    let lastResponse = null;

    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(`${baseUrl}${path}`, options);
<<<<<<< HEAD
        if (response.ok) return response;
        lastResponse = response;
      } catch (err) {}
    }

    if (lastResponse) return lastResponse;
    throw new Error('API not reachable');
=======
        if (response.ok) {
          return response;
        }

        lastResponse = response;

        if (response.status < 500) {
          return response;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (lastResponse) {
      return lastResponse;
    }

    throw lastError || new Error('Unable to reach the API.');
>>>>>>> fea107d (old code)
  }, []);

  // ✅ Load books
  const loadBooks = useCallback(async () => {
    try {
      const response = await fetchWithFallback();
<<<<<<< HEAD
      if (!response.ok) throw new Error('Failed to load books');
=======
      if (!response.ok) {
        throw new Error('Failed to load books.');
      }
>>>>>>> fea107d (old code)
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    }
  }, [fetchWithFallback]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add / Update book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and Author required');
      return;
    }

<<<<<<< HEAD
    const payload = {
      title: form.title,
      author: form.author,
      isbn: form.isbn,
      publishedYear: form.publishedYear
        ? Number(form.publishedYear)
        : null,
      genre: form.genre,
      quantity: Number(form.quantity || 0),
    };

    try {
      const response = await fetchWithFallback(
        isEditing ? `/${form.id}` : '',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error('Save failed');
=======
    try {
      const response = await fetchWithFallback(
        isEditing ? `/${form.id}` : '',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Unable to save the book.');
      }
>>>>>>> fea107d (old code)

      await loadBooks();
      handleReset();
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Edit
  const handleEdit = (book) => {
    setForm({
      id: book.id,
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      publishedYear: book.publishedYear || '',
      genre: book.genre || '',
      quantity: book.quantity || '1',
    });
    setIsEditing(true);
<<<<<<< HEAD
    titleInputRef.current?.focus();
  };

  // 🔐 Delete with password
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this book?');
    if (!confirmDelete) return;

    const password = window.prompt('Enter password:');
    if (password !== '2006') {
      alert('Wrong password!');
=======
    setActivePage('manage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Remove this book from inventory?');
    if (!confirmed) {
>>>>>>> fea107d (old code)
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetchWithFallback(`/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

=======
      const response = await fetchWithFallback(`/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Unable to delete the book.');
      }
>>>>>>> fea107d (old code)
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Reset form
  const handleReset = () => {
    setForm(emptyForm);
    setIsEditing(false);
<<<<<<< HEAD
    titleInputRef.current?.focus();
=======
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setSortBy('title');
  };

  const handleFocusForm = () => {
    setActivePage('manage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
>>>>>>> fea107d (old code)
  };

  return (
    <div className="app">
<<<<<<< HEAD
      <h1>📚 Book Inventory</h1>

      <form onSubmit={handleSubmit}>
        <input
          ref={titleInputRef}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
        />
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          placeholder="ISBN"
        />
        <input
          name="publishedYear"
          value={form.publishedYear}
          onChange={handleChange}
          placeholder="Year"
          type="number"
        />
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
        />
        <input
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          type="number"
          placeholder="Quantity"
        />

        <button type="submit">
          {isEditing ? 'Update Book' : 'Add Book'}
        </button>
        <button type="button" onClick={handleReset}>
          Clear
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <b>{book.title}</b> - {book.author}
            <br />
            📖 {book.genre} | 📅 {book.publishedYear} | 📦 {book.quantity}
            <br />
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
=======
      <main className="app-shell">
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

        <section className="page">
          {activePage === 'overview' && (
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
          )}

          {activePage === 'manage' && (
            <section className="manage-layout">
              <form
                className={`panel form-panel ${isEditing ? 'panel-active' : ''}`}
                onSubmit={handleSubmit}
              >
                <div className="panel-header">
                  <h2>{isEditing ? 'Edit book details' : 'Add a new book'}</h2>
                  <p>Capture essential data in one glance.</p>
                  <span className={`mode ${isEditing ? 'active' : 'idle'}`}>
                    {isEditing ? `Editing: ${form.title || 'Untitled'}` : 'Create mode'}
                  </span>
                </div>

                <div className="fields">
                  <label>
                    Title
                    <input
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="The Midnight Library"
                      required
                      ref={titleInputRef}
                    />
                  </label>
                  <label>
                    Author
                    <input
                      name="author"
                      type="text"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="Matt Haig"
                      required
                    />
                  </label>
                  <label>
                    ISBN
                    <input
                      name="isbn"
                      type="text"
                      value={form.isbn}
                      onChange={handleChange}
                      placeholder="978-0525559474"
                    />
                  </label>
                  <label>
                    Published year
                    <input
                      name="publishedYear"
                      type="number"
                      value={form.publishedYear}
                      onChange={handleChange}
                      placeholder="2020"
                      min="0"
                    />
                  </label>
                  <label>
                    Genre
                    <input
                      name="genre"
                      type="text"
                      value={form.genre}
                      onChange={handleChange}
                      placeholder="Fiction"
                    />
                  </label>
                  <label>
                    Quantity
                    <input
                      name="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={handleChange}
                      min="0"
                    />
                  </label>
                </div>

                {error ? <p className="error">{error}</p> : null}

                <div className="actions">
                  <button className="primary" type="submit" disabled={loading}>
                    {isEditing ? 'Save changes' : 'Add book'}
                  </button>
                  <button className="ghost" type="button" onClick={handleReset}>
                    Clear form
                  </button>
                </div>
              </form>

              <aside className="panel side-panel">
                <h3>Manage tips</h3>
                <p className="muted">Keep records consistent for clean reporting.</p>
                <ul className="tip-list">
                  <li>Double-check ISBN formats for faster lookups.</li>
                  <li>Use genres consistently so filters stay useful.</li>
                  <li>Update quantities as shipments arrive.</li>
                </ul>
                <div className="side-actions">
                  <button className="ghost" type="button" onClick={() => setActivePage('inventory')}>
                    Review inventory
                  </button>
                </div>
              </aside>
            </section>
          )}

          {activePage === 'inventory' && (
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
                        <button
                          className="chip"
                          type="button"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="filters">
                    <label>
                      Genre
                      <select
                        value={genreFilter}
                        onChange={(event) => setGenreFilter(event.target.value)}
                      >
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
                    <article
                      key={book.id}
                      className="book-card"
                      style={{ '--delay': `${index * 0.04}s` }}
                    >
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
                        <button
                          className="danger"
                          type="button"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
        </section>
      </main>
>>>>>>> fea107d (old code)
    </div>
  );
}

export default App;
