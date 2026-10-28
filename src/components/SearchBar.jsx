import { useState } from 'react';

// The search form. It keeps the text the user is typing in its own state,
// and only tells the parent (App) the city when the form is submitted.
function SearchBar({ initialCity, onSearch, isLoading }) {
  const [text, setText] = useState(initialCity);
  const trimmed = text.trim();

  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="city-input" className="visually-hidden">
        City name
      </label>
      <input
        id="city-input"
        type="text"
        placeholder="Enter a city, e.g. Beirut"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoComplete="off"
      />
      <button type="submit" disabled={isLoading || !trimmed}>
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
