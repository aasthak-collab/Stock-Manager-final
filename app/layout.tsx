"use client";

import "./globals.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LanguageProvider from "./components/LanguageProvider";
import AuthGuard from "./components/AuthGuard";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [menuOpen, setMenuOpen] = useState(false); // phone menu state

  return (
    <html lang="en">
      <head>
        {/* Makes the page scale properly on phones */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex min-h-screen">
        <SessionProvider>
          <LanguageProvider>
            <AuthGuard>
              {isLoginPage ? (
                <main className="flex-1">{children}</main>
              ) : (
                <>
                  <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                  {/* min-w-0 lets wide tables scroll instead of stretching the page */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <Topbar onMenuClick={() => setMenuOpen(true)} />
                    <main className="flex-1 p-4 md:p-6">{children}</main>
                  </div>
                </>
              )}
            </AuthGuard>
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}