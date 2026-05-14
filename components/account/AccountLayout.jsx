"use client";

import { motion } from "framer-motion";
import AccountSidebar from "./AccountSidebar";
import { Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AccountLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-cream-50 via-sage-50/25 to-earth-50/80">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[520px] w-[520px] rounded-full bg-sage-200/25 blur-3xl animate-pulse-soft"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-earth-200/30 blur-3xl animate-pulse-soft"
        style={{ animationDelay: "1s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%234caf50\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-6 lg:px-8 lg:py-10">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full shrink-0 md:w-64 lg:w-72"
        >
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-sage-200/60 bg-white/70 px-4 py-3 shadow-nature backdrop-blur-md md:hidden">
            <Leaf className="h-5 w-5 text-sage-600" aria-hidden />
            <span className="font-serif text-lg font-semibold text-sage-900">
              Your wellness hub
            </span>
          </div>
          <AccountSidebar />
        </motion.aside>

        <motion.main
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative min-h-[60vh] flex-1 overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/85 p-6 shadow-nature-lg backdrop-blur-xl sm:p-8 md:rounded-3xl lg:p-10"
        >
          <div
            className="pointer-events-none absolute -right-16 top-24 hidden h-64 w-64 rounded-full bg-gradient-to-br from-sage-100/90 to-transparent blur-2xl lg:block"
            aria-hidden
          />
          <div className="relative z-[1]">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
