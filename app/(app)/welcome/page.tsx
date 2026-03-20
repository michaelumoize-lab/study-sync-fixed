"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export const dynamic = "force-dynamic";

export default function WelcomePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  const name = session?.user?.name?.split(" ")[0] ?? "Scholar";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
      >
        {/* Brand glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background:
              "color-mix(in srgb, var(--color-primary) 8%, transparent)",
          }}
        />

        {/* Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 100,
            delay: 0.2,
          }}
          className="relative bg-primary p-5 rounded-[2rem] mb-10 shadow-lg"
        >
          <Sparkles className="w-12 h-12 text-primary-foreground" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-[2rem] border-2 border-primary"
          />
        </motion.div>

        {/* Text */}
        <div className="text-center z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-4"
          >
            Initializing Workspace
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.5,
            }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-foreground"
          >
            Hey, <span className="text-primary">{name}</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
            className="h-1.5 bg-primary mx-auto mt-8 rounded-full"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
