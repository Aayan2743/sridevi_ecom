"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Sparkles,
  Lock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
  },
};

function passwordChecks(pw) {
  return {
    length: pw.length >= 8,
    letter: /[A-Za-z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

function strengthFromChecks(checks) {
  const n = Object.values(checks).filter(Boolean).length;
  if (n <= 1) return { n, label: "Weak", tone: "bg-red-500" };
  if (n === 2) return { n, label: "Fair", tone: "bg-amber-500" };
  if (n === 3) return { n, label: "Strong", tone: "bg-lime-500" };
  return { n, label: "Excellent", tone: "bg-emerald-600" };
}

const inputClass =
  "h-12 w-full rounded-2xl border border-sage-200/90 bg-white px-4 pr-12 text-sage-900 outline-none transition placeholder:text-sage-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-200/80";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const checks = useMemo(
    () => passwordChecks(form.newPassword),
    [form.newPassword],
  );
  const strength = useMemo(() => strengthFromChecks(checks), [checks]);
  const passwordsMatch =
    form.confirm.length > 0 && form.newPassword === form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/profile/change-password", {
        current_password: form.current,
        new_password: form.newPassword,
        confirm_new_password: form.confirm,
      });
      toast.success(res.data.message || "Password updated successfully");
      setForm({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const rules = [
    { key: "length", label: "At least 8 characters", ok: checks.length },
    { key: "letter", label: "Includes a letter", ok: checks.letter },
    { key: "number", label: "Includes a number", ok: checks.number },
    {
      key: "symbol",
      label: "Includes a symbol (recommended)",
      ok: checks.symbol,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-lg space-y-8"
    >
      <motion.header variants={item} className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-800">
          <Sparkles className="h-3.5 w-3.5 text-earth-600" aria-hidden />
          Security
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-sage-950 sm:text-4xl">
          Change password
        </h1>
        <p className="text-sm leading-relaxed text-sage-700/90">
          Use a unique passphrase you do not reuse elsewhere. We never display
          your password after you save it.
        </p>
      </motion.header>

      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl border border-sage-200/60 bg-gradient-to-br from-sage-900 via-sage-800 to-earth-950 px-5 py-6 text-white shadow-nature-lg sm:px-7 sm:py-8"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime-400/10 blur-3xl"
          aria-hidden
        />
        <div className="relative z-[1] flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Shield className="h-6 w-6 text-cream-100" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-sage-200/90">
              Protected session
            </p>
            <p className="mt-1 text-sm leading-relaxed text-sage-100/95">
              Changing your password signs you out of other devices on the next
              request. If you did not initiate this, contact support right away.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-sage-200/50 bg-white/95 p-6 shadow-nature-md backdrop-blur-sm sm:p-8"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-sage-800">
            <Lock className="h-4 w-4 text-sage-600" aria-hidden />
            Current password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              autoComplete="current-password"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              className={inputClass}
              placeholder="Enter current password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-sage-500 transition hover:bg-sage-100 hover:text-sage-800"
              aria-label={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-sage-800">
            <KeyRound className="h-4 w-4 text-sage-600" aria-hidden />
            New password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className={inputClass}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-sage-500 transition hover:bg-sage-100 hover:text-sage-800"
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {form.newPassword.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25 }}
              className="space-y-3 overflow-hidden rounded-2xl border border-sage-100 bg-sage-50/50 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-sage-600">
                  Strength
                </span>
                <span
                  className={`text-xs font-bold ${
                    strength.n >= 3
                      ? "text-emerald-800"
                      : strength.n === 2
                        ? "text-amber-800"
                        : "text-red-800"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-sage-200/90"
                    initial={false}
                    animate={{
                      scaleY: strength.n > i ? 1 : 0.85,
                      opacity: strength.n > i ? 1 : 0.45,
                    }}
                  >
                    <motion.div
                      className={`h-full rounded-full ${strength.tone}`}
                      initial={{ width: "0%" }}
                      animate={{
                        width: strength.n > i ? "100%" : "0%",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 26,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              <ul className="space-y-1.5">
                {rules.map((r) => (
                  <li
                    key={r.key}
                    className="flex items-center gap-2 text-xs font-medium"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                        r.ok
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-sage-200/60 text-sage-500"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={r.ok ? "text-sage-900" : "text-sage-600"}>
                      {r.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-sage-800">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={inputClass}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-sage-500 transition hover:bg-sage-100 hover:text-sage-800"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.confirm.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 text-xs font-semibold ${
                passwordsMatch ? "text-emerald-700" : "text-amber-800"
              }`}
            >
              {passwordsMatch ? (
                <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              )}
              {passwordsMatch
                ? "Passwords match"
                : "Does not match new password yet"}
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 text-sm font-semibold text-white shadow-nature-md transition hover:from-sage-900 hover:to-sage-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Updating…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden />
              Update password
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
