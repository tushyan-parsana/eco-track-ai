import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { SkipLink } from "@/components/SkipLink";
import { Footer } from "@/components/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoTrack AI | Carbon Footprint Intelligence",
  description:
    "Track your environmental impact with AI-powered insights. Measure your carbon footprint, set sustainability goals, and join a global community of eco-conscious individuals.",
  keywords: [
    "carbon footprint",
    "sustainability",
    "eco tracker",
    "climate change",
    "CO2 calculator",
    "environmental impact",
    "AI recommendations",
  ],
  authors: [{ name: "EcoTrack AI Team" }],
  openGraph: {
    type: "website",
    title: "EcoTrack AI | Carbon Footprint Intelligence",
    description:
      "Measure your environmental impact, discover smarter lifestyle choices, and achieve meaningful carbon reduction goals.",
    siteName: "EcoTrack AI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoTrack AI | Carbon Footprint Intelligence",
    description:
      "Track your carbon footprint with AI-powered insights and join a community of planet-conscious individuals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pt-16">
        <Providers>
          <SkipLink />
          <Navbar />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
