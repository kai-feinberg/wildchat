import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { BytesOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// const combineDocumentsFn = (docs: Document[]) => {
//     const serializedDocs = docs.map((doc) => doc.pageContent);
//     return serializedDocs.join("\n\n");
// };
const combineDocumentsFn = (docs: Document[]) => JSON.stringify(docs);

const formatVercelMessages = (chatHistory: VercelChatMessage[]) => {
    const formattedDialogueTurns = chatHistory.map((message) => {
        if (message.role === "user") {
            return `Human: ${message.content}`;
        } else if (message.role === "assistant") {
            return `Assistant: ${message.content}`;
        }
        return `${message.role}: ${message.content}`;
    });
    return formattedDialogueTurns.join("\n");
};

const CONDENSE_QUESTION_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

<chat_history>
  {chat_history}
</chat_history>

Follow up: {question}
Standalone question:`;
const condenseQuestionPrompt = PromptTemplate.fromTemplate(CONDENSE_QUESTION_TEMPLATE);

// const ANSWER_TEMPLATE = `You are an knowledgable expert about the following resources. Keep your awsnser concise and informative while pointing the user to relevant links and sections.

// Answer the question based only on the following context and chat history:
// <context>
//   {context}
// </context>

// <chat_history>
//   {chat_history}
// </chat_history>

// Question: {question}
// `;
const ANSWER_TEMPLATE = `You are Willie the Wildcat, the knowledgable, friendly mascot of Northwestern University. You must answer students' questions about the following resources. Keep your answer concise and welcoming while pointing them to relevant links and sections. Use many resources as you can in your answer. Answer in the language the user uses.

Answer the question based only on the following context:
<context>
  {context}
</context>

Question: {question}
`;
const answerPrompt = PromptTemplate.fromTemplate(ANSWER_TEMPLATE);

/**
 * This handler initializes and calls a retrieval chain. It composes the chain using
 * LangChain Expression Language. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/qa_chat_history_how_to/
 */
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { messages: VercelChatMessage[] };
        const messages = body.messages ?? [];
        const previousMessages = messages.slice(0, -1);
        const currentMessageContent = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.2,
        });

        const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);
        const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });

        /**
         * We use LangChain Expression Language to compose two chains.
         * To learn more, see the guide here:
         *
         * https://js.langchain.com/docs/guides/expression_language/cookbook
         *
         * You can also use the "createRetrievalChain" method with a
         * "historyAwareRetriever" to get something prebaked.
         */
        const standaloneQuestionChain = RunnableSequence.from([condenseQuestionPrompt, model, new StringOutputParser()]);

        let resolveWithDocuments: (value: Document[]) => void;
        const documentPromise = new Promise<Document[]>((resolve) => {
            resolveWithDocuments = resolve;
        });

        const retriever = vectorstore.asRetriever({
            k: 4,
            callbacks: [
                {
                    handleRetrieverEnd(documents) {
                        resolveWithDocuments(documents);
                    },
                },
            ],
        });

        const retrievalChain = retriever.pipe(combineDocumentsFn);

        const answerChain = RunnableSequence.from([
            {
                context: RunnableSequence.from([(input: { question: string; chat_history: string }) => input.question, retrievalChain]),
                chat_history: (input) => input.chat_history,
                question: (input) => input.question,
            },
            answerPrompt,
            model,
        ]);

        const conversationalRetrievalQAChain = RunnableSequence.from([
            {
                question: standaloneQuestionChain,
                chat_history: (input: { question: string; chat_history: string }) => input.chat_history,
            },
            answerChain,
            new BytesOutputParser(),
        ]);

        const stream = await conversationalRetrievalQAChain.stream({
            question: currentMessageContent,
            chat_history: formatVercelMessages(previousMessages),
        });

        const documents = await documentPromise;
        const serializedSources = Buffer.from(
            JSON.stringify(
                documents.map((doc) => {
                    return {
                        pageContent: `${doc.pageContent.slice(0, 50)}...`,
                        metadata: doc.metadata,
                    };
                }),
            ),
        ).toString("base64");

        return new StreamingTextResponse(stream, {
            headers: {
                "x-message-index": (previousMessages.length + 1).toString(),
                "x-sources": serializedSources,
            },
        });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: (e as { status: number }).status ?? 500 });
    }
}
