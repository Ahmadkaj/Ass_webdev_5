// Red box with the error message.
// The "Try again" button only shows if the parent passes onRetry
// (there is no point retrying a city that does not exist).
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
