import type { Metadata } from 'next';
import { Source_Serif_4, IBM_Plex_Sans } from 'next/font/google';
import { thmanyahSans, thmanyahSerifDisplay, thmanyahSerifText } from '@/lib/fonts';

import './globals.css';
import { LanguageProvider } from '@/context/language-context';
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

export const metadata: Metadata = {
    title: 'المكتبة · Al-Maktaba',
    description:
        'مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية. تُنشر مرة واحدة، ويستفيد منها الجميع. A shared library of AI work methods for Saudi organisations.',
    icons: {
        icon: '/icon.svg',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    return (
        <html
            lang="ar"
            dir="rtl"
            className={`${sourceSerif.variable} ${plexSans.variable} ${thmanyahSans.variable} ${thmanyahSerifDisplay.variable} ${thmanyahSerifText.variable} h-full`}
        >
            <body className="min-h-full flex flex-col bg-paper text-ink">
                <LanguageProvider>
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                </LanguageProvider>
            </body>
        </html>
    );
}
