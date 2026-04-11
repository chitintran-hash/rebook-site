"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, Search, ShoppingBag, User, LogOut, LayoutDashboard, Wallet, Inbox, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link href="/" className="flex items-center gap-2 group">
        <BookOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
        <span className="text-2xl font-serif font-bold tracking-tight">Re-Book</span>
      </Link>
      
      <div className="hidden md:flex gap-8 font-bold text-sm tracking-wide">
        <Link href="/" className="hover:text-primary transition-colors uppercase">Trang chủ</Link>
        <Link href="/marketplace" className="hover:text-primary transition-colors uppercase">Khám phá sách</Link>
        <Link href="#" className="hover:text-primary transition-colors uppercase">Thể loại</Link>
        {session?.user && (
          <Link href="/admin/books/new" className="text-primary hover:scale-105 transition-all flex items-center gap-1 uppercase font-black">
            <Plus className="w-4 h-4" /> Đăng sách
          </Link>
        )}
        {session?.user && (session.user as any).role === "ADMIN" && (
          <Link href="/admin" className="text-accent hover:text-primary transition-colors flex items-center gap-1 uppercase">
            <LayoutDashboard className="w-4 h-4" /> Quản trị
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden sm:block">
          <Search className="w-5 h-5" />
        </button>
        
        {session ? (
          <div className="flex items-center gap-2 pl-4 border-l border-black/5">
             <button className="p-2 hover:bg-black/5 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">3</span>
             </button>
             <div className="relative group">
                <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <User className="w-5 h-5 text-primary" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white glass rounded-2xl shadow-xl border border-black/5 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100">
                  <div className="px-4 py-2 border-b border-black/5 mb-2">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{(session.user as any).role}</p>
                    <p className="text-sm font-bold truncate">{session.user?.name}</p>
                  </div>
                  <Link 
                    href="/wallet" 
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-black/5 rounded-xl transition-colors mb-1"
                  >
                    <Wallet className="w-4 h-4 text-primary" /> Ví Re-Book
                  </Link>
                  <Link 
                    href="/inbox" 
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-black/5 rounded-xl transition-colors mb-1"
                  >
                    <Inbox className="w-4 h-4 text-primary" /> Hộp thư bí mật
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
             </div>
          </div>
        ) : (
          !isLoading && (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors hidden sm:block"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Đăng ký
              </Link>
            </div>
          )
        )}
      </div>
    </nav>
  );
};
