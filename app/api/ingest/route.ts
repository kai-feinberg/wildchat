import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { IngestPOSTRequest } from "@/types/api";

export const runtime = "edge";

// Before running, follow set-up instructions at
// https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase

/**
 * This handler takes input text, splits it into chunks, and embeds those chunks
 * into a vector store for later retrieval. See the following docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/recursive_text_splitter
 * https://js.langchain.com/v0.2/docs/integrations/vectorstores/supabase
 */
export async function POST(req: NextRequest) {
    const { text, link } = (await req.json()) as IngestPOSTRequest;
    if (!text || !link) {
        return NextResponse.json({ error: "Missing text or link" }, { status: 400 });
    }

    try {
        const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);

        // const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
        //     chunkSize: 256,
        //     chunkOverlap: 20,
        // });

        // const splits = await splitter.createDocuments([text]);
        await SupabaseVectorStore.fromDocuments(
            [
                new Document({
                    pageContent: text.trim(),
                    metadata: { link: link.trim() },
                }),
            ],
            new OpenAIEmbeddings(),
            {
                client,
                tableName: "documents",
                queryName: "match_documents",
            },
        );

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
