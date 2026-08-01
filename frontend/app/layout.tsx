"use client";

import "./globals.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import LanguageProvider from "./components/LanguageProvider";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <LanguageProvider>
          {isLoginPage ? (
            <main className="flex-1">{children}</main>
          ) : (
            <>
              <Sidebar />
              <div className="flex flex-col flex-1">
                <Topbar />
                <main className="flex-1 p-6">{children}</main>
              </div>
            </>
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}