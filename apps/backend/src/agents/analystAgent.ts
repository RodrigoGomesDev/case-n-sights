import type { AnalysisSection, ResearchData } from "@shared/types";
import { createAnalysisLLM } from "../config/llm";
import { logger } from "../utils/logger";

export class AnalystAgent {
    private llm: ReturnType<typeof createAnalysisLLM>;

    constructor() {
        this.llm = createAnalysisLLM();
    }

    async analyze(query: string, researchData: ResearchData[]): Promise<AnalysisSection[]> {
        try {
            logger.info(`Analyzing ${researchData.length} sources`, "AnalystAgent");

            const researchSummary = researchData
                .map((data, idx) => `Source ${idx + 1} (${data.source}):\n${data.snippet}\n---`)
                .join("\n");

            const analysisPrompt = `IMPORTANTE: Você DEVE escrever TODO o conteúdo em PORTUGUÊS BRASILEIRO (pt-BR).

Você é um analista especializado. Analise os seguintes dados de pesquisa sobre "${query}" e estruture-os em seções abrangentes.

Dados da Pesquisa:
${researchSummary}

Crie uma análise detalhada organizada em 4-6 seções principais. Cada seção deve:
- Ter um título claro e descritivo (em português)
- Conter conteúdo substantivo (pelo menos 2-3 parágrafos)
- Incluir fatos específicos, números e insights da pesquisa
- Ser bem organizada e informativa

Retorne a análise como um array JSON com esta estrutura:
[
  {
    "title": "Título da Seção",
    "content": "Conteúdo detalhado com múltiplos parágrafos...",
    "subsections": [
      {
        "title": "Título da Subseção",
        "content": "Conteúdo da subseção..."
      }
    ]
  }
]

Foque em criar alta densidade de informação. Seja específico e cite descobertas importantes.
LEMBRE-SE: Todo o conteúdo (títulos e textos) deve estar em PORTUGUÊS BRASILEIRO.`;

            const response = await this.llm.invoke(analysisPrompt);
            const content = response.content.toString();

            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error("Failed to parse analysis response");
            }

            const sections: AnalysisSection[] = JSON.parse(jsonMatch[0]);
            logger.info(`Created ${sections.length} analysis sections`, "AnalystAgent");

            return sections;
        } catch (error) {
            logger.error(
                "Analysis failed",
                "AnalystAgent",
                error instanceof Error ? error : undefined,
            );
            throw new Error("Failed to analyze research data");
        }
    }
}
