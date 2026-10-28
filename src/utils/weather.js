// Helper functions for the Open-Meteo API (free, no API key needed).
// They are plain functions (no React) so the components stay small.

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Custom error so the UI can tell the user what went wrong
// and whether trying again makes sense.
export class WeatherError extends Error {
  constructor(message, retryable) {
    super(message);
    this.name = 'WeatherError';
    this.retryable = retryable;
  }
}

// Sends a request and returns the JSON data.
// fetch() does not fail on 404 or 500, so we check response.ok ourselves.
async function getJSON(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error; // the search was cancelled, not a real error
    throw new WeatherError("Couldn't reach the weather server. Check your connection and try again.", true);
  }

  if (response.status === 429) {
    throw new WeatherError('Too many requests. Wait a moment and try again.', true);
  }
  if (!response.ok) {
    throw new WeatherError(`The weather server returned an error (${response.status}). Please try again.`, true);
  }

  return response.json();
}

// 1. Finds the city's coordinates, 2. gets the current weather and a 5-day forecast.
export async function fetchWeather(city, signal) {
  const geoParams = new URLSearchParams({ name: city, count: 1, language: 'en', format: 'json' });
  const geo = await getJSON(`${GEOCODING_URL}?${geoParams}`, signal);

  if (!geo.results || geo.results.length === 0) {
    throw new WeatherError(`No city called "${city}" was found. Check the spelling and try again.`, false);
  }
  const place = geo.results[0];

  const forecastParams = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto', // days are in the city's own time zone
    forecast_days: 5,
  });
  const data = await getJSON(`${FORECAST_URL}?${forecastParams}`, signal);

  // the request worked but the data we need is missing
  if (!data.current || !data.daily) {
    throw new WeatherError('The weather data came back incomplete. Please try again.', true);
  }

  // turn the API's "one array per value" format into one object per day
  const days = data.daily.time.map((date, i) => ({
    date,
    code: data.daily.weather_code[i],
    max: data.daily.temperature_2m_max[i],
    min: data.daily.temperature_2m_min[i],
    rainChance: data.daily.precipitation_probability_max[i],
  }));

  return {
    place: {
      name: place.name,
      region: place.admin1,
      country: place.country,
    },
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      code: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    days,
  };
}

// Turns the WMO weather code from the API into a description and an icon
export function getCondition(code, isDay = true) {
  if (code === 0) return { label: 'Clear sky', icon: isDay ? '☀️' : '🌙' };
  if (code <= 2) return { label: 'Partly cloudy', icon: isDay ? '🌤️' : '🌙' };
  if (code === 3) return { label: 'Overcast', icon: '☁️' };
  if (code <= 48) return { label: 'Fog', icon: '🌫️' };
  if (code <= 57) return { label: 'Drizzle', icon: '🌦️' };
  if (code <= 67) return { label: 'Rain', icon: '🌧️' };
  if (code <= 77) return { label: 'Snow', icon: '❄️' };
  if (code <= 82) return { label: 'Rain showers', icon: '🌦️' };
  if (code <= 86) return { label: 'Snow showers', icon: '🌨️' };
  return { label: 'Thunderstorm', icon: '⛈️' };
}

// The API always sends Celsius and km/h. We convert on the screen,
// so switching units does not need a new request.
export function formatTemp(celsius, unit) {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}

export function formatWind(kmh, unit) {
  return unit === 'F' ? `${Math.round(kmh * 0.621371)} mph` : `${Math.round(kmh)} km/h`;
}

// "2026-10-28" -> "Wed". Adding T00:00 keeps it in local time instead of UTC.
export function formatDay(date, index) {
  if (index === 0) return 'Today';
  return new Date(`${date}T00:00`).toLocaleDateString('en-US', { weekday: 'short' });
}
