"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  PenLine,
  Package,
  Heart,
  Share2,
  LayoutDashboard,
  Lock,
  LogOut,
  Leaf,
  ChevronRight,
} from "lucide-react";

const menu = [
  { label: "My Account", path: "/account", icon: User },
  { label: "Edit Profile", path: "/account/profile", icon: PenLine },
  { label: "My Orders", path: "/account/orders", icon: Package },
  { label: "My Wishlist", path: "/account/wishlist", icon: Heart },
  { label: "Become Affiliate", path: "/account/affiliate", icon: Share2 },
  {
    label: "Affiliate Products",
    path: "/account/affiliate/products",
    icon: Package,
  },
  {
    label: "Affiliate dashboard",
    path: "/account/affiliate-dashboard",
    icon: LayoutDashboard,
  },
  { label: "Change Password", path: "/account/change-password", icon: Lock },
];

function isNavActive(pathname, itemPath) {
  if (!pathname || !itemPath) return false;
  const p = pathname.replace(/\/$/, "") || "/";
  const t = itemPath.replace(/\/$/, "") || "/";
  if (p === t) return true;
  if (t === "/account") return p === "/account";
  if (t === "/account/affiliate") return false;
  return p.startsWith(`${t}/`);
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.28 } },
};

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside className="overflow-hidden rounded-3xl border border-sage-200/50 bg-white/80 shadow-nature-md backdrop-blur-xl">
      <div className="relative bg-gradient-to-br from-sage-800 via-sage-700 to-sage-900 px-5 py-6 text-white">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Leaf className="h-5 w-5 text-sage-100" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-sage-100/90">
              Account
            </p>
            <p className="font-serif text-lg font-semibold leading-tight">
              Nature &amp; you
            </p>
          </div>
        </div>
      </div>

      <nav className="p-3">
        <motion.ul
          className="space-y-1"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {menu.map((item) => {
            const active = isNavActive(pathname, item.path);
            const Icon = item.icon;

            return (
              <motion.li key={item.path} variants={rowVariants}>
                <button
                  type="button"
                  onClick={() => router.push(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition-all duration-200 ${
                    active
                      ? "bg-sage-100 text-sage-900 shadow-sm ring-1 ring-sage-200/70"
                      : "text-sage-800/90 hover:bg-sage-50/90 hover:text-sage-950"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? "bg-sage-200/55 text-sage-900 ring-1 ring-sage-300/50"
                        : "bg-sage-50 text-sage-600 ring-1 ring-sage-100/80 group-hover:bg-sage-100/80 group-hover:text-sage-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      active
                        ? "translate-x-0 text-sage-700"
                        : "text-sage-400 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                    }`}
                    aria-hidden
                  />
                </button>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="mt-4 border-t border-sage-100 pt-4"
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-700/90 transition-colors hover:bg-red-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-700">
              <LogOut className="h-4 w-4" aria-hidden />
            </span>
            Logout
          </button>
        </motion.div>
      </nav>
    </aside>
  );
}
