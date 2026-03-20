import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const AZURE_API_URL =
  'https://booking-backend-bqfrbyeeaactgegx.southeastasia-01.azurewebsites.net/api/books';
const LOCAL_API_URL = 'http://localhost:8080/api/books';
const isLocalFrontend =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URLS = isLocalFrontend ? [AZURE_API_URL, LOCAL_API_URL] : [AZURE_API_URL];

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [activePage, setActivePage] = useState('overview');
  const titleInputRef = useRef(null);

  const totalTitles = books.length;
  const totalCopies = useMemo(
    () => books.reduce((sum, book) => sum + (book.quantity || 0), 0),
    [books]
  );

  const genres = useMemo(() => {
    const unique = new Set();
    books.forEach((book) => {
      if (book.genre) unique.add(book.genre);
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
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '');
      if (sortBy === 'year') return (b.publishedYear || 0) - (a.publishedYear || 0);
      if (sortBy === 'copies') return (b.quantity || 0) - (a.quantity || 0);
      return (a.title || '').localeCompare(b.title || '');
    });

    return sorted;
  }, [books, genreFilter, searchTerm, sortBy]);

  const activeFilters =
    (searchTerm.trim() ? 1 : 0) + (genreFilter !== 'all' ? 1 : 0) + (sortBy ? 1 : 0);

  const fetchWithFallback = useCallback(async (path = '', options = {}) => {
    let lastResponse = null;
    let lastError = null;

    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(`${baseUrl}${path}`, options);
        if (response.ok) return response;

        lastResponse = response;
        if (response.status < 500) return response;
      } catch (error) {
        lastError = error;
      }
    }

    if (lastResponse) return lastResponse;
    throw lastError || new Error('Unable to reach the API.');
  }, []);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithFallback();
      if (!response.ok) throw new Error('Failed to load books.');
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [fetchWithFallback]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    if (activePage === 'manage' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [activePage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim(),
      publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
      genre: form.genre.trim(),
      quantity: form.quantity ? Number(form.quantity) : 0,
    };

    if (!payload.title || !payload.author) {
      setError('Title and author are required.');
      return;
    }

    try {
      const response = await fetchWithFallback(isEditing ? `/${form.id}` : '', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Unable to save the book.');

      await loadBooks();
      handleReset();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const handleEdit = (book) => {
    setForm({
      id: book.id,
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      publishedYear: book.publishedYear ?? '',
      genre: book.genre || '',
      quantity: book.quantity ?? '1',
    });
    setIsEditing(true);
    setActivePage('manage');
  };

  // ✅ UPDATED DELETE FUNCTION WITH PASSWORD
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Remove this book from inventory?');
    if (!confirmed) return;

    const password = window.prompt('Enter password to delete:');
    if (password !== '2006') {
      alert('Incorrect password. Deletion cancelled.');
      return;
    }

    try {
      const response = await fetchWithFallback(`/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete the book.');
      await loadBooks();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  return (
    <div className="app">
      <h1>Book Inventory</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" />
        <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author}
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {error && <p>{error}</p>}
    </div>
  );
}

export default App;