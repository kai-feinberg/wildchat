import type { Message } from "ai/react";
import { Converter } from "showdown";

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

export function ChatMessageBubble(props: { message: Message; aiEmoji?: string; sources: any[] }) {
    const colorClassName = props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
    const alignmentClassName = props.message.role === "user" ? "ml-auto" : "mr-auto";
    const prefix = props.message.role === "user" ? "🧑" : props.aiEmoji;
    const innerHtml = converter.makeHtml(props.message.content);

    return (
        <div className={`${alignmentClassName} ${colorClassName} rounded px-4 py-4 max-w-[80%] mb-8 flex`}>
            <div className="mr-2">{prefix}</div>
            <div className="whitespace-pre-wrap flex flex-col">
                {/* <span>{props.message.content}</span> */}
                <div dangerouslySetInnerHTML={{ __html: innerHtml }} />
                {props.sources && props.sources.length ? (
                    <>
                        <code className="mt-4 mr-auto px-2 py-1 rounded-xl">
                            <h2 className="text-black text-lg font-medium">🔍 Sources:</h2>
                        </code>
                        <code className="mt-1 mr-2 px-2 py-1 rounded-xl text-xs">
                            {props.sources?.map((source, i) => (
                                <div className="my-2 text-black" key={"source:" + i}>
                                    <a href={source.metadata?.link} target="_blank">{source.metadata?.link}</a>
                                    {/* {i + 1}. &quot;{source.pageContent}&quot;
                                    {source.metadata?.loc?.lines !== undefined ? (
                                        <div>
                                            <br />
                                            Lines {source.metadata?.loc?.lines?.from} to {source.metadata?.loc?.lines?.to}
                                        </div>
                                    ) : (
                                        ""
                                    )} */}
                                </div>
                            ))}
                        </code>
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
