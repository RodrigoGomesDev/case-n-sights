import type { Report } from "@shared/types";
import PDFDocument from "pdfkit";

export class PDFGenerator {
    generatePDF(report: Report): typeof PDFDocument.prototype {
        const doc = new PDFDocument({
            size: "A4",
            margins: { top: 50, bottom: 50, left: 60, right: 60 },
        });

        doc.fontSize(24).font("Helvetica-Bold").text(report.title, { align: "center" });

        doc.moveDown();
        doc.fontSize(10)
            .font("Helvetica")
            .fillColor("#666666")
            .text(`Generated on: ${new Date(report.generatedAt).toLocaleString()}`, {
                align: "center",
            });

        doc.moveDown();
        doc.fontSize(10).text(`Query: ${report.query}`, { align: "center" });

        doc.moveDown(2);

        doc.fontSize(16).font("Helvetica-Bold").fillColor("#000000").text("Executive Summary");

        doc.moveDown(0.5);
        doc.fontSize(11).font("Helvetica").text(report.summary, { align: "justify" });

        doc.moveDown(2);

        for (const section of report.sections) {
            doc.fontSize(14).font("Helvetica-Bold").fillColor("#1a1a1a").text(section.title);

            doc.moveDown(0.5);

            doc.fontSize(11)
                .font("Helvetica")
                .fillColor("#000000")
                .text(section.content, { align: "justify" });

            if (section.subsections && section.subsections.length > 0) {
                doc.moveDown(1);

                for (const subsection of section.subsections) {
                    doc.fontSize(12).font("Helvetica-Bold").text(subsection.title);

                    doc.moveDown(0.3);

                    doc.fontSize(11)
                        .font("Helvetica")
                        .text(subsection.content, { align: "justify" });

                    doc.moveDown(0.8);
                }
            }

            doc.moveDown(1.5);
        }

        doc.addPage();

        doc.fontSize(16).font("Helvetica-Bold").text("Sources");

        doc.moveDown(1);

        report.sources.slice(0, 20).forEach((source, index) => {
            doc.fontSize(10)
                .font("Helvetica-Bold")
                .text(`${index + 1}. ${source.source}`);

            doc.fontSize(9)
                .font("Helvetica")
                .fillColor("#0066cc")
                .text(source.url, { link: source.url });

            doc.fillColor("#000000").text(`${source.snippet.substring(0, 200)}...`, {
                align: "justify",
            });

            doc.moveDown(0.8);
        });

        doc.end();

        return doc;
    }
}
