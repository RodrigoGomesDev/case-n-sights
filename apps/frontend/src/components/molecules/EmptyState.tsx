export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-4xl max-md:text-3xl font-bold text-[var(--color-text-primary)]">
          Relatórios <span className="gradient-text">Inteligentes</span>
        </h2>
        <p className="text-lg max-md:text-base text-[var(--color-text-secondary)]">
          Digite um tema e gere relatórios completos com IA
        </p>
      </div>
    </div>
  );
}
