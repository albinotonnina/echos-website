import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchOS: Your personal AI knowledge system",
  description:
    "Self-hosted, agent-driven personal knowledge management. Capture anything, search semantically, write in your voice. Always private.",
  metadataBase: new URL("https://echos.sh"),
  openGraph: {
    title: "EchOS: Your personal AI knowledge system",
    description:
      "Self-hosted, agent-driven personal knowledge management. Capture anything, search semantically, write in your voice.",
    url: "https://echos.sh",
    siteName: "EchOS",
    type: "website",
    images: [
      {
        url: "/images/banner.jpeg",
        width: 1200,
        height: 630,
        alt: "EchOS – Your personal AI knowledge system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchOS: Your personal AI knowledge system",
    description:
      "Self-hosted, agent-driven personal knowledge management. Capture anything, search semantically, write in your voice.",
    images: ["/images/banner.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
