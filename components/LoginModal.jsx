



"use client";

import React, { useState, useEffect } from "react";
import { X, Leaf, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import loginHeroB64 from "@/data/login-hero.b64";

const envHeroB64 =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_LOGIN_HERO_B64
    ? String(process.env.NEXT_PUBLIC_LOGIN_HERO_B64).trim()
    : "";
const bundledHeroB64 = String(loginHeroB64).trim();
const loginSideDataUrl = `data:image/webp;base64,${
  envHeroB64 || bundledHeroB64
}`;

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const [mode, setMode] = useState("otp"); // otp | password | register
  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const handleClose = () => {
    onClose();
    setMode("otp");
    setStep(1);
    setPhone("");
    setOtp("");
    setPassword("");
    setName("");
    setEmail("");
    setLoading(false);
    setTimer(0);
  };

  // Timer countdown effect
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && isOpen && mode === "otp") {
      setTimeout(() => {
        const otpInput = document.querySelector('input[placeholder="Enter OTP"]');
        if (otpInput) {
          otpInput.focus();
        }
      }, 100);
    }
  }, [step, isOpen, mode]);

  if (!isOpen) return null;

  /* ================= SEND OTP ================= */

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      toast.error("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/send-otp", {
        identifier: phone, // ✅ Send without country code (backend handles it)
      });

      console.log("OTP Response:", res.data);

      // ✅ Check for 'status' instead of 'success'
      if (!res?.data?.status) {
        throw new Error(res?.data?.message || "Failed to send OTP");
      }

      toast.success(res.data.message || "OTP sent successfully! 📱");
      setStep(2); // ✅ Move to OTP verification step
      setTimer(30);
    } catch (err) {
      console.error("OTP Error:", err);
      toast.error(
        err?.response?.data?.message || err.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/send-otp", {
        identifier: phone, // ✅ Send without country code
      });

      // ✅ Check for 'status' instead of 'success'
      if (!res?.data?.status) {
        throw new Error(res?.data?.message || "Failed to resend OTP");
      }

      toast.success(res.data.message || "OTP resent successfully! 📱");
      setTimer(30);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/verify-login-otp", {
        identifier: phone, // ✅ Send without country code
        otp,
      });

      console.log("Verify Response:", res.data);

      // ✅ Check for 'status' and 'token'
      if (!res?.data?.status || !res?.data?.token) {
        throw new Error(res?.data?.message || "OTP verification failed");
      }

      login(res.data.token, res.data.user);
      toast.success(res.data.message || "Login successful! 🎉");
      handleClose();
    } catch (err) {
      console.error("Verify Error:", err);
      toast.error(
        err?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= PASSWORD LOGIN ================= */

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error("Enter valid credentials");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/user-login", {
        login: phone, // mobile OR email
        password,
      });

      if (!res?.data?.token) {
        throw new Error("Invalid credentials");
      }

      login(res.data.token, res.data.user);
      toast.success("Login successful! 🎉");
      handleClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || phone.length !== 10 || password.length < 6) {
      toast.error("Fill all fields correctly (Password min 6 characters)");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/user-register", {
        name,
        email: email || null,
        phone,
        password,
      });

      if (!res?.data?.token) {
        throw new Error("Registration failed");
      }

      login(res.data.token, res.data.user);
      toast.success("Account created successfully! 🎉");
      handleClose();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || 
                       err?.response?.data?.errors || 
                       "Registration failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "otp"
      ? step === 1
        ? "Welcome back"
        : "Verify your OTP"
      : mode === "password"
        ? "Sign in"
        : "Create your account";

  const subtitle =
    mode === "otp" && step === 1
      ? "Natural wellness, one tap away. Enter your mobile to receive a code."
      : mode === "otp" && step === 2
        ? `We sent a 6-digit code to ${phone ? `+91 ${phone}` : "your number"}.`
        : mode === "password"
          ? "Use your mobile or email and password to continue."
          : "Join us for curated herbal care and member-only offers.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-sage-950/55 backdrop-blur-md transition-opacity"
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative z-10 flex w-full max-w-[min(100%,920px)] max-h-[min(92vh,720px)] flex-col overflow-hidden rounded-[1.75rem] bg-cream-50 shadow-nature-lg ring-1 ring-sage-200/70 animate-scale-in md:flex-row"
      >
        {/* Herbal visual — short banner on mobile, tall side panel on md+ */}
        <div className="relative h-36 w-full shrink-0 overflow-hidden md:h-auto md:w-[min(42%,380px)] md:max-w-[380px] md:self-stretch">
          {/* Side art: WebP base64 in data/login-hero.b64, or NEXT_PUBLIC_LOGIN_HERO_B64 (base64 only). */}
          <img
            src={loginSideDataUrl}
            alt="Herbal wellness — natural ingredients"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
            decoding="async"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-sage-950/88 to-sage-800/35 md:bg-gradient-to-t md:from-sage-950/92 md:via-sage-800/35 md:to-sage-600/20"
            aria-hidden
          />
          <div
            className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)] md:block"
            aria-hidden
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-white md:hidden">
            <Leaf className="h-5 w-5 text-sage-200" aria-hidden />
            <span className="font-serif text-lg font-semibold">Herbal wellness</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 hidden p-8 text-white md:block">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-cream-100 backdrop-blur-sm">
              <Leaf className="h-3.5 w-3.5 text-sage-200" aria-hidden />
              Pure & herbal
            </div>
            <p className="font-serif text-2xl font-semibold leading-snug text-cream-50 sm:text-3xl">
              Nature-crafted care for you and your home.
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-sage-100/95">
              <Sparkles className="h-4 w-4 shrink-0 text-earth-200" aria-hidden />
              Trusted ingredients, mindful rituals.
            </p>
          </div>
        </div>

        {/* Form column */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-br from-cream-50 via-earth-50/40 to-sage-50/50 px-5 py-7 sm:px-8 sm:py-9">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 rounded-full border border-sage-200/80 bg-white/90 p-2 text-sage-700 shadow-sm backdrop-blur-sm transition hover:bg-sage-50 hover:text-sage-900"
            aria-label="Close login"
          >
            <X className="h-5 w-5" />
          </button>

          <header className="mb-6 pr-10 text-left">
            <h2
              id="login-modal-title"
              className="font-serif text-2xl font-bold tracking-tight text-sage-900 sm:text-3xl"
            >
              {title}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-sage-700/90">
              {subtitle}
            </p>
          </header>

        {/* OTP STEP 1 */}
        {mode === "otp" && step === 1 && (
          <>
            <form onSubmit={handleSendOtp}>
              <Input
                placeholder="Mobile number"
                value={phone}
                setValue={setPhone}
                type="tel"
                allowEmail={false}
              />
              <PrimaryButton loading={loading} text="Send OTP" />
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                onClick={() => setMode("password")}
                className="font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-950"
              >
                Login with password
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-950"
              >
                Create new account
              </button>
            </div>
          </>
        )}

        {/* OTP STEP 2 */}
        {mode === "otp" && step === 2 && (
          <>
            <form onSubmit={handleVerifyOtp}>
              <Input
                placeholder="Enter OTP"
                value={otp}
                setValue={setOtp}
              />
              <PrimaryButton loading={loading} text="Verify & Login" />
            </form>

            <div className="mt-6 flex flex-col gap-2 text-center text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-950"
              >
                Change mobile number
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timer > 0}
                className={`font-semibold ${
                  timer > 0
                    ? "cursor-not-allowed text-sage-400"
                    : "text-sage-800 underline decoration-sage-300 underline-offset-4 hover:text-sage-950"
                }`}
              >
                {timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>
            </div>
          </>
        )}

        {/* PASSWORD LOGIN */}
        {mode === "password" && (
          <>
            <form onSubmit={handlePasswordLogin}>
              <Input
                placeholder="Mobile number or Email"
                value={phone}
                setValue={setPhone}
                allowEmail={true}
              />
              <Input
                placeholder="Password"
                value={password}
                setValue={setPassword}
                type="password"
              />
              <PrimaryButton loading={loading} text="Sign In" />
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setMode("otp")}
                className="font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-950"
              >
                Login with OTP
              </button>
            </div>
          </>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <form onSubmit={handleRegister}>
              <Input placeholder="Name" value={name} setValue={setName} />
              <Input
                placeholder="Email (optional)"
                value={email}
                setValue={setEmail}
              />
              <Input
                placeholder="Mobile number"
                value={phone}
                setValue={setPhone}
                type="tel"
                allowEmail={false}
              />
              <Input
                placeholder="Password"
                value={password}
                setValue={setPassword}
                type="password"
              />
              <PrimaryButton loading={loading} text="Create Account" />
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={() => setMode("password")}
                className="font-semibold text-sage-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-950"
              >
                Already have an account? Login
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const PrimaryButton = ({ text, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 py-3.5 text-[15px] font-semibold text-white shadow-nature-md transition hover:from-sage-900 hover:to-sage-800 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading ? "Please wait…" : text}
  </button>
);

const Input = ({
  placeholder,
  value,
  setValue,
  type = "text",
  allowEmail = false,
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) =>
      setValue(
        type === "tel" && !allowEmail
          ? e.target.value.replace(/\D/g, "").slice(0, 10)
          : e.target.value
      )
    }
    placeholder={placeholder}
    className="mt-4 w-full rounded-2xl border border-sage-200/90 bg-white/90 px-5 py-3.5 text-sage-900 shadow-sm outline-none transition placeholder:text-sage-400 focus:border-sage-500 focus:ring-2 focus:ring-sage-200/80"
  />
);
