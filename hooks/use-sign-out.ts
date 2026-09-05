"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function useSignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/sign-in");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
}
