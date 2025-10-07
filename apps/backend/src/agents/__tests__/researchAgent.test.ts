import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type { ResearchData } from "@shared/types";
import { ResearchAgent } from "../researchAgent";

jest.mock("@langchain/community/tools/tavily_search");
jest.mock("../../config/llm", () => ({
    createResearchLLM: jest.fn(() => ({
        invoke: jest.fn(),
    })),
}));

describe("ResearchAgent", () => {
    let researchAgent: ResearchAgent;
    let mockLLM: { invoke: jest.Mock };
    let mockSearchTool: { invoke: jest.Mock };

    beforeEach(() => {
        mockLLM = {
            invoke: jest.fn(),
        };

        mockSearchTool = {
            invoke: jest.fn(),
        };

        const { createResearchLLM } = require("../../config/llm");
        createResearchLLM.mockReturnValue(mockLLM);

        (TavilySearchResults as jest.MockedClass<typeof TavilySearchResults>).mockImplementation(
            () => mockSearchTool as unknown as TavilySearchResults,
        );

        researchAgent = new ResearchAgent();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("research", () => {
        it("should generate search queries and perform research", async () => {
            const query = "artificial intelligence";
            const searchQueries = "AI overview\nAI recent developments\nAI statistics";

            mockLLM.invoke.mockResolvedValue({
                content: searchQueries,
            });

            mockSearchTool.invoke.mockResolvedValue(
                JSON.stringify([
                    {
                        url: "https://example.com/ai",
                        content: "Information about artificial intelligence",
                    },
                ]),
            );

            const results = await researchAgent.research(query);

            expect(mockLLM.invoke).toHaveBeenCalled();
            expect(mockSearchTool.invoke).toHaveBeenCalledTimes(3);
            expect(results).toBeInstanceOf(Array);
            expect(results.length).toBeGreaterThan(0);
        });

        it("should return ResearchData with correct structure", async () => {
            const query = "test query";

            mockLLM.invoke.mockResolvedValue({
                content: "test search query",
            });

            mockSearchTool.invoke.mockResolvedValue(
                JSON.stringify([
                    {
                        url: "https://example.com/article",
                        content: "Test content about test query",
                    },
                ]),
            );

            const results = await researchAgent.research(query);

            expect(results[0]).toHaveProperty("source");
            expect(results[0]).toHaveProperty("url");
            expect(results[0]).toHaveProperty("snippet");
            expect(results[0]).toHaveProperty("relevance");
        });

        it("should calculate relevance scores", async () => {
            const query = "machine learning";

            mockLLM.invoke.mockResolvedValue({
                content: "machine learning algorithms",
            });

            mockSearchTool.invoke.mockResolvedValue(
                JSON.stringify([
                    {
                        url: "https://example.com/ml",
                        content: "machine learning machine learning machine",
                    },
                ]),
            );

            const results = await researchAgent.research(query);

            expect(results[0].relevance).toBeGreaterThan(0);
            expect(typeof results[0].relevance).toBe("number");
        });

        it("should deduplicate results with the same URL", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "query 1\nquery 2",
            });

            const duplicateResults = [{ url: "https://example.com/page", content: "Content 1" }];

            mockSearchTool.invoke.mockResolvedValue(JSON.stringify(duplicateResults));

            const results = await researchAgent.research(query);

            // Should only have one result despite being returned twice
            const uniqueUrls = new Set(results.map((r) => r.url));
            expect(uniqueUrls.size).toBe(results.length);
        });

        it("should handle search errors gracefully", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "query 1\nquery 2",
            });

            mockSearchTool.invoke
                .mockRejectedValueOnce(new Error("Search failed"))
                .mockResolvedValueOnce(
                    JSON.stringify([{ url: "https://example.com", content: "Valid content" }]),
                );

            const results = await researchAgent.research(query);

            // Should still return results from successful query
            expect(results.length).toBeGreaterThan(0);
        });

        it("should limit results to top 15 most relevant", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "query 1",
            });

            // Return 20 results
            const manyResults = Array.from({ length: 20 }, (_, i) => ({
                url: `https://example.com/page${i}`,
                content: `Content ${i}`,
            }));

            mockSearchTool.invoke.mockResolvedValue(JSON.stringify(manyResults));

            const results = await researchAgent.research(query);

            expect(results.length).toBeLessThanOrEqual(15);
        });

        it("should throw error when research fails completely", async () => {
            const query = "test";

            mockLLM.invoke.mockRejectedValue(new Error("LLM failed"));

            await expect(researchAgent.research(query)).rejects.toThrow(
                "Failed to conduct research",
            );
        });

        it("should extract domain name as source", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "test query",
            });

            mockSearchTool.invoke.mockResolvedValue(
                JSON.stringify([
                    {
                        url: "https://www.example.com/path/to/article",
                        content: "Content",
                    },
                ]),
            );

            const results = await researchAgent.research(query);

            expect(results[0].source).toBe("www.example.com");
        });

        it("should handle results without URL", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "test query",
            });

            mockSearchTool.invoke.mockResolvedValue(
                JSON.stringify([
                    {
                        content: "Content without URL",
                    },
                ]),
            );

            const results = await researchAgent.research(query);

            expect(results[0].source).toBe("Unknown");
            expect(results[0].url).toBe("");
        });
    });

    describe("calculateRelevance", () => {
        it("should calculate higher relevance for more matching terms", () => {
            const agent = new ResearchAgent();
            const query = "machine learning";

            const highRelevance = (
                agent as unknown as {
                    calculateRelevance: (content: string, query: string) => number;
                }
            ).calculateRelevance("machine learning machine learning", query);
            const lowRelevance = (
                agent as unknown as {
                    calculateRelevance: (content: string, query: string) => number;
                }
            ).calculateRelevance("random text", query);

            expect(highRelevance).toBeGreaterThan(lowRelevance);
        });

        it("should cap relevance score at 10", () => {
            const agent = new ResearchAgent();
            const query = "test";
            const content = "test ".repeat(100);

            const relevance = (
                agent as unknown as {
                    calculateRelevance: (content: string, query: string) => number;
                }
            ).calculateRelevance(content, query);

            expect(relevance).toBeLessThanOrEqual(10);
        });
    });

    describe("deduplicateResults", () => {
        it("should remove duplicate URLs", () => {
            const agent = new ResearchAgent();
            const duplicateResults: ResearchData[] = [
                { url: "https://example.com", source: "example.com", snippet: "A", relevance: 5 },
                { url: "https://example.com", source: "example.com", snippet: "B", relevance: 7 },
                { url: "https://other.com", source: "other.com", snippet: "C", relevance: 6 },
            ];

            const unique = (
                agent as unknown as {
                    deduplicateResults: (results: ResearchData[]) => ResearchData[];
                }
            ).deduplicateResults(duplicateResults);

            expect(unique.length).toBe(2);
            expect(unique.map((r: ResearchData) => r.url)).toEqual([
                "https://example.com",
                "https://other.com",
            ]);
        });

        it("should keep first occurrence of duplicate URLs", () => {
            const agent = new ResearchAgent();
            const duplicateResults: ResearchData[] = [
                {
                    url: "https://example.com",
                    source: "example.com",
                    snippet: "First",
                    relevance: 5,
                },
                {
                    url: "https://example.com",
                    source: "example.com",
                    snippet: "Second",
                    relevance: 7,
                },
            ];

            const unique = (
                agent as unknown as {
                    deduplicateResults: (results: ResearchData[]) => ResearchData[];
                }
            ).deduplicateResults(duplicateResults);

            expect(unique[0].snippet).toBe("First");
        });
    });
});
