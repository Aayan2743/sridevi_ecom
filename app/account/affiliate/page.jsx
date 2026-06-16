"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  TrendingUp,
  Calendar,
  LayoutDashboard,
  Shield,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  Clock,
  UserCheck,
  IdCard,
  CreditCard,
  Smartphone,
} from "lucide-react";
import api from "@/lib/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ──────────────── Application Modal ──────────────── */
function AffiliateApplicationModal({ open, onClose, onSuccess }) {
  const [aadhaarCard, setAadhaarCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setAadhaarCard(null);
      setPanCard(null);
      setUpiId("");
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const errs = {};

    if (!aadhaarCard) {
      errs.aadhaar_card = "Please upload Aadhaar card";
    }

    if (!panCard) {
      errs.pan_card = "Please upload PAN card";
    }

    if (!upiId.trim()) {
      errs.upi_id = "UPI ID is required";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(aadhaarCard);
    console.log(panCard);
    console.log(upiId);

    if (!validate()) return;

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("aadhaar_card", aadhaarCard);
      formData.append("pan_card", panCard);
      formData.append("upi_id", upiId);

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await api.post(
        "/user-dashboard/affiliate/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(res.data.message);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      }

      toast.error(
        error.response?.data?.message || error.message || "Failed to submit",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg rounded-3xl border border-sage-200 bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition hover:bg-sage-100 hover:text-sage-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-100 to-emerald-50 text-sage-800">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-sage-950">
                  Affiliate Application
                </h2>
                <p className="text-sm text-sage-600">
                  Fill in your details to join the partner program
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Aadhaar Upload */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-sage-800">
                  <IdCard className="h-4 w-4" />
                  Aadhaar Card
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setAadhaarCard(e.target.files[0]);

                    if (errors.aadhaar_card) {
                      setErrors((prev) => ({
                        ...prev,
                        aadhaar_card: "",
                      }));
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.aadhaar_card
                      ? "border-red-300 bg-red-50"
                      : "border-sage-200 bg-sage-50/50"
                  }`}
                />

                {aadhaarCard && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(aadhaarCard)}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    <div className="text-xs text-sage-600">
                      {aadhaarCard.name}
                    </div>
                  </div>
                )}

                {errors.aadhaar_card && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.aadhaar_card}
                  </p>
                )}
              </div>

              {/* PAN Upload */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-sage-800">
                  <CreditCard className="h-4 w-4" />
                  PAN Card
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setPanCard(e.target.files[0]);

                    if (errors.pan_card) {
                      setErrors((prev) => ({
                        ...prev,
                        pan_card: "",
                      }));
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.pan_card
                      ? "border-red-300 bg-red-50"
                      : "border-sage-200 bg-sage-50/50"
                  }`}
                />

                {panCard && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={URL.createObjectURL(panCard)}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    <div className="text-xs text-sage-600">{panCard.name}</div>
                  </div>
                )}

                {errors.pan_card && (
                  <p className="mt-1 text-xs text-red-600">{errors.pan_card}</p>
                )}
              </div>

              {/* UPI ID */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-sage-800">
                  <Smartphone className="h-4 w-4" />
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);

                    if (errors.upi_id) {
                      setErrors((prev) => ({
                        ...prev,
                        upi_id: "",
                      }));
                    }
                  }}
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.upi_id
                      ? "border-red-300 bg-red-50 text-red-900"
                      : "border-sage-200 bg-sage-50/50 text-sage-900 focus:border-sage-400 focus:bg-white"
                  }`}
                />

                {errors.upi_id && (
                  <p className="mt-1 text-xs text-red-600">{errors.upi_id}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 py-3.5 text-sm font-semibold text-white shadow-nature transition hover:from-sage-900 hover:to-sage-800 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-sage-500">
              Your details are encrypted and used only for verification &
              payouts.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────── Main Page ──────────────── */
export default function AffiliatePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAffiliate = async () => {
    try {
      setLoading(true);

      const res = await api.get("/user-dashboard/get-affiliates");

      setAffiliate(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setAffiliate(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load mock application from localStorage on mount
  useEffect(() => {
    fetchAffiliate();
  }, []);

  const affiliateStatus = affiliate?.status || "none";

  const handleApply = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleApplySuccess = useCallback(() => {
    fetchAffiliate();
  }, []);

  const handleCheckStatus = async () => {
    await fetchAffiliate();

    toast.success("Status updated");
  };

  return (
    <>
      <AffiliateApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleApplySuccess}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="min-h-screen w-full"
      >
        {/* Hero Section - Full Width */}
        <motion.section
          variants={item}
          className="relative overflow-hidden bg-gradient-to-br from-sage-950 via-sage-800 to-earth-950 px-6 py-14 text-white sm:px-12 sm:py-20"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L40 80M0 40L80 40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
            }}
            aria-hidden
          />

          <div className="relative z-[1] mx-auto max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cream-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Partner program
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Become an affiliate
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-sage-100/95 sm:text-lg">
              Join the Sridevi Herbal partner network: earn on every successful
              referral, enjoy monthly payouts, and share products you truly
              stand behind.
            </p>
          </div>

          <div className="relative z-[1] mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: "Commission on referrals",
                body: "Earn when new customers purchase through your tracked links.",
              },
              {
                icon: Calendar,
                title: "Monthly payouts",
                body: "Reliable settlement rhythm so your earnings stay predictable.",
              },
              {
                icon: LayoutDashboard,
                title: "Partner dashboard",
                body: "Track status, links, and next steps—more analytics coming soon.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
              >
                <b.icon className="mb-3 h-6 w-6 text-lime-200" aria-hidden />
                <p className="font-semibold text-cream-50">{b.title}</p>
                <p className="mt-1 text-sm text-sage-100/85">{b.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
          {/* Status Card */}
          <motion.div variants={item}>
            <div className="rounded-3xl border border-sage-200/70 bg-gradient-to-br from-white via-cream-50/40 to-sage-50/30 p-8 shadow-nature-md">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    affiliateStatus === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : affiliateStatus === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-sage-100 text-sage-700"
                  }`}
                >
                  {affiliateStatus === "active" ? (
                    <CheckCircle2 className="h-7 w-7" />
                  ) : affiliateStatus === "pending" ? (
                    <Clock className="h-7 w-7" />
                  ) : (
                    <Shield className="h-7 w-7" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-sage-600">
                    Affiliate Status
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                        affiliateStatus === "active"
                          ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200"
                          : affiliateStatus === "pending"
                            ? "bg-amber-100 text-amber-950 ring-1 ring-amber-200/80"
                            : "bg-sage-200 text-sage-800 ring-1 ring-sage-300"
                      }`}
                    >
                      {affiliateStatus === "active"
                        ? "✅ Approved"
                        : affiliateStatus === "pending"
                          ? "⏳ Pending Review"
                          : affiliateStatus === "rejected"
                            ? "❌ Rejected"
                            : "Not Registered"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-sage-700/90">
                    {affiliateStatus === "active"
                      ? "Congratulations! Your affiliate account is active. You can now start sharing your referral links and earning commissions."
                      : affiliateStatus === "pending"
                        ? "Your application has been submitted and is under review. We'll notify you once it's approved. You can check the status anytime below."
                        : "Apply to become an affiliate partner and start earning commissions on every successful referral."}
                  </p>
                  {affiliate?.status === "rejected" && affiliate?.remarks && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="font-semibold text-red-700">
                        Rejection Reason
                      </p>

                      <p className="mt-1 text-sm text-red-600">
                        {affiliate.remarks}
                      </p>
                    </div>
                  )}
                  /* ADD REFERRAL LINK HERE 👇 */
                  {affiliateStatus === "active" && (
                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase text-emerald-700">
                        Your Referral Link
                      </p>

                      <div className="mt-2 flex gap-2">
                        <input
                          readOnly
                          value={`${window.location.origin}?ref=${affiliate.code}`}
                          className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm"
                        />

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}?ref=${affiliate.code}`,
                            );

                            toast.success("Link copied");
                          }}
                          className="rounded-lg bg-sage-800 px-4 py-2 text-white"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="mt-6 flex flex-wrap gap-3">
                {["none", "rejected"].includes(affiliateStatus) && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 px-6 py-3 text-sm font-semibold text-white"
                  >
                    <UserCheck className="h-4 w-4" />
                    {affiliateStatus === "rejected"
                      ? "Reapply"
                      : "Apply for Affiliate"}
                  </button>
                )}

                {affiliateStatus === "pending" && (
                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={checkingStatus}
                    className="inline-flex items-center gap-2 rounded-2xl border border-sage-200 bg-white px-6 py-3 text-sm font-semibold text-sage-800 shadow-sm transition hover:bg-sage-50 disabled:opacity-60"
                  >
                    {checkingStatus ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking…
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Check Approval Status
                      </>
                    )}
                  </button>
                )}

                {affiliateStatus === "active" && (
                  <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Your account is active
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info Footer */}
          <motion.footer
            variants={item}
            className="rounded-2xl border border-sage-200/60 bg-sage-50/40 px-5 py-4 text-xs text-sage-700"
          >
            <p>
              Commission tiers and dashboard analytics will be available after
              partner onboarding is complete.
            </p>
          </motion.footer>
        </div>
      </motion.div>
    </>
  );
}
