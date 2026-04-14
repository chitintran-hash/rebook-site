"use client";

import React, { useState } from "react";
import { CheckCircle, AlertTriangle, ShieldCheck, Mail, Loader2, Home } from "lucide-react";
import { checkSmtpHealth } from "@/lib/actions/auth";
import Link from "next/link";

export default function CheckSystemPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await checkSmtpHealth();
      setResult(res);
    } catch (err) {
      setResult({ error: "Lỗi thực thi server action: " + (err as any).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Kiểm Tra Hệ Thống</h1>
          <p className="text-slate-500">Công cụ chẩn đoán lỗi Email và Authentication cho Re-Book site</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-2xl">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900">Kiểm tra SMTP (Gmail)</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Nhấn nút bên dưới để hệ thống thử gửi một email chẩn đoán tới email của bạn.
                  Nếu thất bại, hệ thống sẽ chỉ ra chính xác lỗi nằm ở đâu (Sai mật khẩu APP, hay Google chặn).
                </p>
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Đang chẩn đoán...
                </>
              ) : (
                "Bắt đầu chẩn đoán"
              )}
            </button>

            {result && (
              <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="font-bold text-sm uppercase tracking-wider">Trạng thái kết nối</span>
                </div>

                {result.success ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-900 text-lg">SMTP Hoạt động tốt!</h4>
                      <p className="text-green-700 mt-1">Cấu hình EMAIL_USER và EMAIL_PASS trên Vercel của bạn hoàn toàn chính xác. Email đã được gửi đi thành công.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl space-y-4">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-red-900 text-lg">Phát hiện lỗi SMTP!</h4>
                        <p className="text-red-700 mt-1">Hệ thống không thể kết nối tới Google Mail. Chi tiết lỗi bên dưới:</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-900/10 p-4 rounded-xl font-mono text-xs text-red-800 break-all border border-red-200">
                      {result.error}
                    </div>

                    <div className="p-4 bg-white/50 rounded-xl text-sm text-red-900 space-y-2">
                       <p className="font-bold">👉 Khắc phục:</p>
                       <ul className="list-disc pl-5 space-y-1">
                         <li>Nếu thấy lỗi "Invalid Login": Bạn hãy tạo Mật khẩu ứng dụng 16 chữ cái mới từ tài khoản Google.</li>
                         <li>Đảm bảo đã lưu biến môi trường trên Vercel và thực hiện <strong>Redeploy</strong>.</li>
                       </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium">
            <Home className="w-4 h-4" /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
