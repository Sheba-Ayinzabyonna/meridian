/**
 * TextArea Component
 * Multi-line text input field
 */

export function TextArea({
  label,
  placeholder = '',
  value = '',
  onChange,
  error = null,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-meridian-teal mb-2">
          {label}
          {required && <span className="text-meridian-coral ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`
          input-base resize-none
          ${error ? 'border-meridian-coral focus:border-meridian-coral focus:ring-meridian-coral/30' : ''}
          ${className}
        `}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-meridian-coral">{error}</p>}
    </div>
  );
}
