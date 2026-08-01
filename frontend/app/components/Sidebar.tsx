"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  BookOpen,
  Users,
  BarChart2,
} from "lucide-react";

const navItems = [
  { key: "dashboard", href: "/", icon: LayoutDashboard },
  { key: "stock", href: "/stock", icon: Package },
  { key: "purchases", href: "/purchases", icon: ShoppingCart },
  { key: "sales", href: "/sales", icon: TrendingUp },
  { key: "ledger", href: "/ledger", icon: BookOpen },
  { key: "attendance", href: "/attendance", icon: Users },
  { key: "analysis", href: "/analysis", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar flex flex-col">
      {/* Logo */}
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

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map((item) => {
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

      {/* Bottom user */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div>
            <p className="text-white text-xs font-medium">Admin</p>
            <p className="text-white/40 text-xs">admin@omsai.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}