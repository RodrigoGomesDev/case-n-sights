import type { AnalysisSection } from "@shared/types";
import { Card } from "../atoms/Card";

interface ReportSectionProps {
  section: AnalysisSection;
}

export function ReportSection({ section }: ReportSectionProps) {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">{section.title}</h3>
      <p className="leading-relaxed whitespace-pre-line mb-4 text-[var(--color-text-primary)]">
        {section.content}
      </p>
      {section.subsections && section.subsections.length > 0 && (
        <div className="mt-4 space-y-4 pl-4 border-l-2 border-[var(--color-accent-light)]">
          {section.subsections.map((subsection, idx) => (
            <div key={`subsection-${subsection.title}-${idx}`}>
              <h4 className="font-semibold mb-2 text-[var(--color-accent-purple)]">
                {subsection.title}
              </h4>
              <p className="leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
                {subsection.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
