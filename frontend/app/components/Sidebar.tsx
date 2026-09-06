"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  BookOpen,
  Users,
  BarChart2,
  Building2,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard, adminOnly: false },
  { key: "stock", href: "/stock", icon: Package, adminOnly: false },
  { key: "purchases", href: "/purchases", icon: ShoppingCart, adminOnly: false },
  { key: "sales", href: "/sales", icon: TrendingUp, adminOnly: false },
  { key: "ledger", href: "/ledger", icon: BookOpen, adminOnly: false },
  { key: "attendance", href: "/attendance", icon: Users, adminOnly: false },
  { key: "analysis", href: "/analysis", icon: BarChart2, adminOnly: false },
  { key: "suppliers", href: "/suppliers", icon: Building2, adminOnly: false },
  { key: "audit", href: "/audit", icon: ClipboardList, adminOnly: true },
  { key: "settings", href: "/settings", icon: Settings, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("A");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(user.role === "admin");
    setUserName(user.name?.charAt(0) || "A");
  }, []);

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">OS</span>
          </div>
          <div>
            <h1 className="text-white text-sm font-bold">{t("appName")}</h1>
            <p className="text-white/50 text-xs">{t("appSubtitle")}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
                ${active
                  ? "bg-primary text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon size={18} />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {userName}
          </div>
          <div>
            <p className="text-white text-xs font-medium">
              {JSON.parse(localStorage?.getItem("user") || "{}").name || "User"}
            </p>
            <p className="text-white/40 text-xs">
              {JSON.parse(localStorage?.getItem("user") || "{}").role || "staff"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}