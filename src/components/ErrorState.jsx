/**
 * ErrorState Component
 * Friendly error display for API failures and validation
 */

import { Button } from './Button';

export function ErrorState({
  title = 'Something got tangled on our side',
  message = 'Your answers are safe — tap to try again.',
  onRetry,
  showRetryButton = true,
  className = '',
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-meridian-teal mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {showRetryButton && onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try again
        </Button>
      )}
    </div>
  );
}
