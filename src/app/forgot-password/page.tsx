"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await requestPasswordReset(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
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
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Quên mật khẩu?</h1>
          <p className="text-foreground/50">Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu của bạn an toàn.</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center py-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">Đã gửi liên kết</h3>
            <p className="text-sm text-foreground/60">Vui lòng kiểm tra hộp thư đến (và hộp thư rác) để lấy liên kết khôi phục.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground/70 ml-1">Email của bạn</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
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
              {isLoading ? "Đang gửi..." : (
                <>Gửi liên kết khôi phục <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
