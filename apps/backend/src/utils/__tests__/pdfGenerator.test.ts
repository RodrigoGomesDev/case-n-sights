import type { Report } from "@shared/types";
import { PDFGenerator } from "../pdfGenerator";

describe("PDFGenerator", () => {
    let pdfGenerator: PDFGenerator;
    let mockReport: Report;

    beforeEach(() => {
        pdfGenerator = new PDFGenerator();
        mockReport = {
            id: "test-report-123",
            query: "Test query",
            title: "Test Report Title",
            summary: "This is a test summary of the report.",
            sections: [
                {
                    title: "Section 1",
                    content: "This is the content of section 1.",
                    subsections: [
                        {
                            title: "Subsection 1.1",
                            content: "This is the content of subsection 1.1.",
                        },
                    ],
                },
                {
                    title: "Section 2",
                    content: "This is the content of section 2.",
                    subsections: [],
                },
            ],
            sources: [
                {
                    source: "example.com",
                    url: "https://example.com/article",
                    snippet: "This is a snippet from the source article.",
                    relevance: 8.5,
                },
                {
                    source: "test.com",
                    url: "https://test.com/page",
                    snippet: "Another snippet from a different source.",
                    relevance: 7.2,
                },
            ],
            generatedAt: "2024-01-01T12:00:00.000Z",
            processingTime: 5000,
        };
    });

    describe("generatePDF", () => {
        it("should return a PDFDocument instance", () => {
            const pdf = pdfGenerator.generatePDF(mockReport);

            expect(pdf).toBeDefined();
            expect(typeof pdf.pipe).toBe("function");
            expect(typeof pdf.end).toBe("function");
        });

        it("should generate PDF without errors for a valid report", () => {
            expect(() => {
                pdfGenerator.generatePDF(mockReport);
            }).not.toThrow();
        });

        it("should handle reports with no subsections", () => {
            const reportWithoutSubsections: Report = {
                ...mockReport,
                sections: [
                    {
                        title: "Simple Section",
                        content: "Simple content",
                        subsections: [],
                    },
                ],
            };

            expect(() => {
                pdfGenerator.generatePDF(reportWithoutSubsections);
            }).not.toThrow();
        });

        it("should handle reports with many sources", () => {
            const reportWithManySources: Report = {
                ...mockReport,
                sources: Array.from({ length: 50 }, (_, i) => ({
                    source: `source${i}.com`,
                    url: `https://source${i}.com`,
                    snippet: `Snippet ${i}`,
                    relevance: Math.random() * 10,
                })),
            };

            expect(() => {
                pdfGenerator.generatePDF(reportWithManySources);
            }).not.toThrow();
        });

        it("should handle reports with empty sections array", () => {
            const reportWithoutSections: Report = {
                ...mockReport,
                sections: [],
            };

            expect(() => {
                pdfGenerator.generatePDF(reportWithoutSections);
            }).not.toThrow();
        });

        it("should handle long content without errors", () => {
            const reportWithLongContent: Report = {
                ...mockReport,
                sections: [
                    {
                        title: "Long Section",
                        content: "Lorem ipsum dolor sit amet. ".repeat(500),
                        subsections: [],
                    },
                ],
            };

            expect(() => {
                pdfGenerator.generatePDF(reportWithLongContent);
            }).not.toThrow();
        });
    });
});
