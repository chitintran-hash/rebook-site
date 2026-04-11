"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, History, CreditCard, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function WalletPage() {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const fetchWallet = async () => {
        const { data, error } = await supabase
          .from("eb_wallets")
          .select("*")
          .eq("user_id", (session.user as any).id)
          .single();
        
        if (data) setWallet(data);
        setIsLoading(false);
      };
      fetchWallet();
    }
  }, [session]);

  const mockTransactions = [
    { id: 1, type: 'in', amount: '500,000đ', title: 'Nạp tiền vào ví', date: '10:30, 02/04/2026' },
    { id: 2, type: 'out', amount: '89,000đ', title: 'Mua sách: Nhà Giả Kim', date: '15:45, 01/04/2026' },
    { id: 3, type: 'coin', amount: '+10 Coins', title: 'Thưởng trao đổi sách', date: '09:00, 01/04/2026' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Cash Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Wallet className="w-6 h-6" />
                </div>
                <CreditCard className="w-6 h-6 opacity-40" />
              </div>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-1">Số dư tiền mặt</p>
              <h2 className="text-4xl font-black mb-10">
                {wallet ? Number(wallet.cash_balance).toLocaleString() : "0"}đ
              </h2>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-primary py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                  Nạp tiền
                </button>
                <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-md">
                  Rút tiền
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          </motion.div>

          {/* Coins Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-accent rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-accent/20"
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <Coins className="w-6 h-6" />
                </div>
              </div>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest mb-1">Book Coins</p>
              <h2 className="text-4xl font-black mb-10">
                {wallet ? wallet.book_coins : "0"} <span className="text-xl font-medium opacity-60 ml-1">Coins</span>
              </h2>
              <div className="flex gap-3">
                <button className="w-full bg-white text-accent py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors">
                  Đổi quà tặng
                </button>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          </motion.div>
        </div>

        {/* Transactions Section */}
        <section className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-black/5 border border-black/5">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-bold">Lịch sử giao dịch</h3>
             </div>
             <button className="text-sm font-bold text-primary hover:underline">Xem tất cả</button>
          </div>

          <div className="space-y-6">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-black/5 rounded-2xl hover:bg-black/[0.08] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    tx.type === 'in' ? "bg-green-100 text-green-600" : 
                    tx.type === 'out' ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                  )}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : 
                     tx.type === 'out' ? <ArrowUpRight className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{tx.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "font-black text-lg",
                    tx.type === 'in' ? "text-green-600" : 
                    tx.type === 'out' ? "text-red-500" : "text-primary"
                  )}>
                    {tx.type === 'in' ? "+" : tx.type === 'out' ? "-" : ""}{tx.amount}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
