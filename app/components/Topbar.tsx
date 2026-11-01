"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LogOut, Bell, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

// onMenuClick opens the sidebar on phones (layout.tsx passes it in)
export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { i18n, t } = useTranslation();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else if (session?.user) {
      // Google login users have no stored profile, treat as staff
      setUser({
        name: session.user.name,
        email: session.user.email,
        role: "staff",
      });
    }
  }, [session]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (session) {
      await signOut({ callbackUrl: "/login" });
    } else {
      window.location.href = "/login";
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  return (
    <header className="h-16 bg-card border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {/* Hamburger: visible only on phones */}
        <button onClick={onMenuClick} className="md:hidden mr-3 text-soft">
          <Menu size={22} />
        </button>

        <div>
          <p className="text-beige font-semibold text-sm">
            {t("welcome")}, {user?.name || "User"} 👋
          </p>
          {/* Hidden on small phones to avoid crowding */}
          <p className="text-soft text-xs hidden sm:block">Om Sai Enterprises</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleLanguage}
          className="text-xs border border-gray-200 text-soft px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {i18n.language === "en" ? "EN → हि" : "हि → EN"}
        </button>

        <button className="hidden sm:flex w-9 h-9 rounded-full bg-gray-100 items-center justify-center text-soft hover:bg-gray-200 transition-colors">
          <Bell size={16} />
        </button>

        {/* User name/role shown from tablet size up */}
        <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="text-beige text-xs font-medium">{user?.name}</p>
            <p className="text-soft text-xs">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}