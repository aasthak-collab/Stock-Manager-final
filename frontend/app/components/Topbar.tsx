"use client";

import { useTranslation } from "react-i18next";

export default function Topbar() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  return (
    <header className="h-16 bg-sidebar border-b border-primary/30 flex items-center justify-between px-6">
      <p className="text-soft text-sm">{t("welcome")} 👋</p>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-xs border border-primary/50 text-soft px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
        >
          {i18n.language === "en" ? "EN → हि" : "हि → EN"}
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-beige text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}