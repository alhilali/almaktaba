'use client';

import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { useLanguage } from '@/context/language-context';

export function SiteFooter(): React.ReactElement {
    const { t, isRTL } = useLanguage();

    const productLinks = [
        { href: '/library', label: t('navLibrary') },
        { href: '/insights', label: t('navInsights') },
        { href: '/publish', label: t('navPublish') },
        { href: '/requests', label: t('navRequests') },
        { href: '/about', label: t('navAbout') },
    ];

    const frameworkLinks = [
        {
            href: 'https://sdaia.gov.sa',
            label: isRTL ? 'إطار سدايا لتبني الذكاء الاصطناعي' : 'SDAIA AI Adoption Framework',
        },
        {
            href: 'https://sdaia.gov.sa',
            label: isRTL ? 'المؤشر الوطني للذكاء الاصطناعي' : 'SDAIA National AI Index',
        },
        {
            href: 'https://sdaia.gov.sa',
            label: isRTL ? 'مبادئ أخلاقيات الذكاء الاصطناعي' : 'SDAIA AI Ethics Principles',
        },
        {
            href: 'https://sdaia.gov.sa',
            label: isRTL ? 'نظام حماية البيانات الشخصية (PDPL)' : 'Personal Data Protection Law',
        },
    ];

    return (
        <footer className="mt-auto border-t border-rule bg-surface">
            <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
                <div>
                    <Wordmark />
                    <p className="type-meta mt-4 max-w-[280px] text-ink-muted">
                        {t('tagline')}
                    </p>
                </div>

                <nav className="flex gap-12">
                    <div>
                        <h2 className="type-label mb-3 text-ink-faint">{t('productLinks')}</h2>
                        <ul className="space-y-2">
                            {productLinks.map((link) => (
                                <li key={link.href + link.label}>
                                    <Link
                                        href={link.href}
                                        className="type-meta text-ink-muted hover:text-accent"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="type-label mb-3 text-ink-faint">{t('frameworkLinks')}</h2>
                        <ul className="space-y-2">
                            {frameworkLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="type-meta text-ink-muted hover:text-accent"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                <div className="border-t border-rule pt-6 md:border-t-0 md:pt-0">
                    <p className="type-disclosure max-w-[320px] text-ink-faint">
                        {t('footerDisclosure')}
                    </p>
                    <div className="mt-4 pt-3 border-t border-rule/50 max-w-[320px]">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-1.5 type-meta font-medium text-accent hover:underline"
                        >
                            <span>{t('navAbout')}</span>
                            <span className="text-xs">{isRTL ? '←' : '→'}</span>
                        </Link>
                        <p className="type-disclosure text-ink-muted mt-1 leading-relaxed">
                            {isRTL
                                ? 'مشروع قيادي ضمن البرنامج المشترك بين الأكاديمية السعودية الرقمية (SDA) وجامعة سنغافورة الوطنية (NUS).'
                                : 'A leadership project developed jointly under SDA and NUS.'}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
