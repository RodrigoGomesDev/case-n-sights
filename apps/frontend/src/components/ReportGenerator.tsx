"use client";

import type { Report } from "@shared/types";
import { useState } from "react";
import { reportService } from "../services";
import { EmptyState } from "./molecules/EmptyState";
import { ErrorAlert } from "./molecules/ErrorAlert";
import { LoadingState } from "./molecules/LoadingState";
import { Modal } from "./molecules/Modal";
import { Footer } from "./organisms/Footer";
import { ReportPreview } from "./organisms/ReportPreview";
import { ReportSuccess } from "./organisms/ReportSuccess";
import { MainLayout } from "./templates/MainLayout";

export default function ReportGenerator() {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleGenerateReport = async () => {
    if (!query.trim()) {
      setError("Por favor, insira um termo de busca");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const generatedReport = await reportService.generate(query);
      setReport(generatedReport);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!report) return;

    try {
      await reportService.exportToPDF(report);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Falha ao exportar PDF");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleGenerateReport();
    }
  };

  return (
    <MainLayout
      footer={
        <Footer
          query={query}
          onQueryChange={setQuery}
          onGenerate={handleGenerateReport}
          onKeyPress={handleKeyPress}
          loading={loading}
        />
      }
    >
      {!report && !loading && <EmptyState />}
      {loading && <LoadingState />}
      {error && <ErrorAlert message={error} />}
      {report && !loading && (
        <ReportSuccess
          report={report}
          onViewPreview={() => setShowPreviewModal(true)}
          onExportPDF={handleExportPDF}
        />
      )}

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Preview do Relatório"
      >
        {report && <ReportPreview report={report} onExportPDF={handleExportPDF} />}
      </Modal>
    </MainLayout>
  );
}
