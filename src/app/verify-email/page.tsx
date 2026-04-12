"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailToken } from "@/lib/actions/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Liên kết xác thực không hợp lệ.");
      return;
    }

    verifyEmailToken(token).then((res) => {
      if (res.error) {
        setStatus("error");
        setMessage(res.error);
      } else {
        setStatus("success");
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      }
    });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center border border-black/5"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-2">Đang xác thực...</h2>
            <p className="text-foreground/60">Vui lòng đợi trong giây lát.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Xác thực thành công!</h2>
            <p className="text-foreground/60">Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center text-red-500">
            <XCircle className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Xác thực thất bại</h2>
            <p className="text-foreground/60">{message}</p>
            <button 
              onClick={() => router.push("/login")}
              className="mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-soft flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
