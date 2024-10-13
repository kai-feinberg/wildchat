import { Document } from "@langchain/core/documents";

export interface IngestPOSTRequest {
    text: string;
    link: string;
}

export type LinkedDocument = Document<{ link: string }>;
