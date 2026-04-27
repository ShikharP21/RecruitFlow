import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Providers from "@/components/auth/Providers";

export const metadata: Metadata = {
  title: "RecruitFlow",
  description: "AI-powered candidate filtering and selection platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors closeButton theme="dark" />
        <Analytics />
      </body>
    </html>
  );
}