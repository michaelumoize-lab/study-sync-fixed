"use client";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  const handleLogout = async () => {

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-5 py-3 w-full text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
    >
      <LogOut className="w-4 h-4" /> Logout
    </button>
  );
}