/**
 * Chip Component
 * Multi-select friendly toggle chip
 */

export function Chip({
  label,
  selected = false,
  onClick,
  emoji = null,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        chip
        ${selected ? 'chip-selected' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {emoji && <span className="mr-2">{emoji}</span>}
      {label}
    </button>
  );
}
