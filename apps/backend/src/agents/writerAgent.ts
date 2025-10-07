import { randomUUID } from "node:crypto";
import type { AnalysisSection, Report, ResearchData } from "@shared/types";
import { createWriterLLM } from "../config/llm";
import { logger } from "../utils/logger";

interface ReportMetadata {
    title: string;
    summary: string;
}

export class WriterAgent {
    private llm: ReturnType<typeof createWriterLLM>;

    constructor() {
        this.llm = createWriterLLM();
    }

    async synthesizeReport(
        query: string,
        sections: AnalysisSection[],
        sources: ResearchData[],
        startTime: number,
    ): Promise<Report> {
        try {
            logger.info("Synthesizing final report", "WriterAgent");

            const synthesisPrompt = `IMPORTANTE: Você DEVE escrever TODO o conteúdo em PORTUGUÊS BRASILEIRO (pt-BR).

Você é um escritor especializado em relatórios. Com base nas seguintes seções de análise sobre "${query}", crie:

1. Um título de relatório profissional e atraente (máximo 12 palavras, em português)
2. Um resumo executivo (2-3 parágrafos) que capture os principais insights

Seções de Análise:
${sections.map((s) => `- ${s.title}: ${s.content.substring(0, 200)}...`).join("\n")}

Retorne APENAS um objeto JSON com esta estrutura:
{
  "title": "Título do Relatório Aqui",
  "summary": "Resumo executivo aqui..."
}

LEMBRE-SE: Todo o conteúdo (título e resumo) deve estar em PORTUGUÊS BRASILEIRO.`;

            const response = await this.llm.invoke(synthesisPrompt);
            const content = response.content.toString();

            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Failed to parse synthesis response");
            }

            const { title, summary }: ReportMetadata = JSON.parse(jsonMatch[0]);

            const report: Report = {
                id: randomUUID(),
                query,
                title,
                summary,
                sections,
                sources,
                generatedAt: new Date().toISOString(),
                processingTime: Date.now() - startTime,
            };

            logger.info(`Report synthesized in ${report.processingTime}ms`, "WriterAgent");

            return report;
        } catch (error) {
            logger.error(
                "Synthesis failed",
                "WriterAgent",
                error instanceof Error ? error : undefined,
            );
            throw new Error("Failed to synthesize report");
        }
    }
}
