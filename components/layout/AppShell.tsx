"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { QuickContact } from "./QuickContact";
import { RoleSwitcher } from "./RoleSwitcher";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return (
      <>
        {children}
        <RoleSwitcher />
      </>
    );
  }

  return (
    <>
      <div className="pc-layout-shell">
        <Header />
      </div>
      <div className="mobile-layout-shell">
        <MobileHeader />
      </div>
      <main className="mx-auto min-h-[calc(100svh-220px)] w-full max-w-[1180px] px-4 py-8 md:px-6 lg:py-10">
        {children}
      </main>
      <Footer />
      <QuickContact />
      <RoleSwitcher />
    </>
  );
}
