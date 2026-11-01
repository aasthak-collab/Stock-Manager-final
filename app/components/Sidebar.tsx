"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, ArrowDownToLine, TrendingUp, BookOpen,
  Users, BarChart2, Building2, ClipboardList, Settings, X,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard, adminOnly: false },
  { key: "stock", href: "/stock", icon: Package, adminOnly: false },
  { key: "purchases", href: "/purchases", icon: ArrowDownToLine, adminOnly: false },
  { key: "sales", href: "/sales", icon: TrendingUp, adminOnly: false },
  { key: "ledger", href: "/ledger", icon: BookOpen, adminOnly: false },
  { key: "attendance", href: "/attendance", icon: Users, adminOnly: false },
  { key: "analysis", href: "/analysis", icon: BarChart2, adminOnly: false },
  { key: "suppliers", href: "/suppliers", icon: Building2, adminOnly: false },
  { key: "audit", href: "/audit", icon: ClipboardList, adminOnly: true },
  { key: "settings", href: "/settings", icon: Settings, adminOnly: true },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") || "{}"));
  }, []);

  const items = navItems.filter((i) => !i.adminOnly || user.role === "admin");

  return (
    <>
      {/* Dark overlay: phones only, when the drawer is open */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Phones: slide-in drawer. md and up: always visible column */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-40 w-60 shrink-0 bg-sidebar flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <img src="/logo.png" alt="Om Sai" className="w-20 h-20 object-contain" />
          <button onClick={onClose} className="md:hidden text-white/70">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-primary text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0) || "U"}
          </div>
          <p className="text-white/50 text-xs capitalize">{user.role || "staff"}</p>
        </div>
      </aside>
    </>
  );
}