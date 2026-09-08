import { cn } from '@/lib/utils';

/** Marks any figure or chart as sample data, never measured (spec §2.1). */
export function IllustrativeChip({ className }: { className?: string }): React.ReactElement {
    return (
        <span
            className={cn(
                'chip bg-measure-sunk text-measure',
                className,
            )}
            title="Sample data — illustrates the interface, not measured results"
        >
            Illustrative
        </span>
    );
}
