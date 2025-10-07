import type { ResearchData } from "@shared/types";
import { Card } from "../atoms/Card";

interface ReportSourcesProps {
  sources: ResearchData[];
}

export function ReportSources({ sources }: ReportSourcesProps) {
  return (
    <Card>
      <h3 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
        Fontes ({sources.length})
      </h3>
      <div className="space-y-3">
        {sources.slice(0, 10).map((source, idx) => (
          <div
            key={`source-${source.url}-${idx}`}
            className="pb-3 border-b last:border-0 border-[var(--color-bg-primary)]"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium flex-shrink-0 text-[var(--color-text-secondary)]">
                [{idx + 1}]
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-[var(--color-text-primary)]">
                  {source.source}
                </p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline truncate block text-[var(--color-accent)]"
                >
                  {source.url}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
