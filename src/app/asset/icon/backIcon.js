export function BackIcon({
                                           className = "h-6 w-6",
                                       }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <defs>
                <linearGradient id="leftArrowCircle" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
            </defs>

            <circle
                cx="12"
                cy="12"
                r="10"
                stroke="url(#leftArrowCircle)"
                strokeWidth="2"
            />

            <path
                d="M13.5 8l-4 4 4 4"
                stroke="url(#leftArrowCircle)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
