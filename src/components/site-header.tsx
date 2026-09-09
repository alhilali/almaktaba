'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Wordmark } from '@/components/wordmark';
import { NavLink } from '@/components/nav-link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AuthStatus } from '@/components/auth-status';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

export function SiteHeader(): React.ReactElement {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const mobileNavItems: { href: string; label: string }[] = [
        { href: '/library', label: t('navLibrary') },
        { href: '/insights', label: t('navInsights') },
        { href: '/publish', label: t('navPublish') },
        { href: '/requests', label: t('navRequests') },
        { href: '/about', label: t('navAbout') },
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-rule bg-surface/95 backdrop-blur-xs">
            <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4 sm:px-5 md:px-8">
                <Wordmark />
                <nav className="flex items-center gap-2.5 sm:gap-4 md:gap-7">
                    <span className="hidden items-center gap-6 sm:flex">
                        <NavLink href="/library">{t('navLibrary')}</NavLink>
                        <NavLink href="/insights">{t('navInsights')}</NavLink>
                        <NavLink href="/publish">{t('navPublish')}</NavLink>
                        <NavLink href="/requests">{t('navRequests')}</NavLink>
                        <NavLink href="/about">{t('navAbout')}</NavLink>
                    </span>
                    <AuthStatus />
                    <LanguageSwitcher />
                    <Link href="/library" className="btn btn-primary btn-sm hidden xs:inline-flex">
                        {t('navBrowse')}
                    </Link>

                    {/* Mobile Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-rule bg-surface text-ink hover:bg-surface-sunk transition-colors sm:hidden"
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </nav>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="border-t border-rule bg-surface px-5 py-4 sm:hidden animate-in slide-in-from-top-2 duration-150">
                    <nav className="flex flex-col divide-y divide-rule/60">
                        {mobileNavItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'type-meta py-2.5 flex items-center justify-between transition-colors',
                                        isActive
                                            ? 'font-semibold text-accent'
                                            : 'font-medium text-ink hover:text-accent',
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {isActive && (
                                            <span
                                                aria-hidden
                                                className="h-3.5 w-0.5 rounded-full bg-accent"
                                            />
                                        )}
                                        {item.label}
                                    </span>
                                    <span className="text-ink-faint text-xs">
                                        {isActive ? '•' : '→'}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-4 pt-3 border-t border-rule">
                        <Link
                            href="/library"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-primary btn-sm w-full"
                        >
                            {t('navBrowse')}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
