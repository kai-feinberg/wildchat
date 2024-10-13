"use client";

import { PawPrint } from "lucide-react";

export function Navbar() {
    return (
        <header className="bg-background sticky top-0 z-40 w-full border-b bg-[#4e2a84]">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
                <div className="flex flex-row align-center gap-2">
                    <PawPrint className="h-8 w-8 text-white" />
                    <p className="text-xl font-bold mb-2">WildChat</p>
                </div>
            </div>
        </header>
    );
}
