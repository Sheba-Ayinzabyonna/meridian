/**
 * ProgressBar Component
 * Shows progress through multi-step form
 */

export function ProgressBar({ current = 1, total = 5, className = '' }) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-meridian-teal">
          Section {current} of {total}
        </span>
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-meridian-gold transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
