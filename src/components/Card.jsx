/**
 * Card Component
 * Reusable card container
 */

export function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}) {
  return (
    <div
      className={`
        card
        ${hoverable ? 'hover:shadow-lg cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
