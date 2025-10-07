import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type { ResearchData } from "@shared/types";
import { createResearchLLM } from "../config/llm";
import { logger } from "../utils/logger";

interface TavilySearchResult {
    url?: string;
    content?: string;
}

export class ResearchAgent {
    private llm: ReturnType<typeof createResearchLLM>;
    private searchTool: TavilySearchResults;

    constructor() {
        this.llm = createResearchLLM();

        this.searchTool = new TavilySearchResults({
            maxResults: 10,
            apiKey: process.env.TAVILY_API_KEY,
        });
    }

    async research(query: string): Promise<ResearchData[]> {
        try {
            logger.info(`Searching for: ${query}`, "ResearchAgent");

            const searchQueriesPrompt = `IMPORTANTE: Você deve gerar suas consultas em INGLÊS para obter melhores resultados de pesquisa.

Dado o termo de busca: "${query}"
            
Gere 3-5 consultas de pesquisa específicas (em inglês) para coletar informações abrangentes sobre este tópico.
Concentre-se em diferentes aspectos como:
- Visão geral e contexto
- Notícias e desenvolvimentos recentes
- Fatos e estatísticas importantes
- Insights da indústria ou posição de mercado
- Opiniões de especialistas ou análises

Retorne APENAS as consultas de pesquisa, uma por linha, sem numeração ou marcadores.
LEMBRE-SE: As consultas devem estar em INGLÊS para melhores resultados.`;

            const response = await this.llm.invoke(searchQueriesPrompt);
            const searchQueries = response.content
                .toString()
                .split("\n")
                .filter((q) => q.trim().length > 0);

            logger.info(`Generated ${searchQueries.length} search queries`, "ResearchAgent");

            const allResults: ResearchData[] = [];

            for (const searchQuery of searchQueries) {
                try {
                    const results = await this.searchTool.invoke(searchQuery);
                    const parsedResults: TavilySearchResult[] = JSON.parse(results);

                    if (Array.isArray(parsedResults)) {
                        const researchData = parsedResults.map((result) => ({
                            source: result.url ? new URL(result.url).hostname : "Unknown",
                            url: result.url || "",
                            snippet: result.content || "",
                            relevance: this.calculateRelevance(result.content || "", query),
                        }));

                        allResults.push(...researchData);
                    }
                } catch (error) {
                    logger.error(
                        `Failed to search for: ${searchQuery}`,
                        "ResearchAgent",
                        error instanceof Error ? error : undefined,
                    );
                }
            }

            const uniqueResults = this.deduplicateResults(allResults);
            const sortedResults = uniqueResults
                .sort((a, b) => b.relevance - a.relevance)
                .slice(0, 15);

            logger.info(`Found ${sortedResults.length} unique sources`, "ResearchAgent");
            return sortedResults;
        } catch (error) {
            logger.error(
                "Research failed",
                "ResearchAgent",
                error instanceof Error ? error : undefined,
            );
            throw new Error("Failed to conduct research");
        }
    }

    private calculateRelevance(content: string, query: string): number {
        const queryTerms = query.toLowerCase().split(" ");
        const contentLower = content.toLowerCase();

        let score = 0;
        for (const term of queryTerms) {
            const occurrences = (contentLower.match(new RegExp(term, "g")) || []).length;
            score += occurrences;
        }

        return Math.min(score / queryTerms.length, 10);
    }

    private deduplicateResults(results: ResearchData[]): ResearchData[] {
        const seen = new Set<string>();
        return results.filter((result) => {
            if (seen.has(result.url)) {
                return false;
            }
            seen.add(result.url);
            return true;
        });
    }
}
