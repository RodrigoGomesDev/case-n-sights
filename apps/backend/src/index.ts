import type { Report, SearchRequest } from "@shared/types";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import { ReportService } from "./services/reportService";
import { logger } from "./utils/logger";
import { PDFGenerator } from "./utils/pdfGenerator";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const reportService = new ReportService();
const pdfGenerator = new PDFGenerator();

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "AI Report Generation Service is running",
        timestamp: new Date().toISOString(),
    });
});

app.post("/api/reports/generate", async (req: Request, res: Response) => {
    try {
        const { query } = req.body as SearchRequest;

        if (!query || typeof query !== "string" || query.trim().length === 0) {
            res.status(400).json({
                status: "error",
                message: "Query parameter is required and must be a non-empty string",
            });
            return;
        }

        logger.info(`Received report generation request: ${query}`);

        const report = await reportService.generateReport(query);

        res.json({
            status: "completed",
            message: "Report generated successfully",
            report,
        });
    } catch (error) {
        logger.error("Report generation error", "API", error instanceof Error ? error : undefined);
        res.status(500).json({
            status: "error",
            message: "Failed to generate report",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

app.post("/api/reports/export/pdf", async (req: Request, res: Response) => {
    try {
        const report = req.body as Report;

        if (!report || !report.id) {
            res.status(400).json({
                status: "error",
                message: "Valid report data is required",
            });
            return;
        }

        const pdfStream = pdfGenerator.generatePDF(report);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="report-${report.id}.pdf"`);

        pdfStream.pipe(res);
    } catch (error) {
        logger.error("PDF generation error", "API", error instanceof Error ? error : undefined);
        res.status(500).json({
            status: "error",
            message: "Failed to generate PDF",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    logger.info(`Backend running at http://localhost:${PORT}`);
    logger.info("Ready to generate AI-powered reports");
});
