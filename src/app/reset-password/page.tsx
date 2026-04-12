"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-soft px-6 text-center">
         <div>
            <h1 className="text-2xl font-bold text-red-500 mb-2">Liên kết không hợp lệ</h1>
            <p className="text-foreground/60 mb-6">Bạn cần một liên kết từ email khôi phục để sử dụng trang này.</p>
            <button onClick={() => router.push("/forgot-password")} className="bg-primary text-white px-6 py-3 rounded-xl font-bold">
               Yêu cầu liên kết mới
            </button>
         </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    formData.append("token", token);
    const res = await resetPassword(formData);

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/login?reset=true");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-soft px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-black/5"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold mb-2">Mật khẩu mới</h1>
          <p className="text-foreground/50">Vui lòng tạo một mật khẩu bảo mật mới cho tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-1">Mật khẩu mới</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-1">Xác nhận mật khẩu mới</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                minLength={6}
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-xl shadow-primary/20",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? "Đang xử lý..." : (
              <>Cập nhật mật khẩu <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-soft flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
