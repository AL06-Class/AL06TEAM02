import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shootmon.example.kr"),
  title: {
    default: "촬영몬",
    template: "%s | 촬영몬",
  },
  description: "촬영 의뢰자와 촬영자를 연결하는 촬영몬",
  openGraph: {
    title: "촬영몬",
    description: "촬영 의뢰자와 촬영자를 연결하는 촬영몬",
    images: ["/images/presets/placeholders/shootmon-placeholder-camera-01.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
