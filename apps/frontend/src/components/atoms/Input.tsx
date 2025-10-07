interface InputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Input({ value, onChange, onKeyPress, placeholder, disabled }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] border-[var(--color-border)] outline-0 focus:border-[var(--color-accent)]"
      disabled={disabled}
    />
  );
}
