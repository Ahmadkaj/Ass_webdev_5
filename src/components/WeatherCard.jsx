import WeatherDetail from './WeatherDetail.jsx';
import { formatTemp, formatWind, getCondition } from '../utils/weather.js';

// The main card with the current weather for the city.
function WeatherCard({ place, current, unit }) {
  const condition = getCondition(current.code, current.isDay);

  // some places have no region or country, so only show the parts that exist
  const location = [place.region, place.country].filter(Boolean).join(', ');

  return (
    <section className="card weather-card" aria-labelledby="city-name">
      <div className="card-top">
        <div>
          <h2 id="city-name">{place.name}</h2>
          {location && <p className="location">{location}</p>}
        </div>
        <span className="weather-icon" role="img" aria-label={condition.label}>
          {condition.icon}
        </span>
      </div>

      <p className="temp">
        {formatTemp(current.temperature, unit)}
        <span className="temp-unit">{unit}</span>
      </p>
      <p className="condition">{condition.label}</p>

      <div className="details">
        <WeatherDetail label="Feels like" value={`${formatTemp(current.feelsLike, unit)}${unit}`} />
        <WeatherDetail label="Humidity" value={`${current.humidity}%`} />
        <WeatherDetail label="Wind" value={formatWind(current.windSpeed, unit)} />
      </div>
    </section>
  );
}

export default WeatherCard;
