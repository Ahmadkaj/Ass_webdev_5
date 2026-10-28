import { useCallback, useEffect, useState } from 'react';
import { fetchWeather } from '../utils/weather.js';

// Custom hook: fetches the weather every time `city` changes.
// It returns the data plus a status ('idle' | 'loading' | 'success' | 'error'),
// so the components only have to decide what to show.
export function useWeather(city) {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  // bumping this number re-runs the effect for the same city (the "Try again" button)
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!city) return;

    // AbortController cancels the old request if the user searches again quickly,
    // so an old, slow answer can never replace a newer one.
    const controller = new AbortController();

    async function loadWeather() {
      setStatus('loading');
      setError(null);
      try {
        const result = await fetchWeather(city, controller.signal);
        setWeather(result);
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError({
          message: err.message || 'Something went wrong. Please try again.',
          retryable: err.retryable ?? true,
        });
        setStatus('error');
      }
    }

    loadWeather();

    // cleanup: runs before the next fetch and when the component unmounts
    return () => controller.abort();
  }, [city, retryCount]);

  const retry = useCallback(() => setRetryCount((count) => count + 1), []);

  return { weather, status, error, retry };
}
