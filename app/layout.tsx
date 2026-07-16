import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout";
import { ToastProvider } from "@/components/ui";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://al06team2.web.app"),
  title: {
    default: "CLIPBee",
    template: "%s | CLIPBee",
  },
  description: "촬영·편집 의뢰자와 촬영자·촬영팀·편집자를 연결하는 CLIPBee",
  openGraph: {
    title: "CLIPBee",
    description: "촬영·편집 의뢰자와 촬영자·촬영팀·편집자를 연결하는 CLIPBee",
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
