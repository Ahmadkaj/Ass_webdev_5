// Spinning circle with a message, shown while the weather is loading.
function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="status status-loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true"></span>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
