"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/api";
import { useRouter } from "next/navigation";

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <Button variant="outline" type="button" onClick={handleLogout}>
      Logout
    </Button>
  );
}
