/**
 * The Al-Maktaba mark. Built on the Arabic letter meem (م): a closed loop
 * that reads at once as the letter and as a bound volume seen end-on, with the
 * tail extending into a single shelf rule. Monochrome, one ink weight, no
 * gradient or container. Uses currentColor so it inherits ink or accent.
 */
export function MeemMark({
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
            viewBox="0 0 512 512"
            role="img"
            aria-label={title}
            className={className}
            fill="none"
        >
            {/* The rolled/bound volume, end-on: an ink ring = the meem head. */}
            <circle cx="196" cy="212" r="118" stroke="currentColor" strokeWidth="34" />
            <circle cx="196" cy="212" r="46" fill="currentColor" />
            {/* The tail: sweeps down from the loop and flattens into the shelf. */}
            <path
                d="M290 286 C332 330 360 356 420 356 L468 356"
                stroke="currentColor"
                strokeWidth="34"
                strokeLinecap="square"
            />
            {/* The shelf rule the wordmark sits on. */}
            <line x1="44" y1="396" x2="468" y2="396" stroke="currentColor" strokeWidth="14" />
        </svg>
    );
}
