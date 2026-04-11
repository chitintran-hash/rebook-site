"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Inbox, Gift, MessageSquare, Ghost, MoreVertical, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const fetchNotifications = async () => {
        const { data } = await supabase
          .from("eb_notifications")
          .select("*")
          .eq("user_id", (session.user as any).id)
          .order("created_at", { ascending: false });
        
        if (data) setNotifications(data);
        setIsLoading(false);
      };
      fetchNotifications();
    }
  }, [session]);

  const mockAlerts = [
    { id: 1, type: 'GIFT', is_anonymous: true, message: 'Bạn vừa nhận được một cuốn sách ẩn danh tặng cho bạn!', date: 'Hôm nay, 08:30' },
    { id: 2, type: 'EXCHANGE', is_anonymous: false, message: 'Người dùng "An Bình" muốn trao đổi cuốn "Sapiens" của bạn.', date: 'Hôm qua, 18:20' },
    { id: 3, type: 'SYSTEM', is_anonymous: false, message: 'Chào mừng bạn đến với cộng đồng Re-Book!', date: '3 ngày trước' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center">
            <Inbox className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-black tracking-tight">Hộp thư bí mật</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Tin nhắn và Thông báo của bạn</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockAlerts.map((alert, idx) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-black/5 transition-all hover:scale-[1.02] cursor-pointer active:scale-[0.98]",
                alert.id === 1 && "border-primary/20 bg-primary/[0.02]"
              )}
            >
              <div className="flex items-start gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                  alert.type === 'GIFT' ? "bg-accent text-white" : 
                  alert.type === 'EXCHANGE' ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {alert.is_anonymous ? <Ghost className="w-6 h-6" /> : 
                   alert.type === 'GIFT' ? <Gift className="w-6 h-6" /> : 
                   alert.type === 'EXCHANGE' ? <MessageSquare className="w-6 h-6" /> : <Inbox className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">
                      {alert.type === 'GIFT' ? 'Quà tặng' : alert.type === 'EXCHANGE' ? 'Trao đổi' : 'Hệ thống'}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-xs font-bold text-slate-400">{alert.date}</span>
                  </div>
                  <p className={cn(
                    "text-lg leading-relaxed font-bold",
                    alert.id === 1 ? "text-slate-800" : "text-slate-600"
                  )}>
                    {alert.message}
                  </p>
                </div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <button className="text-slate-300 hover:text-primary transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {alert.id === 1 && (
                  <div className="absolute bottom-6 right-6">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {mockAlerts.length === 0 && !isLoading && (
            <div className="py-20 text-center">
              <Ghost className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <p className="text-xl font-serif italic text-slate-400">Hộp thư của bạn đang trống...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
