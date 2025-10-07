import { FileText } from "lucide-react";
import { Button } from "../atoms/Button";
import { SearchInput } from "../molecules/SearchInput";

interface FooterProps {
  query: string;
  onQueryChange: (value: string) => void;
  onGenerate: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading: boolean;
}

export function Footer({ query, onQueryChange, onGenerate, onKeyPress, loading }: FooterProps) {
  return (
    <footer className="border rounded-xl shadow-sm border-[var(--color-border)] w-full max-w-2xl mx-auto bg-[var(--color-bg-secondary)] py-4 px-6">
      <div className="w-full mx-auto">
        <div className="flex max-md:flex-col gap-3">
          <SearchInput
            value={query}
            onChange={onQueryChange}
            onKeyPress={onKeyPress}
            placeholder="Digite... (ex: Tesla, Bitcoin, IA)"
            disabled={loading}
          />
          <Button onClick={onGenerate} disabled={loading || !query.trim()}>
            <FileText className="w-5 h-5" />
            Gerar
          </Button>
        </div>
      </div>
    </footer>
  );
}
