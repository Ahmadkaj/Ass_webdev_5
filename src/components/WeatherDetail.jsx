// One small box with a label and a value (Feels like, Humidity, Wind).
// Reused three times inside WeatherCard.
function WeatherDetail({ label, value }) {
  return (
    <div className="detail">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

export default WeatherDetail;
