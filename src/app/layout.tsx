import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.scss";
import { Providers } from "./providers";

const roboto = Roboto({
    weight: ['300', '400', '500', '700', '900'],
    subsets: ["latin"],
    display: 'swap',
    variable: '--font-lambo',
});

export const viewport: Viewport = {
    themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
    title: {
        template: '%s | The Local Crafts',
        default: 'The Local Crafts | AI-Powered Discovery Hub for Heritage Handicrafts',
    },
    description: "Discover authentic Pakistani handicrafts. Powered by AI and preserved by artisans. Shop directly from the source.",
    metadataBase: new URL('https://thelocalcrafts.com'),
    openGraph: {
        title: 'The Local Crafts',
        description: 'Discover authentic Pakistani handicrafts. Powered by AI and preserved by artisans. Shop directly from the source.',
        url: 'https://thelocalcrafts.com',
        siteName: 'The Local Crafts',
        locale: 'en_PK',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    }
};

const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "The Local Crafts",
    "url": "https://thelocalcrafts.com",
    "logo": "https://thelocalcrafts.com/logo.png",
    "description": "AI-Powered Discovery Hub for authentic Pakistani Heritage Handicrafts directly from master artisans.",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={roboto.variable}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://images.unsplash.com" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            </head>
            <body className={roboto.className}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
