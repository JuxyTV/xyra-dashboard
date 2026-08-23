import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Xyra Bot — All-in-One Discord Bot",
  description: "The ultimate premium Discord bot for your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col relative`}>
        <Providers>
          {/* Background blobs */}
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>

          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="glass-panel py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Xyra Bot. All rights reserved.</p>
              <p className="mt-2">Built with Next.js & Tailwind CSS.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
