import type { AnalysisSection, Report, ResearchData } from "@shared/types";
import { ReportService } from "../reportService";

jest.mock("../../agents/researchAgent");
jest.mock("../../agents/analystAgent");
jest.mock("../../agents/writerAgent");

interface MockResearchAgent {
    research: jest.Mock;
}

interface MockAnalystAgent {
    analyze: jest.Mock;
}

interface MockWriterAgent {
    synthesizeReport: jest.Mock;
}

describe("ReportService", () => {
    let reportService: ReportService;
    let mockResearchAgent: MockResearchAgent;
    let mockAnalystAgent: MockAnalystAgent;
    let mockWriterAgent: MockWriterAgent;

    beforeEach(() => {
        const { ResearchAgent } = require("../../agents/researchAgent");
        const { AnalystAgent } = require("../../agents/analystAgent");
        const { WriterAgent } = require("../../agents/writerAgent");

        mockResearchAgent = {
            research: jest.fn(),
        };

        mockAnalystAgent = {
            analyze: jest.fn(),
        };

        mockWriterAgent = {
            synthesizeReport: jest.fn(),
        };

        ResearchAgent.mockImplementation(() => mockResearchAgent);
        AnalystAgent.mockImplementation(() => mockAnalystAgent);
        WriterAgent.mockImplementation(() => mockWriterAgent);

        reportService = new ReportService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("generateReport", () => {
        const mockResearchData: ResearchData[] = [
            {
                source: "example.com",
                url: "https://example.com",
                snippet: "Test snippet",
                relevance: 8.5,
            },
        ];

        const mockSections: AnalysisSection[] = [
            {
                title: "Section 1",
                content: "Content 1",
                subsections: [],
            },
        ];

        const mockReport: Report = {
            id: "test-id",
            query: "test query",
            title: "Test Report",
            summary: "Test summary",
            sections: mockSections,
            sources: mockResearchData,
            generatedAt: new Date().toISOString(),
            processingTime: 5000,
        };

        it("should generate a complete report", async () => {
            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            const result = await reportService.generateReport("test query");

            expect(result).toEqual(mockReport);
        });

        it("should call research agent with query", async () => {
            const query = "artificial intelligence";

            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            await reportService.generateReport(query);

            expect(mockResearchAgent.research).toHaveBeenCalledWith(query);
        });

        it("should call analyst agent with query and research data", async () => {
            const query = "test query";

            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            await reportService.generateReport(query);

            expect(mockAnalystAgent.analyze).toHaveBeenCalledWith(query, mockResearchData);
        });

        it("should call writer agent with all necessary data", async () => {
            const query = "test query";

            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            await reportService.generateReport(query);

            expect(mockWriterAgent.synthesizeReport).toHaveBeenCalledWith(
                query,
                mockSections,
                mockResearchData,
                expect.any(Number),
            );
        });

        it("should pass start time to writer agent", async () => {
            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            const beforeCall = Date.now();
            await reportService.generateReport("test");
            const afterCall = Date.now();

            const startTimeArg = mockWriterAgent.synthesizeReport.mock.calls[0][3];
            expect(startTimeArg).toBeGreaterThanOrEqual(beforeCall);
            expect(startTimeArg).toBeLessThanOrEqual(afterCall);
        });

        it("should throw error when no research data is found", async () => {
            mockResearchAgent.research.mockResolvedValue([]);

            await expect(reportService.generateReport("test query")).rejects.toThrow(
                "No research data found",
            );

            expect(mockAnalystAgent.analyze).not.toHaveBeenCalled();
            expect(mockWriterAgent.synthesizeReport).not.toHaveBeenCalled();
        });

        it("should throw error when analysis returns no sections", async () => {
            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue([]);

            await expect(reportService.generateReport("test query")).rejects.toThrow(
                "Analysis failed to generate sections",
            );

            expect(mockWriterAgent.synthesizeReport).not.toHaveBeenCalled();
        });

        it("should propagate errors from research agent", async () => {
            mockResearchAgent.research.mockRejectedValue(new Error("Research failed"));

            await expect(reportService.generateReport("test query")).rejects.toThrow(
                "Research failed",
            );
        });

        it("should propagate errors from analyst agent", async () => {
            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockRejectedValue(new Error("Analysis failed"));

            await expect(reportService.generateReport("test query")).rejects.toThrow(
                "Analysis failed",
            );
        });

        it("should propagate errors from writer agent", async () => {
            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockRejectedValue(new Error("Synthesis failed"));

            await expect(reportService.generateReport("test query")).rejects.toThrow(
                "Synthesis failed",
            );
        });

        it("should call agents in correct sequence", async () => {
            const callOrder: string[] = [];

            mockResearchAgent.research.mockImplementation(async () => {
                callOrder.push("research");
                return mockResearchData;
            });

            mockAnalystAgent.analyze.mockImplementation(async () => {
                callOrder.push("analyze");
                return mockSections;
            });

            mockWriterAgent.synthesizeReport.mockImplementation(async () => {
                callOrder.push("synthesize");
                return mockReport;
            });

            await reportService.generateReport("test");

            expect(callOrder).toEqual(["research", "analyze", "synthesize"]);
        });

        it("should handle multiple research data items", async () => {
            const multipleResearchData: ResearchData[] = [
                { source: "source1.com", url: "url1", snippet: "snippet1", relevance: 9 },
                { source: "source2.com", url: "url2", snippet: "snippet2", relevance: 8 },
                { source: "source3.com", url: "url3", snippet: "snippet3", relevance: 7 },
            ];

            mockResearchAgent.research.mockResolvedValue(multipleResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(mockSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            await reportService.generateReport("test");

            expect(mockAnalystAgent.analyze).toHaveBeenCalledWith("test", multipleResearchData);
        });

        it("should handle multiple analysis sections", async () => {
            const multipleSections: AnalysisSection[] = [
                { title: "Section 1", content: "Content 1", subsections: [] },
                { title: "Section 2", content: "Content 2", subsections: [] },
                { title: "Section 3", content: "Content 3", subsections: [] },
            ];

            mockResearchAgent.research.mockResolvedValue(mockResearchData);
            mockAnalystAgent.analyze.mockResolvedValue(multipleSections);
            mockWriterAgent.synthesizeReport.mockResolvedValue(mockReport);

            await reportService.generateReport("test");

            expect(mockWriterAgent.synthesizeReport).toHaveBeenCalledWith(
                "test",
                multipleSections,
                mockResearchData,
                expect.any(Number),
            );
        });
    });
});
