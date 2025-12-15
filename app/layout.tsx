import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Economist Portfolio",
  description: "Personal portfolio showcasing research papers, data visualizations, and projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">{children}</main>
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>&copy; {new Date().getFullYear()} Portfolio. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
