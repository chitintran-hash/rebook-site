"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, BookOpen, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không đúng.");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-soft px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-black/5"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-center">Chào mừng trở lại</h1>
          <p className="text-foreground/50 text-center mt-2">Đăng nhập vào tài khoản EliteBooks của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground/70 ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-foreground/70">Mật khẩu</label>
              <a href="#" className="text-xs font-bold text-primary hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              <>
                Đăng nhập <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-black/5 text-center">
          <p className="text-sm text-foreground/50">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">Tạo mới ngay</Link>
          </p>
        </div>
      </motion.div>

      {/* Demo Credentials Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-6 glass rounded-3xl max-w-sm text-xs text-foreground/60 space-y-2 border border-black/5"
      >
        <p className="font-bold text-foreground">Tài khoản trải nghiệm:</p>
        <div className="flex justify-between">
          <span>Admin: admin@elitebooks.com</span>
          <span className="font-mono">admin123</span>
        </div>
        <div className="flex justify-between">
          <span>User: user@elitebooks.com</span>
          <span className="font-mono">user123</span>
        </div>
      </motion.div>
    </div>
  );
}
