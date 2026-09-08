/**
 * The Al-Maktaba mark: an authentic reference library facade with pediment,
 * columns, central archive arch with books, and foundation steps.
 */
export function LibraryMark({
    size = 32,
    className,
    title = 'Al-Maktaba',
}: {
    size?: number;
    className?: string;
    title?: string;
}): React.ReactElement {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            role="img"
            aria-label={title}
            className={className}
            fill="none"
        >
            {/* Pediment roof */}
            <path d="M24 5L43 15H5L24 5Z" fill="currentColor" />
            <rect x="4" y="15" width="40" height="2.5" rx="1" fill="currentColor" />

            {/* Frieze open book symbol */}
            <path
                d="M24 11.5C22.2 10.8 19.8 10.8 18 11.4V13.2C19.8 12.6 22.2 12.6 24 13.3C25.8 12.6 28.2 12.6 30 13.2V11.4C28.2 10.8 25.8 10.8 24 11.5Z"
                fill="#FFFFFF"
                opacity="0.9"
            />

            {/* 4 Grand Columns */}
            <rect x="8" y="17.5" width="4.5" height="19.5" rx="1" fill="currentColor" />
            <rect x="17.5" y="17.5" width="3.5" height="19.5" rx="0.75" fill="currentColor" />
            <rect x="27" y="17.5" width="3.5" height="19.5" rx="0.75" fill="currentColor" />
            <rect x="35.5" y="17.5" width="4.5" height="19.5" rx="1" fill="currentColor" />

            {/* Arched Library Entrance with Bookshelf */}
            <path
                d="M21 37V26C21 24.3 22.3 23 24 23C25.7 23 27 24.3 27 26V37H21Z"
                fill="currentColor"
                opacity="0.2"
            />
            {/* Shelved books inside the arch */}
            <line x1="22" y1="28" x2="26" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <line x1="22" y1="31" x2="26" y2="31" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
            <line x1="22" y1="34" x2="26" y2="34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

            {/* Podium Foundation Steps */}
            <rect x="5" y="37" width="38" height="2.5" rx="0.75" fill="currentColor" />
            <rect x="3" y="39.5" width="42" height="2.5" rx="0.75" fill="currentColor" />
            <rect x="1" y="42" width="46" height="2.5" rx="1" fill="currentColor" />
        </svg>
    );
}
