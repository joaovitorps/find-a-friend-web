import { type ReactNode } from "react";

import { CardLogo } from "@/components/card-logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="my-20 flex h-[calc(100vh-10rem)] flex-col lg:flex-row">
      <div className="ml-17 h-[400px] w-full shrink-0 lg:sticky lg:top-0 lg:h-full lg:w-[488px]">
        <CardLogo />
      </div>
      <div className="flex flex-1 justify-center overflow-auto px-7 py-16 sm:px-8 lg:h-full lg:p-0">
        <div className="w-full max-w-148">{children}</div>
      </div>
    </div>
  );
}
