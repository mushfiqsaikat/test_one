import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AutoMax AI - Intelligent Customer Agent",
    description: "Experience the future of customer support with our AI-powered assistant. Get instant, accurate answers 24/7.",
    keywords: ["AI", "chatbot", "customer support", "automation", "SaaS"],
    authors: [{ name: "AutoMax AI" }],
    openGraph: {
        title: "AutoMax AI - Intelligent Customer Agent",
        description: "Experience the future of customer support with our AI-powered assistant.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
