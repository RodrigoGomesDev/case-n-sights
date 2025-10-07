import type { AnalysisSection, ResearchData } from "@shared/types";
import { WriterAgent } from "../writerAgent";

jest.mock("../../config/llm", () => ({
    createWriterLLM: jest.fn(() => ({
        invoke: jest.fn(),
    })),
}));

describe("WriterAgent", () => {
    let writerAgent: WriterAgent;
    let mockLLM: { invoke: jest.Mock };

    beforeEach(() => {
        mockLLM = {
            invoke: jest.fn(),
        };

        const { createWriterLLM } = require("../../config/llm");
        createWriterLLM.mockReturnValue(mockLLM);

        writerAgent = new WriterAgent();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("synthesizeReport", () => {
        const mockSections: AnalysisSection[] = [
            {
                title: "Introdução",
                content: "Conteúdo introdutório sobre o tema.",
                subsections: [],
            },
            {
                title: "Análise Detalhada",
                content: "Análise aprofundada do assunto.",
                subsections: [{ title: "Subseção 1", content: "Conteúdo da subseção" }],
            },
        ];

        const mockSources: ResearchData[] = [
            {
                source: "example.com",
                url: "https://example.com/article",
                snippet: "Test snippet",
                relevance: 8.5,
            },
        ];

        it("should synthesize a complete report", async () => {
            const query = "artificial intelligence";
            const startTime = Date.now();
            const mockMetadata = {
                title: "Relatório sobre Inteligência Artificial",
                summary: "Resumo executivo do relatório.",
            };

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify(mockMetadata),
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result).toHaveProperty("id");
            expect(result).toHaveProperty("query", query);
            expect(result).toHaveProperty("title", mockMetadata.title);
            expect(result).toHaveProperty("summary", mockMetadata.summary);
            expect(result).toHaveProperty("sections", mockSections);
            expect(result).toHaveProperty("sources", mockSources);
            expect(result).toHaveProperty("generatedAt");
            expect(result).toHaveProperty("processingTime");
        });

        it("should generate a unique ID for each report", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            const report1 = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );
            const report2 = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(report1.id).not.toBe(report2.id);
        });

        it("should calculate processing time correctly", async () => {
            const query = "test";
            const startTime = Date.now() - 5000; // 5 seconds ago

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result.processingTime).toBeGreaterThanOrEqual(5000);
            expect(result.processingTime).toBeLessThan(10000);
        });

        it("should include ISO timestamp", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        });

        it("should parse JSON from LLM response with surrounding text", async () => {
            const query = "test";
            const startTime = Date.now();
            const metadata = { title: "Test Title", summary: "Test Summary" };

            mockLLM.invoke.mockResolvedValue({
                content: `Here is the metadata:\n${JSON.stringify(metadata)}\nEnd of metadata.`,
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result.title).toBe(metadata.title);
            expect(result.summary).toBe(metadata.summary);
        });

        it("should throw error when JSON parsing fails", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: "This is not valid JSON",
            });

            await expect(
                writerAgent.synthesizeReport(query, mockSections, mockSources, startTime),
            ).rejects.toThrow("Failed to synthesize report");
        });

        it("should throw error when LLM invocation fails", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockRejectedValue(new Error("LLM error"));

            await expect(
                writerAgent.synthesizeReport(query, mockSections, mockSources, startTime),
            ).rejects.toThrow("Failed to synthesize report");
        });

        it("should include sections summary in prompt", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            await writerAgent.synthesizeReport(query, mockSections, mockSources, startTime);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain("Introdução");
            expect(promptArg).toContain("Análise Detalhada");
        });

        it("should request Portuguese content in prompt", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Título", summary: "Resumo" }),
            });

            await writerAgent.synthesizeReport(query, mockSections, mockSources, startTime);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain("PORTUGUÊS BRASILEIRO");
        });

        it("should include query in prompt", async () => {
            const query = "quantum computing";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            await writerAgent.synthesizeReport(query, mockSections, mockSources, startTime);

            const promptArg = mockLLM.invoke.mock.calls[0][0];
            expect(promptArg).toContain(query);
        });

        it("should preserve all sections in final report", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result.sections).toEqual(mockSections);
            expect(result.sections.length).toBe(mockSections.length);
        });

        it("should preserve all sources in final report", async () => {
            const query = "test";
            const startTime = Date.now();

            mockLLM.invoke.mockResolvedValue({
                content: JSON.stringify({ title: "Title", summary: "Summary" }),
            });

            const result = await writerAgent.synthesizeReport(
                query,
                mockSections,
                mockSources,
                startTime,
            );

            expect(result.sources).toEqual(mockSources);
            expect(result.sources.length).toBe(mockSources.length);
        });
    });
});
