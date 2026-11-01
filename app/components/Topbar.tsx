"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LogOut, Bell, Menu, AlertTriangle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import api from "../../libraries/axios";

interface LowItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
}

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { i18n, t } = useTranslation();
  const { data: session } = useSession();
  const [lowItems, setLowItems] = useState<LowItem[]>([]);
  const [open, setOpen] = useState(false); // bell dropdown

  // Fetch stock and keep only items at or below minimum level
  const fetchLowStock = async () => {
    try {
      const res = await api.get("/api/stock");
      setLowItems(res.data.filter((i: LowItem) => i.quantity <= i.threshold));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Only call the API if a login token exists (avoids a 401 redirect)
    if (!localStorage.getItem("token")) return;
    fetchLowStock();
    const timer = setInterval(fetchLowStock, 60000); // refresh every minute
    return () => clearInterval(timer);
  }, []);

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
        {/* Hamburger: phones only */}
        <button onClick={onMenuClick} className="md:hidden mr-3 text-soft">
          <Menu size={22} />
        </button>
        {/* No user name shown anymore */}
        <p className="text-beige font-semibold text-sm">{t("welcome")} 👋</p>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggleLanguage}
          className="text-xs border border-gray-200 text-soft px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {i18n.language === "en" ? "EN → हि" : "हि → EN"}
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-soft hover:bg-gray-200 transition-colors"
          >
            <Bell size={16} />
            {/* Red count badge only when something is low */}
            {lowItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {lowItems.length}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 max-w-[85vw] bg-card border border-gray-200 rounded-2xl shadow-lg z-50 p-3">
              <p className="text-beige text-sm font-semibold mb-2">Low stock alerts</p>
              {lowItems.length === 0 ? (
                <p className="text-soft text-xs py-2">All items are above minimum level.</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {lowItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-2 bg-red-50 rounded-xl px-3 py-2">
                      <AlertTriangle size={14} className="text-red-500 mt-0.5" />
                      <div>
                        <p className="text-red-600 text-xs font-medium">{item.name}</p>
                        <p className="text-red-500 text-xs">
                          {item.quantity} {item.unit} left (min {item.threshold})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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