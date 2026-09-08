import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { NavLink } from '@/components/nav-link';

/** Wordmark left; Library / Insights / Publish and a browse button right. Not sticky. */
export function SiteHeader(): React.ReactElement {
    return (
        <header className="border-b border-rule bg-surface">
            <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 md:px-8">
                <Wordmark />
                <nav className="flex items-center gap-6 md:gap-8">
                    <span className="hidden items-center gap-6 sm:flex">
                        <NavLink href="/library">Library</NavLink>
                        <NavLink href="/insights">Insights</NavLink>
                        <NavLink href="/publish">Publish</NavLink>
                    </span>
                    <Link href="/library" className="btn btn-primary btn-sm">
                        Browse the library
                    </Link>
                </nav>
            </div>
        </header>
    );
}
