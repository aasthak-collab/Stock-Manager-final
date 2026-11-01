"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (allowedRoles.includes(user.role)) {
      setAllowed(true);
    } else {
      router.push("/");
    }
  }, []);

  if (!allowed) return null;
  return <>{children}</>;
}