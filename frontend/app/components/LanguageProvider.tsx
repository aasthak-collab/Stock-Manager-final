"use client";

import { useEffect } from "react";
import "../../i18n";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {}, []);
  return <>{children}</>;
}