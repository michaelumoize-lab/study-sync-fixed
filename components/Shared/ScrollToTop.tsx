"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    // Scroll only when the actual path string changes
    if (lastPathname.current !== pathname) {
      window.scrollTo(0, 0);
      
      // If using a scrollable container:
      // document.getElementById("main-content-area")?.scrollTo(0, 0);
      
      lastPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}