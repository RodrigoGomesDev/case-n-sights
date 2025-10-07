import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-[var(--color-error-bg)] border border-[var(--color-error-border)]">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-error)]" />
      <p className="text-[var(--color-error)]">{message}</p>
    </div>
  );
}
