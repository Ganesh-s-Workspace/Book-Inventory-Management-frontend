import { useCallback, useEffect, useRef, useState } from 'react';
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

  // ✅ Fetch API with fallback
  const fetchWithFallback = useCallback(async (path = '', options = {}) => {
    let lastResponse = null;

    for (const baseUrl of API_BASE_URLS) {
      try {
        const response = await fetch(`${baseUrl}${path}`, options);
        if (response.ok) return response;
        lastResponse = response;
      } catch (err) {}
    }

    if (lastResponse) return lastResponse;
    throw new Error('API not reachable');
  }, []);

  // ✅ Load books
  const loadBooks = useCallback(async () => {
    try {
      const response = await fetchWithFallback();
      if (!response.ok) throw new Error('Failed to load books');
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
    titleInputRef.current?.focus();
  };

  // 🔐 Delete with password
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Delete this book?');
    if (!confirmDelete) return;

    const password = window.prompt('Enter password:');
    if (password !== '2006') {
      alert('Wrong password!');
      return;
    }

    try {
      const response = await fetchWithFallback(`/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Reset form
  const handleReset = () => {
    setForm(emptyForm);
    setIsEditing(false);
    titleInputRef.current?.focus();
  };

  return (
    <div className="app">
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
    </div>
  );
}

export default App;
