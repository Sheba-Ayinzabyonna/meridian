/**
 * Meridian Logo Component
 * Elegant serif wordmark
 */

export function MeridianLogo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-5xl',
    lg: 'text-7xl',
  };

  return (
    <h1
      className={`font-serif font-bold text-meridian-gold ${sizeClasses[size]} ${className}`}
      style={{ letterSpacing: '0.05em' }}
    >
      Meridian
    </h1>
  );
}
