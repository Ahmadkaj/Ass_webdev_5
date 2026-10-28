import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import UnitToggle from './components/UnitToggle.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import ForecastList from './components/ForecastList.jsx';
import { useWeather } from './hooks/useWeather.js';
import { loadSetting, saveSetting } from './utils/storage.js';

const DEFAULT_CITY = 'Beirut';

function App() {
  // The city that was searched (not the text being typed, SearchBar keeps that).
  // The function form only reads localStorage once, on the first render.
  const [city, setCity] = useState(() => loadSetting('lastCity', DEFAULT_CITY));
  // °C or °F. It lives here because both the toggle and the cards need it (lifted state).
  const [unit, setUnit] = useState(() => loadSetting('unit', 'C'));

  const { weather, status, error, retry } = useWeather(city);

  // remember the last city and unit for the next visit
  useEffect(() => {
    saveSetting('lastCity', city);
  }, [city]);

  useEffect(() => {
    saveSetting('unit', unit);
  }, [unit]);

  function handleSearch(newCity) {
    // searching the same city again would not change the state,
    // so ask the hook to fetch again instead (fresh data)
    if (newCity.toLowerCase() === city.toLowerCase()) {
      retry();
    } else {
      setCity(newCity);
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <UnitToggle unit={unit} onChange={setUnit} />
      </header>

      <SearchBar initialCity={city} onSearch={handleSearch} isLoading={status === 'loading'} />

      {status === 'idle' && <p className="hint">Search for a city to see the weather.</p>}

      {status === 'loading' && <LoadingSpinner message={`Loading weather for ${city}…`} />}

      {status === 'error' && (
        <ErrorMessage message={error.message} onRetry={error.retryable ? retry : undefined} />
      )}

      {status === 'success' && weather && (
        <div className="results">
          <WeatherCard place={weather.place} current={weather.current} unit={unit} />
          <ForecastList days={weather.days} unit={unit} />
        </div>
      )}

      <footer className="app-footer">
        Weather data by{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
      </footer>
    </main>
  );
}

export default App;
