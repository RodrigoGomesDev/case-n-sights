"use client";

import type { Report } from "@shared/types";
import { useState } from "react";
import { EmptyState } from "../../components/molecules/EmptyState";
import { ErrorAlert } from "../../components/molecules/ErrorAlert";
import { LoadingState } from "../../components/molecules/LoadingState";
import { Modal } from "../../components/molecules/Modal";
import { Footer } from "../../components/organisms/Footer";
import { ReportPreview } from "../../components/organisms/ReportPreview";
import { ReportSuccess } from "../../components/organisms/ReportSuccess";
import { MainLayout } from "../../components/templates/MainLayout";

const MOCK_REPORT: Report = {
  id: "test-report-123",
  query: "Tesla",
  title: "Análise Completa sobre Tesla: Inovação e Liderança no Mercado de Veículos Elétricos",
  summary:
    "A Tesla revolucionou a indústria automotiva ao estabelecer-se como líder global em veículos elétricos e energia sustentável. Sob a liderança de Elon Musk, a empresa não apenas popularizou os carros elétricos, mas também desenvolveu tecnologias inovadoras em baterias, direção autônoma e energia solar. Este relatório examina a trajetória da Tesla, seus principais produtos, desafios e o impacto transformador no setor de mobilidade elétrica global.",
  sections: [
    {
      title: "História e Evolução da Tesla",
      content:
        "Fundada em 2003 por Martin Eberhard e Marc Tarpenning, a Tesla Motors foi criada com a missão de acelerar a transição mundial para energia sustentável. Elon Musk juntou-se à empresa em 2004 como principal investidor e posteriormente assumiu o papel de CEO. O primeiro veículo da empresa, o Tesla Roadster (2008), demonstrou que carros elétricos poderiam ser rápidos e desejáveis. Desde então, a Tesla expandiu sua linha de produtos com o Model S, Model X, Model 3 e Model Y, cada um alcançando marcos significativos em vendas e inovação tecnológica.",
      subsections: [
        {
          title: "Primeiros Anos (2003-2010)",
          content:
            "Período de desenvolvimento do Roadster e estabelecimento da marca no mercado de luxo elétrico.",
        },
        {
          title: "Expansão e Crescimento (2010-2020)",
          content:
            "Lançamento dos modelos Model S, X e 3, construção de Gigafactories e expansão global.",
        },
      ],
    },
    {
      title: "Produtos e Tecnologias",
      content:
        "A Tesla oferece uma gama diversificada de produtos além de veículos elétricos. O portfólio inclui sistemas de armazenamento de energia (Powerwall, Powerpack, Megapack), painéis solares e telhados solares. A tecnologia de direção autônoma (Autopilot e Full Self-Driving) representa um dos maiores investimentos em P&D da empresa. As baterias de íon-lítio desenvolvidas internamente estabelecem novos padrões de densidade energética e custo, tornando os veículos elétricos mais acessíveis e práticos para o consumidor médio.",
      subsections: [],
    },
    {
      title: "Desempenho Financeiro e Mercado",
      content:
        "A Tesla tornou-se uma das empresas automotivas mais valiosas do mundo, com capitalização de mercado frequentemente superando montadoras tradicionais combinadas. As ações da empresa (TSLA) experimentaram crescimento exponencial, embora com volatilidade significativa. A produção anual cresceu de milhares para milhões de unidades, com fábricas em diferentes continentes. O lucro operacional positivo consistente foi alcançado em 2020, marcando uma virada importante na trajetória financeira da empresa.",
      subsections: [],
    },
    {
      title: "Desafios e Controvérsias",
      content:
        "Apesar do sucesso, a Tesla enfrenta diversos desafios: problemas de qualidade e recalls, atrasos na produção, controvérsias relacionadas às declarações de Elon Musk nas redes sociais, investigações sobre acidentes envolvendo o Autopilot, e pressão crescente da concorrência de montadoras tradicionais entrando no mercado elétrico. Questões trabalhistas em suas fábricas e críticas sobre práticas ambientais na mineração de lítio também geraram debates públicos.",
      subsections: [],
    },
  ],
  sources: [
    {
      url: "https://www.tesla.com",
      source: "Tesla Official Website",
      snippet: "Leading electric vehicle manufacturer and clean energy company...",
      relevance: 0,
    },
    {
      url: "https://ir.tesla.com",
      source: "Tesla Investor Relations",
      snippet: "Financial reports and investor information for Tesla Inc...",
      relevance: 0,
    },
    {
      url: "https://www.bloomberg.com/tesla",
      source: "Bloomberg - Tesla Coverage",
      snippet: "Latest news and analysis on Tesla's market performance...",
      relevance: 0,
    },
    {
      url: "https://electrek.co",
      source: "Electrek - Electric Vehicle News",
      snippet: "Comprehensive coverage of Tesla and electric vehicle industry...",
      relevance: 0,
    },
  ],
  generatedAt: new Date().toISOString(),
  processingTime: 24500,
};

export default function TestPage() {
  const [query, setQuery] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleExportPDF = () => {
    alert(
      "📥 Em uma implementação real, o PDF seria baixado aqui!\n\nEsta é uma página de TESTE com dados mockados.",
    );
  };

  const handleGenerate = () => {
    if (!query.trim()) {
      setError("Por favor, insira um termo de busca");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    setTimeout(() => {
      setReport(MOCK_REPORT);
      setLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleGenerate();
    }
  };

  return (
    <MainLayout
      footer={
        <Footer
          query={query}
          onQueryChange={setQuery}
          onGenerate={handleGenerate}
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
        title="Preview do Relatório (TESTE)"
      >
        {report && <ReportPreview report={report} onExportPDF={handleExportPDF} />}
      </Modal>
    </MainLayout>
  );
}
