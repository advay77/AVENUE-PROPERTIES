import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Avenue Properties — Real Estate Consultancy in Noida",
    template: "%s — Avenue Properties",
  },
  description:
    "Avenue Properties is a real estate consultancy in Sector 75, Noida. Residential and commercial property buying, selling, renting and leasing, with valuation, documentation coordination and interior services.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23C91427'/%3E%3Cpath d='M16 7 8 14v11h5v-6h6v6h5V14z' fill='%23fff'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#C91427",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="no-js">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
