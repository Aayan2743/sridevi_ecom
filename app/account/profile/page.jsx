"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Camera, Lock, Save, Sparkles, User } from "lucide-react";

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

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.avatar) setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (avatarFile) formData.append("profile_image", avatarFile);

      const res = await api.post("/user-dashboard/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;
      updateUser({
        name: data.user.name,
        email: data.user.email,
        avatar: data.user.avatar,
      });
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const initials = (form.name || user.name || "U")
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-2xl space-y-8"
    >
      <motion.header variants={item} className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-sage-200/80 bg-sage-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sage-800">
          <Sparkles className="h-3.5 w-3.5 text-earth-600" aria-hidden />
          Profile
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-sage-950 sm:text-4xl">
          Edit profile
        </h1>
        <p className="text-sm leading-relaxed text-sage-700/90">
          Keep your details current so orders, invoices, and wellness tips reach
          the right place.
        </p>
      </motion.header>

      <motion.section
        variants={item}
        className="overflow-hidden rounded-3xl border border-sage-200/60 bg-gradient-to-br from-white via-cream-50/40 to-sage-50/30 p-6 shadow-nature-md sm:p-8"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage-400 to-sage-700 opacity-50 blur-lg" />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-nature-md sm:h-32 sm:w-32">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-600 to-sage-900 text-2xl font-bold text-white sm:text-3xl">
                  {initials}
                </div>
              )}
            </div>
            <label className="absolute bottom-1 right-1 flex cursor-pointer items-center gap-1 rounded-full bg-sage-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-sage-800">
              <Camera className="h-3.5 w-3.5" aria-hidden />
              Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </motion.div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-serif text-xl font-semibold text-sage-950">
              {form.name || "Your name"}
            </p>
            <p className="mt-1 text-sm text-sage-600">
              JPG or PNG, up to a few MB. Square photos look best in checkout
              and receipts.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-sage-200/50 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-sage-800">
            <User className="h-4 w-4 text-sage-600" aria-hidden />
            Full name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-12 w-full rounded-2xl border border-sage-200/90 bg-white px-4 text-sage-900 outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-200/80"
            placeholder="e.g. Priya Sharma"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-sage-800">
            Email address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-12 w-full rounded-2xl border border-sage-200/90 bg-white px-4 text-sage-900 outline-none transition focus:border-sage-500 focus:ring-2 focus:ring-sage-200/80"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-sage-800">
            <Lock className="h-4 w-4 text-sage-600" aria-hidden />
            Mobile number
          </label>
          <input
            type="tel"
            disabled
            value={form.phone}
            className="h-12 w-full cursor-not-allowed rounded-2xl border border-dashed border-sage-200 bg-sage-50/80 px-4 text-sage-600"
          />
          <p className="text-xs text-sage-600">
            Mobile is verified for OTP login. Contact support to change it.
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sage-800 to-sage-700 text-sm font-semibold text-white shadow-nature-md transition hover:from-sage-900 hover:to-sage-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px] sm:px-8"
        >
          <Save className="h-4 w-4" aria-hidden />
          {saving ? "Saving…" : "Save changes"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
