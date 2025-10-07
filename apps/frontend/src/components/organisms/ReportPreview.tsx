import type { Report } from "@shared/types";
import { Download } from "lucide-react";
import { Button } from "../atoms/Button";

interface ReportPreviewProps {
  report: Report;
  onExportPDF: () => void;
}

export function ReportPreview({ report, onExportPDF }: ReportPreviewProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{report.title}</h2>
      </div>

      <div className="text-sm text-[var(--color-text-secondary)] mb-6">
        <span>{new Date(report.generatedAt).toLocaleDateString("pt-BR")}</span>
        <span className="mx-2">•</span>
        <span>{(report.processingTime / 1000).toFixed(1)}s</span>
        <span className="mx-2">•</span>
        <span>{report.sources.length} fontes</span>
      </div>

      <div className="relative max-h-[500px] overflow-hidden">
        <div className="space-y-6">
          <div className="border-b border-[var(--color-bg-primary)] pb-6">
            <h3 className="text-lg font-bold text-[var(--color-accent)] mb-3">
              RESUMO EXECUTIVO
            </h3>
            <p className="leading-relaxed text-[var(--color-text-primary)]">{report.summary}</p>
          </div>

          {report.sections.slice(0, 1).map((section, idx) => (
            <div key={`section-preview-${section.title}-${idx}`}>
              <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">
                {section.title}
              </h3>
              <p className="leading-relaxed text-[var(--color-text-primary)] line-clamp-6">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent" />
      </div>

      <div className="mt-6 text-center border-t border-[var(--color-bg-primary)] pt-6">
        <p className="text-[var(--color-text-secondary)] mb-4">
          Este é apenas uma prévia. Baixe o PDF completo para ver todo o conteúdo, incluindo{" "}
          {report.sections.length} seções e {report.sources.length} fontes consultadas.
        </p>
        <Button onClick={onExportPDF} variant="primary" className="w-full max-w-md mx-auto">
          <Download className="w-5 h-5" />
          Baixar Relatório Completo em PDF
        </Button>
      </div>
    </div>
  );
}
