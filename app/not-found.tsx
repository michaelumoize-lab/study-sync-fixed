"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-background px-6 overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Floating Icon */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="p-8 bg-card rounded-3xl shadow-2xl border border-border relative z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20" />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              d="M12 8v4l3 2"
            />
          </svg>
        </motion.div>
        {/* Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 -z-10" />
      </motion.div>

      <div className="max-w-md text-center">
        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-black text-primary mb-4 tracking-tighter"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
          <p className="text-muted-foreground mb-10 leading-relaxed font-medium">
            We can&apos;t find the page you&apos;re looking for. <br /> It might have been moved, or the link might be broken.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 hover:brightness-105 transition-all active:scale-95"
          >
            Return to HomePage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-10 py-4 bg-secondary text-secondary-foreground font-bold rounded-2xl border border-border hover:bg-accent hover:text-accent-foreground transition-all active:scale-95"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    </main>
  );
}