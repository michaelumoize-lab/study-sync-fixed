"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function useRedirectToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("redirected") === "true") {
      toast.error("You must be logged in to access that page.");
    }
  }, [searchParams]);
}