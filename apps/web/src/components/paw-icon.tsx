interface PawIconProps {
  className?: string;
}

export function PawIcon({ className }: PawIconProps) {
  return (
    <svg
      viewBox="0 0 54 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main paw pad */}
      <path
        d="M27 20.5c-6.5 0-12.5 4.5-15 10.5-2 5-0.5 10.5 3.5 14 3.5 3 8.5 4 11.5 4s8-1 11.5-4c4-3.5 5.5-9 3.5-14-2.5-6-8.5-10.5-15-10.5z"
        fill="currentColor"
      />
      {/* Toe 1 */}
      <ellipse cx="14" cy="12" rx="5" ry="5.5" fill="currentColor" />
      {/* Toe 2 */}
      <ellipse cx="27" cy="7" rx="5.5" ry="6" fill="currentColor" />
      {/* Toe 3 */}
      <ellipse cx="40" cy="12" rx="5" ry="5.5" fill="currentColor" />
    </svg>
  );
}
