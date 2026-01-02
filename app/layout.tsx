import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

// --- PROFESSIONAL METADATA (American Standard) ---
export const metadata: Metadata = {
  title: "EMMY CORE | High-Performance Workstations",
  description: "The global standard for professional-grade computing. Engineered for peak sustained performance. Deploying the world's most capable hardware to the West African technical elite.",
  keywords: ["Laptops", "RTX Workstations", "MacBook Pro Lagos", "High performance computing", "Emmy Core"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /**
     * Added suppressHydrationWarning here.
     * This stops React from throwing errors when browser extensions (like ColorZilla)
     * inject attributes like 'cz-shortcut-listen' into your HTML.
     */
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-blue-600 selection:text-white`}>
        {/* The Global Navigation */}
        <Navbar />
        
        {/* 
          Main content area. 
          The bg-white is used for the landing page sections, 
          while slate-50/50 provides the subtle dashboard background.
        */}
        <main className="min-h-screen bg-slate-50/50">
          {children}
        </main>

        {/* Global Notifications with premium styling */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          expand={false}
        />
      </body>
    </html>
  );
}