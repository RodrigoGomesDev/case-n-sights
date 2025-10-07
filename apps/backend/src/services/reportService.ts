import type { Report } from "@shared/types";
import { AnalystAgent } from "../agents/analystAgent";
import { ResearchAgent } from "../agents/researchAgent";
import { WriterAgent } from "../agents/writerAgent";
import { logger } from "../utils/logger";

export class ReportService {
    private researchAgent: ResearchAgent;
    private analystAgent: AnalystAgent;
    private writerAgent: WriterAgent;

    constructor() {
        this.researchAgent = new ResearchAgent();
        this.analystAgent = new AnalystAgent();
        this.writerAgent = new WriterAgent();
    }

    async generateReport(query: string): Promise<Report> {
        const startTime = Date.now();

        logger.info(`Starting report generation for: ${query}`, "ReportService");

        const researchData = await this.researchAgent.research(query);

        if (researchData.length === 0) {
            throw new Error("No research data found");
        }

        const sections = await this.analystAgent.analyze(query, researchData);

        if (sections.length === 0) {
            throw new Error("Analysis failed to generate sections");
        }

        const report = await this.writerAgent.synthesizeReport(
            query,
            sections,
            researchData,
            startTime,
        );

        logger.info("Report generation complete", "ReportService");

        return report;
    }
}
