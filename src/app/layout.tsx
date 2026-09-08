import type { Metadata } from 'next';
import { cookies } from 'next/headers';
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
    metadataBase: new URL('https://almaktaba-liard.vercel.app'),
    title: {
        default: 'المكتبة · Al-Maktaba',
        template: '%s · المكتبة Al-Maktaba',
    },
    description:
        'مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية. تُنشر مرة واحدة، ويستفيد منها الجميع. A shared library of AI work methods for Saudi organisations.',
    applicationName: 'المكتبة Al-Maktaba',
    authors: [{ name: 'SDA × NUS Executive Leadership Fellows' }],
    creator: 'Al-Maktaba Team',
    publisher: 'Saudi Digital Academy (SDA) × NUS',
    keywords: [
        'المكتبة',
        'Al-Maktaba',
        'الذكاء الاصطناعي',
        'أساليب عمل',
        'AI Adoption',
        'SDA',
        'NUS',
        'Saudi Arabia',
        'الذكاء الاصطناعي التوليدي',
    ],
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    openGraph: {
        title: 'المكتبة · Al-Maktaba',
        description:
            'مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية. تُنشر مرة واحدة، ويستفيد منها الجميع. أساليب عمل موثقة ومقاسة الأثر.',
        url: 'https://almaktaba-liard.vercel.app',
        siteName: 'المكتبة · Al-Maktaba',
        locale: 'ar_SA',
        alternateLocale: ['en_US'],
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'المكتبة · Al-Maktaba — منصة أساليب عمل الذكاء الاصطناعي',
                type: 'image/png',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'المكتبة · Al-Maktaba',
        description:
            'مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية. تُنشر مرة واحدة، ويستفيد منها الجميع.',
        images: ['/og-image.png'],
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): Promise<React.ReactElement> {
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('almaktaba_lang')?.value;
    const initialLang = cookieLang === 'en' ? 'en' : 'ar';
    const isRtl = initialLang === 'ar';

    return (
        <html
            lang={initialLang}
            dir={isRtl ? 'rtl' : 'ltr'}
            className={`${sourceSerif.variable} ${plexSans.variable} ${thmanyahSans.variable} ${thmanyahSerifDisplay.variable} ${thmanyahSerifText.variable} h-full`}
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var p=localStorage.getItem('almaktaba_lang_pref');if(p==='en'||p==='ar'){document.documentElement.lang=p;document.documentElement.dir=p==='ar'?'rtl':'ltr';document.cookie='almaktaba_lang='+p+'; path=/; max-age=31536000; SameSite=Lax';}}catch(e){}})();`,
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col bg-paper text-ink">
                <LanguageProvider initialLanguage={initialLang}>
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                </LanguageProvider>
            </body>
        </html>
    );
}
