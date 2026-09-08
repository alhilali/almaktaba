import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';

const PRODUCT_LINKS: { href: string; label: string }[] = [
    { href: '/library', label: 'Library' },
    { href: '/insights', label: 'Insights' },
    { href: '/publish', label: 'Publish a method' },
    { href: '/requests', label: 'Request a method' },
];

const FRAMEWORK_LINKS: { href: string; label: string }[] = [
    { href: 'https://sdaia.gov.sa', label: 'SDAIA AI Adoption Framework' },
    { href: 'https://sdaia.gov.sa', label: 'SDAIA National AI Index' },
    { href: 'https://sdaia.gov.sa', label: 'SDAIA AI Ethics Principles' },
    { href: 'https://sdaia.gov.sa', label: 'Personal Data Protection Law' },
];

/** Repeated on every page. The disclosure block is always present (spec §2.1). */
export function SiteFooter(): React.ReactElement {
    return (
        <footer className="mt-auto border-t border-rule bg-surface">
            <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
                <div>
                    <Wordmark />
                    <p className="type-meta mt-4 max-w-[280px] text-ink-muted">
                        A shared library of AI work methods for Saudi organisations. Published once,
                        reused by anyone doing the same job.
                    </p>
                </div>

                <nav className="flex gap-12">
                    <div>
                        <h2 className="type-label mb-3 text-ink-faint">Product</h2>
                        <ul className="space-y-2">
                            {PRODUCT_LINKS.map((link) => (
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
                        <h2 className="type-label mb-3 text-ink-faint">Frameworks</h2>
                        <ul className="space-y-2">
                            {FRAMEWORK_LINKS.map((link) => (
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
                        Sample data throughout. Figures illustrate the interface and are not measured
                        results. Al-Maktaba is a component of the AI Absorption programme and is
                        complementary to, not a substitute for, national AI adoption frameworks and
                        assessments.
                    </p>
                </div>
            </div>
        </footer>
    );
}
