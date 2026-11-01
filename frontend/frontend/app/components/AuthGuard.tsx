"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const token = localStorage.getItem("token");
    const isLoggedIn = token || session;

    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, session, status]);

  return <>{children}</>;
}