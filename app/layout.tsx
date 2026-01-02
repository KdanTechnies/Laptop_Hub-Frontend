import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react"; // 1. Import Suspense

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-blue-600 selection:text-white`}>
        
        {/* 
          2. CRITICAL FIX: Wrapped Navbar in Suspense.
          Since the Navbar now uses 'useSearchParams' for the search bar, 
          Next.js requires a Suspense boundary to handle client-side rendering 
          during the Vercel build process.
        */}
        <Suspense fallback={
          <div className="h-20 w-full bg-white/80 border-b backdrop-blur-md flex items-center px-4 justify-between">
            <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg" />
            <div className="h-10 w-64 bg-slate-100 animate-pulse rounded-full hidden md:block" />
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
          </div>
        }>
          <Navbar />
        </Suspense>
        
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