import "./globals.css";
import { Public_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>WildChat</title>
                <link rel="shortcut icon" href="/images/favicon.ico" />
                <meta
                    name="description"
                    content="An ai assistant to help you find any and all Northwestern University resources"
                />
                <meta property="og:title" content="WildChat" />
                
            </head>
            <body className="bg-slate-300">
                <Navbar></Navbar>
                <div className="flex flex-col p-4 md:p-12">{children}</div>
            </body>
        </html>
    );
}
