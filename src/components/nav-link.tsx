'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}): React.ReactElement {
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return (
        <Link
            href={href}
            className={cn(
                'type-label text-ink-muted hover:text-ink transition-colors border-b-2 border-transparent pb-0.5',
                isActive && 'text-ink border-accent',
            )}
        >
            {children}
        </Link>
    );
}
