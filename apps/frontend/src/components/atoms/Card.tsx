import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white w-screen max-md:max-w-full max-w-2xl rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
