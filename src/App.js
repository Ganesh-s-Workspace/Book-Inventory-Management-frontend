import { useRef } from 'react';
import './App.css';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import Navbar from './components/Navbar';
import OverviewSection from './components/OverviewSection';
import { useBooks } from './hooks/useBooks';

function App() {
  const titleInputRef = useRef(null);

  const {
    books,
    form,
    isEditing,
    loading,
    error,
    searchTerm,
    genreFilter,
    sortBy,
    activePage,
    setActivePage,
    setSearchTerm,
    setGenreFilter,
    setSortBy,
    totalTitles,
    totalCopies,
    genres,
    totalGenres,
    lowStockCount,
    filteredBooks,
    activeFilters,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleReset,
    handleResetFilters,
    handleFocusForm,
  } = useBooks(titleInputRef);

  return (
    <div className="app">
      <main className="app-shell">
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          handleFocusForm={handleFocusForm}
        />

        <section className="page">
          {activePage === 'overview' && (
            <OverviewSection
              totalTitles={totalTitles}
              totalCopies={totalCopies}
              totalGenres={totalGenres}
              lowStockCount={lowStockCount}
              handleFocusForm={handleFocusForm}
              setActivePage={setActivePage}
              handleResetFilters={handleResetFilters}
            />
          )}

          {activePage === 'manage' && (
            <BookForm
              isEditing={isEditing}
              form={form}
              handleChange={handleChange}
              titleInputRef={titleInputRef}
              error={error}
              loading={loading}
              handleSubmit={handleSubmit}
              handleReset={handleReset}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'inventory' && (
            <BookList
              loading={loading}
              books={books}
              filteredBooks={filteredBooks}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              genreFilter={genreFilter}
              setGenreFilter={setGenreFilter}
              genres={genres}
              sortBy={sortBy}
              setSortBy={setSortBy}
              activeFilters={activeFilters}
              handleResetFilters={handleResetFilters}
              handleFocusForm={handleFocusForm}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
