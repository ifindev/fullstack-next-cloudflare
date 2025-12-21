import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Toolsail - Discover the Best AI & Digital Tools",
        template: "%s | Toolsail"
    },
    description: "Curated directory of 200+ premium AI tools and digital marketing tools. Find ChatGPT alternatives, Midjourney, productivity tools, SEO tools, and more. Boost your creativity and efficiency.",
    keywords: ["AI tools", "digital tools", "ChatGPT", "Midjourney", "productivity tools", "SEO tools", "marketing tools", "AI directory"],
    authors: [{ name: "Toolsail Team" }],
    creator: "Toolsail",
    publisher: "Toolsail",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        }
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://next-cf-app.lindalu125.workers.dev",
        siteName: "Toolsail",
        title: "Toolsail - Discover the Best AI & Digital Tools",
        description: "Curated directory of 200+ premium AI tools and digital marketing tools",
        images: [
            {
                url: "https://next-cf-app.lindalu125.workers.dev/og-image.png",
                width: 1200,
                height: 630,
                alt: "Toolsail - AI & Digital Tools Directory"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Toolsail - Discover the Best AI & Digital Tools",
        description: "Curated directory of 200+ premium AI tools and digital marketing tools",
        images: ["https://next-cf-app.lindalu125.workers.dev/og-image.png"],
        creator: "@toolsail"
    },
    verification: {
        google: "your-google-verification-code",
    },
    alternates: {
        canonical: "https://next-cf-app.lindalu125.workers.dev"
    }
};

export const dynamic = "force-dynamic";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <Toaster position="bottom-right" />
                </ThemeProvider>
            </body>
        </html>
    );
}
