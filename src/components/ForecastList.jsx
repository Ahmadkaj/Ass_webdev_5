import ForecastDay from './ForecastDay.jsx';

// The 5-day forecast: one ForecastDay for each day.
function ForecastList({ days, unit }) {
  return (
    <section className="card forecast" aria-labelledby="forecast-title">
      <h3 id="forecast-title">5-day forecast</h3>
      <ul className="forecast-list">
        {days.map((day, index) => (
          <ForecastDay key={day.date} day={day} index={index} unit={unit} />
        ))}
      </ul>
    </section>
  );
}

export default ForecastList;
