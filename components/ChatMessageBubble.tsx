import type { Message } from "ai/react";
import Image from "next/image";
import { Converter } from "showdown";

import { LinkedDocument } from "@/types/api";

const converter = new Converter({
    noHeaderId: true,
    headerLevelStart: 2,
    simplifiedAutoLink: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    smoothLivePreview: true,
    openLinksInNewWindow: true,
    emoji: true,
    underline: true,
});

export function ChatMessageBubble(props: { message: Message; sources: LinkedDocument[] }) {
    const colorClassName = props.message.role === "user" ? "bg-[#4e2a84]" : "bg-slate-100 text-black";
    const alignmentClassName = props.message.role === "user" ? "ml-auto" : "mr-auto";
    const innerHtml = converter.makeHtml(props.message.content);

    return (
        <div className={`${alignmentClassName} ${colorClassName} rounded-xl px-4 py-4 max-w-[80%] mb-8 flex`}>
            {props.message.role === "user" ? (
                ""
            ) : (
                <Image src="/images/willie.png" alt="Willie the Wildcat" width={50} height={0} className="mt-2 mr-2 size-10" />
            )}
            <div className="min-w-0">
                {/* <span>{props.message.content}</span> */}
                <div dangerouslySetInnerHTML={{ __html: innerHtml }} className="break-words" />
                {props.sources?.length ? (
                    <>
                        <hr className="my-4 border-gray-300" />
                        <h3 className="text-black text-lg font-medium flex-wrap font-mono">🔍 Sources:</h3>
                        <ul className="text-xs font-mono">
                            {props.sources?.map((source, i) => (
                                <li className="text-black break-words" key={`source:${i}`}>
                                    <a href={source.metadata?.link} target="_blank">
                                        {source.metadata?.link}
                                    </a>
                                    {/* {i + 1}. &quot;{source.pageContent}&quot;
                                    {source.metadata?.loc?.lines !== undefined ? (
                                        <div>
                                            <br />
                                            Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}
                                        </div>
                                    ) : (
                                        ""
                                    )} */}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
