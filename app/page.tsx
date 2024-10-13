import Image from "next/image";

import { ChatWindow } from "@/components/ChatWindow";

const placeholders = [
    "reserve a room in Tech",
    "undergraduate research opportunities",
    "mental health resources",
    "job opportunities",
    "housing options",
    "study abroad programs",
    "Northwestern clubs",
    "transportation options",
];

export default function Home() {
    return (
        <div className="flex flex-col justfiy-center lg:mx-20 sm:mx-4">
            {/* <h1 className="text-6xl text-[#4e2a84]">Willie the WildChat</h1>
            <p className="text-gray-700 text-2xl">
                Wille knows every Northwestern resource! Whether you need career advice, mental health resources, or research opportunities, Willie
                can point you in the right direction.
            </p> */}

            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-24">
                    <div className="w-full lg:w-1/2">
                        <Image src="/images/willie.png" alt="Willie the Wildcat" width={600} height={400} className="" />
                    </div>
                    <div className="w-full lg:w-1/2 space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
                            Welcome to <span className="text-[#4e2a84]">WildChat</span>!
                        </h1>
                        <p className="mt-12 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-12 md:text-lg lg:mx-0">
                            Willie the WildChat knows every Northwestern resource! Whether you need career advice, mental health resources, or
                            research opportunities, Willie can point you in the right direction.
                        </p>
                        <div className="mt-5 sm:mt-8"></div>
                    </div>
                </div>
            </div>

            {/* <Image src="/images/willie.png" alt="Willie the Wildcat" className="mx-auto" width={100} height={200} /> */}

            <ChatWindow
                endpoint="api/chat"
                emptyStateComponent={<div></div>} // what to show when no messages are present
                showIngestForm={false} // lets you upload context to search through
                placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]}
                emoji="🐱"
                titleText="Willie the Wild-Chat"
            ></ChatWindow>
        </div>
    );
}
