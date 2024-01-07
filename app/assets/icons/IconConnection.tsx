export const IconConnection = ({ className = "text-primary" }: { className?: string }) => {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={className}>
      <path
        id="connection-line"
        d="M13 12H25C28.3137 12 31 14.6863 31 18C31 21.3137 28.3137 24 25 24H21C17.6863 24 15 26.6863 15 30C15 33.3137 17.6863 36 21 36H34.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle r="4" fill="currentColor">
        <animateMotion dur="2s" repeatCount="indefinite">
          <mpath xlinkHref="#connection-line" />
        </animateMotion>
      </circle>
    </svg>
  );
};
