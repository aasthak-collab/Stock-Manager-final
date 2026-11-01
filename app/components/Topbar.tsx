"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Bell, Menu, Search, AlertTriangle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import api from "../../libraries/axios";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { i18n } = useTranslation();
  const { data: session } = useSession();
  const [lowItems, setLowItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) return; // skip if not logged in
    const load = async () => {
      try {
        const res = await api.get("/api/stock");
        setLowItems(res.data.filter((i: any) => i.quantity <= i.threshold));
      } catch {}
    };
    load();
    const timer = setInterval(load, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (session) await signOut({ callbackUrl: "/login" });
    else window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-card border-b border-gray-200 flex items-center gap-3 px-4 md:px-6 sticky top-0 z-20">
      {/* Hamburger: phones only */}
      <button onClick={onMenuClick} className="md:hidden text-soft"><Menu size={22} /></button>

      {/* Search box: tablet and laptop only */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-sm">
        <Search size={16} className="text-soft" />
        <input placeholder="Search..." className="bg-transparent outline-none text-sm w-full" />
      </div>

      <div className="flex-1 md:hidden" />

      {/* Quick action buttons: tablet and laptop only */}
      <Link href="/sales" className="hidden md:block bg-primary text-white text-sm px-4 py-2 rounded-xl">+ Add Sale</Link>
      <Link href="/purchases" className="hidden md:block bg-secondary text-white text-sm px-4 py-2 rounded-xl">+ Add Purchase</Link>

      <button
        onClick={() => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en")}
        className="text-xs border border-gray-200 text-soft px-3 py-1.5 rounded-full"
      >
        {i18n.language === "en" ? "EN → हि" : "हि → EN"}
      </button>

      {/* Bell with low-stock dropdown */}
      <div className="relative">
        <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-soft">
          <Bell size={16} />
          {lowItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {lowItems.length}
            </span>
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-72 max-w-[85vw] bg-card border border-gray-200 rounded-2xl shadow-lg p-3">
            <p className="text-beige text-sm font-semibold mb-2">Low stock alerts</p>
            {lowItems.length === 0 ? (
              <p className="text-soft text-xs">All items are above minimum level.</p>
            ) : (
              lowItems.map((i) => (
                <div key={i.id} className="flex gap-2 bg-red-50 rounded-xl px-3 py-2 mb-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                  <p className="text-red-600 text-xs">{i.name}: {i.quantity} {i.unit} left</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500">
        <LogOut size={16} />
      </button>
    </header>
  );
}