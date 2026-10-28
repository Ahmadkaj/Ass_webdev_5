const UNITS = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
];

// Two buttons to switch between Celsius and Fahrenheit.
// It has no state of its own: App owns `unit` and passes it down.
function UnitToggle({ unit, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature unit">
      {UNITS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={unit === option.value ? 'active' : ''}
          aria-pressed={unit === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default UnitToggle;
