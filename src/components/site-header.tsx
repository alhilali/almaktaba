'use client';

import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { NavLink } from '@/components/nav-link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/context/language-context';

export function SiteHeader(): React.ReactElement {
    const { t } = useLanguage();

    return (
        <header className="border-b border-rule bg-surface">
            <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 md:px-8">
                <Wordmark />
                <nav className="flex items-center gap-4 md:gap-7">
                    <span className="hidden items-center gap-6 sm:flex">
                        <NavLink href="/library">{t('navLibrary')}</NavLink>
                        <NavLink href="/insights">{t('navInsights')}</NavLink>
                        <NavLink href="/publish">{t('navPublish')}</NavLink>
                        <NavLink href="/requests">{t('navRequests')}</NavLink>
                        <NavLink href="/about">{t('navAbout')}</NavLink>
                    </span>
                    <LanguageSwitcher />
                    <Link href="/library" className="btn btn-primary btn-sm">
                        {t('navBrowse')}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
