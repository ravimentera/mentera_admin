'use client';

import { useState } from 'react';

export default function SearchForm({ onSearch, isLoading }) {
  const [city, setCity] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setError(false);
      onSearch(city);
    } else {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="form-header">
          <label htmlFor="city">Enter a City in California</label>
          {error && <span className="error-message">Please enter a city name</span>}
        </div>
        <input
          id="city"
          type="text"
          required
          placeholder="San Francisco"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Get MedSpas CSV'}
      </button>
    </form>
  );
}
