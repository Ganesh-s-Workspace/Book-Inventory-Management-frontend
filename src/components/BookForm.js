function BookForm({
  isEditing,
  form,
  handleChange,
  titleInputRef,
  error,
  loading,
  handleSubmit,
  handleReset,
  setActivePage,
}) {
  return (
    <section className="manage-layout">
      <form className={`panel form-panel ${isEditing ? 'panel-active' : ''}`} onSubmit={handleSubmit}>
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
  );
}

export default BookForm;
