/**
 * Compass Rose SVG Component
 * Meridian's primary visual symbol
 */

export function CompassRose({ className = '', animated = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`w-24 h-24 ${animated ? 'animate-compass-spin' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Compass rose"
    >
      <defs>
        <style>{`
          @media (prefers-reduced-motion: reduce) {
            .compass-rose {
              animation: none !important;
            }
          }
        `}</style>
      </defs>

      {/* Outer circle */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.5" />

      {/* Cardinal points */}
      <g fill="#C9A84C">
        {/* North point */}
        <polygon points="50,8 45,20 50,18 55,20" />
        <text x="50" y="7" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#C9A84C">
          N
        </text>

        {/* South point */}
        <polygon points="50,92 45,80 50,82 55,80" />
        <text x="50" y="99" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#C9A84C">
          S
        </text>

        {/* East point */}
        <polygon points="92,50 80,45 82,50 80,55" />
        <text x="95" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#C9A84C">
          E
        </text>

        {/* West point */}
        <polygon points="8,50 20,45 18,50 20,55" />
        <text x="5" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#C9A84C">
          W
        </text>
      </g>

      {/* Inner decorative elements */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.3" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.6" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill="#C9A84C" />
    </svg>
  );
}
