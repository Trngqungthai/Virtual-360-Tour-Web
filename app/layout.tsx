import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import { siteConfig } from "@/lib/constants";
import { getLocale } from "@/lib/locale-server";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Virtual 360 Tour Service",
    template: "%s | Virtual 360"
  },
  description: siteConfig.description,
  keywords: [
    "virtual tour",
    "360 tour service",
    "real estate virtual tours",
    "hotel virtual tours",
    "immersive showcase"
  ],
  openGraph: {
    title: "Virtual 360 Tour Service",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual 360 Tour Service",
    description: siteConfig.description
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${poppins.variable} bg-slate-50 font-sans text-slate-950 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
