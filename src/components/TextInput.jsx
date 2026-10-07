/**
 * TextInput Component
 * Single-line text input field
 */

export function TextInput({
  label,
  placeholder = '',
  value = '',
  onChange,
  error = null,
  required = false,
  disabled = false,
  type = 'text',
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          input-base
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
