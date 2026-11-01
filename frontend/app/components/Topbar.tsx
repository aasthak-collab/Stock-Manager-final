"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { i18n } = useTranslation();
  const { data: session } = useSession();
  const hi = i18n.language === "hi";

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (session) await signOut({ callbackUrl: "/login" });
    else window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-card border-b border-gray-200 flex items-center gap-2 md:gap-3 px-4 md:px-6 sticky top-0 z-20">
      {/* Hamburger: phones only */}
      <button onClick={onMenuClick} className="md:hidden text-soft">
        <Menu size={22} />
      </button>

      <div className="flex-1" />

      <Link href="/sales" className="bg-primary text-white text-sm px-3 md:px-4 py-2 rounded-xl whitespace-nowrap">
        + {hi ? "बिक्री जोड़ें" : "Add Sale"}
      </Link>
      <Link href="/purchases" className="bg-secondary text-white text-sm px-3 md:px-4 py-2 rounded-xl whitespace-nowrap">
        + {hi ? "खरीद जोड़ें" : "Add Purchase"}
      </Link>

      <button
        onClick={() => i18n.changeLanguage(hi ? "en" : "hi")}
        className="text-xs border border-gray-200 text-soft px-3 py-1.5 rounded-full whitespace-nowrap"
      >
        {hi ? "हि → EN" : "EN → हि"}
      </button>

      {/* Logout: far right */}
      <button
        onClick={handleLogout}
        className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
      >
        <LogOut size={16} />
      </button>
    </header>
  );
}