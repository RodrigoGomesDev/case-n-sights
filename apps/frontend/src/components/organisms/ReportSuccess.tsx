import type { Report } from "@shared/types";
import { CheckCircle, Download, Eye } from "lucide-react";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";

interface ReportSuccessProps {
  report: Report;
  onViewPreview: () => void;
  onExportPDF: () => void;
}

export function ReportSuccess({ report, onViewPreview, onExportPDF }: ReportSuccessProps) {
  return (
    <Card>
      <div className="flex w-full max-md:max-w-full flex-col items-center text-center">
        <CheckCircle className="w-10 h-10 text-[var(--color-accent)] mb-4" />

        <h2 className="text-4xl max-md:text-3xl font-bold text-[var(--color-text-primary)]">
          Relatório Gerado com Sucesso!
        </h2>

        <p className="text-lg text-[var(--color-text-secondary)] mb-6">
          Seu relatório sobre{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">"{report.query}"</span>{" "}
          está pronto.
        </p>

        <div className="w-full space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] py-2 px-4 bg-[var(--color-bg-primary)] rounded-lg">
            <span>Tempo de processamento:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {(report.processingTime / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] py-2 px-4 bg-[var(--color-bg-primary)] rounded-lg">
            <span>Seções geradas:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {report.sections.length}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-[var(--color-text-secondary)] py-2 px-4 bg-[var(--color-bg-primary)] rounded-lg">
            <span>Fontes consultadas:</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              {report.sources.length}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={onViewPreview} variant="secondary" className="flex-1">
            <Eye className="w-5 h-5" />
            Ver Preview
          </Button>

          <Button onClick={onExportPDF} variant="primary" className="flex-1">
            <Download className="w-5 h-5" />
            Baixar PDF Completo
          </Button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)] mt-4">
          O preview mostra apenas as primeiras seções. Para o relatório completo, baixe o PDF.
        </p>
      </div>
    </Card>
  );
}
