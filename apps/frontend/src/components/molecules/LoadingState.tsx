import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 animate-spin mb-4 text-[var(--color-accent)]" />
      <p className="text-lg font-medium text-[var(--color-text-primary)]">Gerando relatório...</p>
      <p className="text-sm mt-2 text-[var(--color-text-secondary)]">
        Isso pode levar até 30 segundos
      </p>
    </div>
  );
}
