"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

/**
 * RoleSetter — reads `?role=` from the URL after OAuth redirect
 * and calls /api/user/set-role to assign the role in the DB.
 * Rendered inside dashboard layouts.
 */
export function RoleSetter() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const calledRef = useRef(false);

  useEffect(() => {
    const role = searchParams.get("role");
    const email = session?.user?.email;

    if (!role || !email || calledRef.current) return;
    calledRef.current = true;

    fetch("/api/user/set-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    })
      .then((res) => {
        if (res.ok) {
          // Remove ?role= from URL without reload
          const url = new URL(window.location.href);
          url.searchParams.delete("role");
          window.history.replaceState({}, "", url.pathname);
        }
      })
      .catch(console.error);
  }, [searchParams, session]);

  return null;
}
