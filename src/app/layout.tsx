import type { Metadata } from 'next';
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';

import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const sourceSerif = Source_Serif_4({
    variable: '--font-source-serif',
    subsets: ['latin'],
    weight: ['400', '600'],
    display: 'swap',
});

const plexSans = IBM_Plex_Sans({
    variable: '--font-plex-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

const plexArabic = IBM_Plex_Sans_Arabic({
    variable: '--font-plex-arabic',
    subsets: ['arabic'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Al-Maktaba · المكتبة',
    description:
        'A shared library of AI work methods for Saudi organisations. Published once, reused by anyone doing the same job.',
    icons: {
        icon: '/icon.svg',
    },
};

export default function RootLayout({ children }: LayoutProps<'/'>): React.ReactElement {
    return (
        <html
            lang="en"
            className={`${sourceSerif.variable} ${plexSans.variable} ${plexArabic.variable} h-full`}
        >
            <body className="min-h-full flex flex-col bg-paper text-ink">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
            </body>
        </html>
    );
}
