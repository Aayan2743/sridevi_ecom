

// app/account/layout.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AccountLayout from "@/components/account/AccountLayout";

export default function AccountRootLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/"); // ⛔ block access to /account/*
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-cream-50 via-sage-50/30 to-earth-50 px-6">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-sage-200 border-t-sage-700" />
        <p className="font-serif text-lg text-sage-800">Opening your wellness hub…</p>
      </div>
    );
  }

  // 🚫 Not authenticated → wait for redirect
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Authenticated → render account UI
  return <AccountLayout>{children}</AccountLayout>;
}
