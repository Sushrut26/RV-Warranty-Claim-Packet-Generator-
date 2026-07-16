import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "RV Warranty Claim Packet Generator",
  description:
    "Generate a professional, print-ready RV warranty claim PDF in minutes. " +
    "Free, no account, and nothing ever leaves your browser.",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    title: "RV Claim Packet",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
