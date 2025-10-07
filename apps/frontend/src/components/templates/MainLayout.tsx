import Image from "next/image";
import type { ReactNode } from "react";
import { Logo } from "../../assets";

interface MainLayoutProps {
  footer: ReactNode;
  children: ReactNode;
}

export function MainLayout({ footer, children }: MainLayoutProps) {
  return (
    <div className="w-full max-w-full h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="pt-6 flex justify-center flex-shrink-0">
        <Image src={Logo} alt="Case N-Sights" width={168} height={168} />
      </div>
      <div className="flex-1 flex flex-col max-md:px-6 justify-center items-center py-10 gap-6 max-md:gap-4">
        <div className="max-w-4xl max-md:max-w-full mx-auto md:px-6">{children}</div>
        {footer}
      </div>
    </div>
  );
}
