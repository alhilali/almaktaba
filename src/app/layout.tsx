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
    title: 'المكتبة · Al-Maktaba',
    description:
        'مكتبة مشتركة لأساليب عمل الذكاء الاصطناعي للمنظمات السعودية. تُنشر مرة واحدة، ويستفيد منها الجميع. A shared library of AI work methods for Saudi organisations.',
    icons: {
        icon: '/icon.svg',
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
