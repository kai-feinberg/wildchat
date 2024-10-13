"use client";

import "react-toastify/dist/ReactToastify.css";

import { useChat } from "ai/react";
import { SearchCheck } from "lucide-react";
import { ReactElement, useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { LinkedDocument } from "@/types/api";

export function ChatWindow(props: {
    endpoint: string;
    emptyStateComponent: ReactElement;
    placeholder?: string;
    titleText?: string;
    emoji?: string;
    showIngestForm?: boolean;
}) {
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const { endpoint, emptyStateComponent, placeholder, titleText = "An LLM", showIngestForm, emoji } = props;

    const ingestForm = showIngestForm && <UploadDocumentsForm></UploadDocumentsForm>;

    const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, LinkedDocument[]>>({});

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading: chatEndpointIsLoading,
    } = useChat({
        api: endpoint,
        onResponse(response) {
            const sourcesHeader = response.headers.get("x-sources");
            const sources = sourcesHeader ? (JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8")) as LinkedDocument[]) : [];
            const messageIndexHeader = response.headers.get("x-message-index");
            if (sources.length && messageIndexHeader !== null) {
                setSourcesForMessages({ ...sourcesForMessages, [messageIndexHeader]: sources });
            }
        },
        streamMode: "text",
        onError: (e) => {
            toast(e.message, {
                theme: "dark",
            });
        },
    });

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (messageContainerRef.current) {
            messageContainerRef.current.classList.add("grow");
        }
        if (!messages.length) {
            await new Promise((resolve) => setTimeout(resolve, 300));
        }
        if (chatEndpointIsLoading) {
            return;
        }
        handleSubmit(e);
    }

    return (
        <div className={`flex flex-col items-center my-8 p-4 md:p-8 rounded-xl grow overflow-hidden ${messages.length > 0 ? "" : ""}`}>
            {messages.length > 0 ? "" : <h1 className="text-3xl text-black font-bold text-center my-[-10]">Ask Willie</h1>}
            <h2 className={`${messages.length > 0 ? "" : "hidden"} text-2xl text-black font-medium py-4`}>
                {emoji} {titleText}
            </h2>
            {messages.length === 0 ? emptyStateComponent : ""}
            <div className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out rounded-xl" ref={messageContainerRef}>
                {messages.length > 0
                    ? [...messages].reverse().map((m, i) => {
                          const sourceKey = (messages.length - 1 - i).toString();
                          return <ChatMessageBubble key={m.id} message={m} sources={sourcesForMessages[sourceKey]}></ChatMessageBubble>;
                      })
                    : ""}
            </div>

            {messages.length === 0 && ingestForm}

            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={sendMessage} className="flex w-full flex-col">
                <div className="flex w-full mt-4">
                    <input
                        className="grow mr-8 p-4 rounded bg-gray-200"
                        value={input}
                        placeholder={placeholder ?? "What's it like to be a pirate?"}
                        onChange={handleInputChange}
                    />

                    <button type="submit" className="shrink-0 px-4 py-4 bg-[#4E2a84] rounded">
                        <div role="status" className={`${chatEndpointIsLoading ? "" : "hidden"} flex justify-center`}>
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <span className={chatEndpointIsLoading ? "hidden" : ""}>
                            <div className="flex flex-row align-base">
                                <SearchCheck className="mt-2 mr-2" /> <p className="font-medium">Ask</p>
                            </div>
                        </span>
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}
