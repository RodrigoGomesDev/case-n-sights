import type { Report, ReportGenerationStatus } from "@shared/types";
import { ApiError, reportService } from "../api";

// Mock fetch
global.fetch = jest.fn();

describe("ApiError", () => {
  it("should create error with message and status", () => {
    const error = new ApiError("Test error", 500);
    expect(error.message).toBe("Test error");
    expect(error.status).toBe(500);
    expect(error.name).toBe("ApiError");
  });

  it("should create error without status", () => {
    const error = new ApiError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.status).toBeUndefined();
  });
});

describe("reportService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generate", () => {
    it("should generate report successfully", async () => {
      const mockReport: Report = {
        id: "test-id",
        query: "test query",
        title: "Test Report",
        summary: "Test summary",
        sections: [],
        sources: [],
        generatedAt: new Date().toISOString(),
        processingTime: 1000,
      };

      const mockResponse: ReportGenerationStatus = {
        status: "completed",
        report: mockReport,
        message: "Success",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await reportService.generate("test query");

      expect(result).toEqual(mockReport);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/reports/generate"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "test query" }),
        }),
      );
    });

    it("should throw ApiError when response is not ok", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(reportService.generate("test")).rejects.toThrow(ApiError);
    });

    it("should throw ApiError when status is not completed", async () => {
      const mockResponse: ReportGenerationStatus = {
        status: "error",
        message: "Generation failed",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(reportService.generate("test")).rejects.toThrow("Generation failed");
    });

    it("should throw default error message when no message provided", async () => {
      const mockResponse: ReportGenerationStatus = {
        status: "error",
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await expect(reportService.generate("test")).rejects.toThrow("Falha ao gerar relatório");
    });
  });

  describe("exportToPDF", () => {
    it("should export PDF successfully", async () => {
      const mockReport: Report = {
        id: "test-id",
        query: "test",
        title: "Test",
        summary: "Summary",
        sections: [],
        sources: [],
        generatedAt: new Date().toISOString(),
        processingTime: 1000,
      };

      const mockBlob = new Blob(["pdf content"], { type: "application/pdf" });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        blob: async () => mockBlob,
      });

      // Mock DOM methods
      const mockClick = jest.fn();
      const mockAppendChild = jest.spyOn(document.body, "appendChild").mockImplementation();
      const mockRemoveChild = jest.spyOn(document.body, "removeChild").mockImplementation();
      const createElementSpy = jest.spyOn(document, "createElement").mockReturnValue({
        click: mockClick,
        href: "",
        download: "",
      } as unknown as HTMLAnchorElement);

      await reportService.exportToPDF(mockReport);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/reports/export/pdf"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(mockReport),
        }),
      );
      expect(mockClick).toHaveBeenCalled();
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockRemoveChild).toHaveBeenCalled();

      createElementSpy.mockRestore();
      mockAppendChild.mockRestore();
      mockRemoveChild.mockRestore();
    });

    it("should throw ApiError when export fails", async () => {
      const mockReport: Report = {
        id: "test-id",
        query: "test",
        title: "Test",
        summary: "Summary",
        sections: [],
        sources: [],
        generatedAt: new Date().toISOString(),
        processingTime: 1000,
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(reportService.exportToPDF(mockReport)).rejects.toThrow(ApiError);
    });
  });

  describe("checkHealth", () => {
    it("should check health successfully", async () => {
      const mockHealth = { status: "ok", message: "Server is running" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHealth,
      });

      const result = await reportService.checkHealth();

      expect(result).toEqual(mockHealth);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/api/health"));
    });

    it("should throw ApiError when health check fails", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 503,
      });

      await expect(reportService.checkHealth()).rejects.toThrow(ApiError);
    });
  });
});
