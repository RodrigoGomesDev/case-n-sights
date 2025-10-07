import type { Report, ReportGenerationStatus } from "@shared/types";
import { API_ENDPOINTS } from "../config/constants";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const reportService = {
  async generate(query: string): Promise<Report> {
    const response = await fetch(API_ENDPOINTS.GENERATE_REPORT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new ApiError("Falha ao gerar relatório", response.status);
    }

    const data: ReportGenerationStatus = await response.json();

    if (data.status === "completed" && data.report) {
      return data.report;
    }

    throw new ApiError(data.message || "Falha ao gerar relatório");
  },

  async exportToPDF(report: Report): Promise<void> {
    const response = await fetch(API_ENDPOINTS.EXPORT_PDF, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new ApiError("Falha ao exportar PDF", response.status);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async checkHealth(): Promise<{ status: string; message: string }> {
    const response = await fetch(API_ENDPOINTS.HEALTH);

    if (!response.ok) {
      throw new ApiError("Servidor indisponível", response.status);
    }

    return response.json();
  },
};
