import type { Report } from "@shared/types";
import { Card } from "../atoms/Card";

interface ReportHeaderProps {
  report: Report;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  return (
    <Card>
      <h2 className="text-3xl font-bold mb-3 text-[var(--color-text-primary)]">{report.title}</h2>
      <div className="flex items-center gap-4 text-sm mb-4 text-[var(--color-text-secondary)]">
        <span>Query: {report.query}</span>
        <span>•</span>
        <span>{new Date(report.generatedAt).toLocaleDateString("pt-BR")}</span>
        <span>•</span>
        <span>{(report.processingTime / 1000).toFixed(1)}s</span>
      </div>
      <div className="pt-4 border-t border-[var(--color-bg-primary)]">
        <h3 className="text-sm font-semibold mb-2 text-[var(--color-accent)]">
          RESUMO EXECUTIVO
        </h3>
        <p className="leading-relaxed text-[var(--color-text-primary)]">{report.summary}</p>
      </div>
    </Card>
  );
}
