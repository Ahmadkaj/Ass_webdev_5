import { formatDay, formatTemp, getCondition } from '../utils/weather.js';

// One day in the 5-day forecast.
function ForecastDay({ day, index, unit }) {
  const condition = getCondition(day.code);

  return (
    <li className="forecast-day">
      <span className="forecast-name">{formatDay(day.date, index)}</span>
      <span className="forecast-icon" role="img" aria-label={condition.label} title={condition.label}>
        {condition.icon}
      </span>
      <span className="forecast-temps">
        <strong>{formatTemp(day.max, unit)}</strong>
        <span className="forecast-min">{formatTemp(day.min, unit)}</span>
      </span>
      {day.rainChance !== null && (
        <span className="forecast-rain" title="Chance of rain">
          💧 {day.rainChance}%
        </span>
      )}
    </li>
  );
}

export default ForecastDay;
