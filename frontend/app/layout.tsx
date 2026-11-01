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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="flex min-h-screen">
        <SessionProvider>
          <LanguageProvider>
            <AuthGuard>
              {pathname === "/login" ? (
                <main className="flex-1">{children}</main>
              ) : (
                <>
                  <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                  <div className="flex flex-col flex-1 min-w-0">
                    <Topbar onMenuClick={() => setMenuOpen(true)} />
                    <main key={pathname} className="flex-1 p-4 md:p-6 page-fade">
                      {children}
                    </main>
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