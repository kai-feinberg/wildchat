import "./globals.css";
// import { Public_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

// const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>WildChat</title>
                <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="WildChat" />
                <link rel="manifest" href="/site.webmanifest" />
                <meta name="description" content="Chat with Willie the Wildcat for resources on campus!" />
                <meta property="og:title" content="WildChat" />
            </head>
            <body className="bg-white">
                <Navbar></Navbar>
                {children}
            </body>
        </html>
    );
}
