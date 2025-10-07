export interface SearchRequest {
    query: string;
}

export interface ResearchData {
    source: string;
    url: string;
    snippet: string;
    relevance: number;
}

export interface AnalysisSection {
    title: string;
    content: string;
    subsections?: {
        title: string;
        content: string;
    }[];
}

export interface Report {
    id: string;
    query: string;
    title: string;
    summary: string;
    sections: AnalysisSection[];
    sources: ResearchData[];
    generatedAt: string;
    processingTime: number;
}

export interface ReportGenerationStatus {
    status: "processing" | "completed" | "error";
    message: string;
    progress?: number;
    report?: Report;
    error?: string;
}