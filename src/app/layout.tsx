import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as alternative to Netflix font
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NontonYuk - Watch TV Shows Online, Watch Movies Online",
  description: "Watch TV shows and movies online. Stream streamed directly to your smart TV, game console, PC, Mac, mobile, tablet and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
