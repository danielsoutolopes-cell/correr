import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Bio-Triad OS | Alta Performance Híbrida do Clã Lopes",
  description:
    "Sistema Operacional de Alta Performance: Corrida Z2 Dual-Mode, Musculação A/B/C Adaptada, Nutrição TACO e IoT Residencial.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bio-Triad OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#07090E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-[#07090E] text-[#F3F4F6] min-h-screen antialiased selection:bg-blue-600 selection:text-white">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
