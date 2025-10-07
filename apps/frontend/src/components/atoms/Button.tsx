import type { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
}

export function Button({
  onClick,
  disabled,
  variant = "primary",
  children,
  type = "button",
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-medium text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white ${className} ${
        disabled
          ? "bg-[var(--color-accent)]"
          : variant === "primary"
            ? "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]"
            : "bg-[var(--color-accent)] hover:opacity-90"
      }`}
      type={type}
    >
      {children}
    </button>
  );
}
