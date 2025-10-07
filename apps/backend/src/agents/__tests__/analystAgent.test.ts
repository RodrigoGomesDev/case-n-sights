import type { AnalysisSection, ResearchData } from "@shared/types";
import { AnalystAgent } from "../analystAgent";

jest.mock("../../config/llm", () => ({
    createAnalysisLLM: jest.fn(() => ({
        invoke: jest.fn(),
    })),
}));

describe("AnalystAgent", () => {
    let analystAgent: AnalystAgent;
    let mockLLM: { invoke: jest.Mock };

    beforeEach(() => {
        mockLLM = {
            invoke: jest.fn(),
        };

        const { createAnalysisLLM } = require("../../config/llm");
        createAnalysisLLM.mockReturnValue(mockLLM);

        analystAgent = new AnalystAgent();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("analyze", () => {
        const mockResearchData: ResearchData[] = [
            {
                source: "example.com",
                url: "https://example.com/article",
                snippet: "This is a test snippet about the topic",
                relevance: 8.5,
            },
            {
                source: "test.com",
                url: "https://test.com/page",
                snippet: "Another relevant snippet with information",
                relevance: 7.2,
            },
        ];

        it("should analyze research data and return structured sections", async () => {
            const query = "artificial intelligence";
            const mockSections: AnalysisSection[] = [
                {
                    title: "Introdução à IA",
                    content: "Conteúdo sobre inteligência artificial.",
                    subsections: [],
                },
                {
                    title: "Aplicações de IA",
                    content: "Aplicações práticas da IA.",
                    subsections: [],
                },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            const result = await analystAgent.analyze(query, mockResearchData);

            expect(mockLLM.invoke).toHaveBeenCalled();
            expect(result).toEqual(mockSections);
            expect(result.length).toBe(2);
        });

        it("should pass research data in the prompt", async () => {
            const query = "test query";
            const mockSections: AnalysisSection[] = [
                { title: "Section 1", content: "Content", subsections: [] },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            await analystAgent.analyze(query, mockResearchData);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain("example.com");
            expect(promptArg).toContain("test snippet");
        });

        it("should parse JSON from LLM response with surrounding text", async () => {
            const query = "test";
            const mockSections: AnalysisSection[] = [
                { title: "Test Section", content: "Test content", subsections: [] },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: `Here is the analysis:\n${JSON.stringify(mockSections)}\nEnd of analysis.`,
            });

            const result = await analystAgent.analyze(query, mockResearchData);

            expect(result).toEqual(mockSections);
        });

        it("should handle sections with subsections", async () => {
            const query = "test";
            const mockSections: AnalysisSection[] = [
                {
                    title: "Main Section",
                    content: "Main content",
                    subsections: [
                        { title: "Subsection 1", content: "Sub content 1" },
                        { title: "Subsection 2", content: "Sub content 2" },
                    ],
                },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            const result = await analystAgent.analyze(query, mockResearchData);

            expect(result[0].subsections).toHaveLength(2);
            expect(result[0].subsections?.[0].title).toBe("Subsection 1");
        });

        it("should throw error when JSON parsing fails", async () => {
            const query = "test";

            mockLLM.invoke.mockResolvedValue({
                content: "This is not valid JSON response",
            });

            await expect(analystAgent.analyze(query, mockResearchData)).rejects.toThrow(
                "Failed to analyze research data",
            );
        });

        it("should throw error when LLM invocation fails", async () => {
            const query = "test";

            mockLLM.invoke.mockRejectedValue(new Error("LLM error"));

            await expect(analystAgent.analyze(query, mockResearchData)).rejects.toThrow(
                "Failed to analyze research data",
            );
        });

        it("should include query in the analysis prompt", async () => {
            const query = "quantum computing";
            const mockSections: AnalysisSection[] = [
                { title: "Section", content: "Content", subsections: [] },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            await analystAgent.analyze(query, mockResearchData);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain(query);
        });

        it("should request Portuguese content in prompt", async () => {
            const query = "test";
            const mockSections: AnalysisSection[] = [
                { title: "Seção", content: "Conteúdo", subsections: [] },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            await analystAgent.analyze(query, mockResearchData);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain("PORTUGUÊS BRASILEIRO");
        });

        it("should handle empty research data array", async () => {
            const query = "test";
            const mockSections: AnalysisSection[] = [
                { title: "Section", content: "Content", subsections: [] },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            const result = await analystAgent.analyze(query, []);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });

        it("should return array of sections with correct structure", async () => {
            const query = "test";
            const mockSections: AnalysisSection[] = [
                {
                    title: "Section 1",
                    content: "Content 1",
                    subsections: [],
                },
                {
                    title: "Section 2",
                    content: "Content 2",
                    subsections: [{ title: "Sub", content: "Sub content" }],
                },
            ];

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockSections),
            });

            const result = await analystAgent.analyze(query, mockResearchData);

            expect(result).toBeInstanceOf(Array);
            result.forEach((section) => {
                expect(section).toHaveProperty("title");
                expect(section).toHaveProperty("content");
                expect(section).toHaveProperty("subsections");
            });
        });
    });
});
