"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Heart, Star, Book as BookIcon, Loader2, Wallet, Tag, ShieldCheck } from "lucide-react";
import { Header as NavHeader } from "@/components/Header";
import { toggleCartItem, toggleWishlistItem, getUserData } from "@/lib/actions/user-actions";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCarted, setIsCarted] = useState(false);
  const [isWished, setIsWished] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      const { data, error } = await supabase
        .from("eb_books")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error && data) {
        setBook(data);
      }
      setIsLoading(false);
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    if (session?.user && id) {
      getUserData().then(res => {
        setIsCarted(res.cartIds.includes(id as string));
        setIsWished(res.wishlistIds.includes(id as string));
      });
    }
  }, [session, id]);

  const handleToggleCart = async () => {
    if (!session) {
      alert("Vui lòng đăng nhập để thực hiện");
      return;
    }
    const currentStatus = isCarted;
    setIsCarted(!currentStatus);
    const res = await toggleCartItem(id as string);
    if (res?.error) {
      setIsCarted(currentStatus);
      alert(res.error);
    } else {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const handleToggleWishlist = async () => {
    if (!session) {
      alert("Vui lòng đăng nhập để thực hiện");
      return;
    }
    const currentStatus = isWished;
    setIsWished(!currentStatus);
    const res = await toggleWishlistItem(id as string);
    if (res?.error) {
      setIsWished(currentStatus);
      alert(res.error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-soft pt-20">
        <NavHeader />
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-foreground/50 font-serif italic">Đang mở trang sách...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-soft pt-20">
        <NavHeader />
        <BookIcon className="w-16 h-16 text-foreground/10 mb-6" />
        <h2 className="text-2xl font-serif font-bold mb-4">Không tìm thấy cuốn sách này</h2>
        <Link href="/marketplace" className="text-primary font-bold hover:underline">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-background-soft">
      <NavHeader />
      
      <div className="max-w-6xl mx-auto px-6">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Side: Product Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-32"
          >
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 bg-white border border-white p-4">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <BookIcon className="w-20 h-20 text-primary/10" />
                  </div>
                )}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                   <div className={cn(
                    "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md",
                    book.condition === "Like New" ? "bg-green-500/90 text-white" : 
                    book.condition === "Vintage" ? "bg-amber-600/90 text-white" : "bg-blue-500/90 text-white"
                  )}>
                    {book.condition}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase">
                <Tag className="w-4 h-4" />
                {book.category || "Văn học"}
              </div>
              <h1 className="text-4xl lg:text-5xl font-serif font-black leading-tight text-slate-900">{book.title}</h1>
              <div className="flex items-center gap-6">
                <p className="text-lg font-medium text-foreground/60 italic">Bởi: {book.author}</p>
                <div className="flex items-center gap-1 text-accent">
                   <Star className="w-5 h-5 fill-current" />
                   <span className="font-black text-lg">4.8</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-wrap gap-8 items-center py-8 border-y border-black/5">
              <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest text-foreground/30">Giá mua thẳng</p>
                 <p className="text-4xl font-black text-primary">{book.price?.toLocaleString()}đ</p>
              </div>
              
              <div className="w-[1px] h-12 bg-black/5" />

              <div className="space-y-1">
                 <p className="text-xs font-black uppercase tracking-widest text-foreground/30 flex items-center gap-1">Giá Book Coin <ShieldCheck className="w-3 h-3" /></p>
                 <div className="flex items-center gap-2 text-slate-800">
                    <Wallet className="w-6 h-6 text-primary" />
                    <p className="text-3xl font-black">{book.book_coins || 0} <span className="text-sm">Xu</span></p>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">Mô tả tác phẩm</h3>
               <p className="text-lg leading-relaxed text-foreground/70 font-medium">
                 {book.description || "Cuốn sách này hiện chưa có mô tả chi tiết. Tuy nhiên, đây là một trong những tựa sách được cộng đồng Re-Book săn đón cực cao nhờ giá trị nội dung và độ hiếm của nó."}
               </p>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={handleToggleCart}
                className={cn(
                  "flex-1 py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl",
                  isCarted 
                    ? "bg-green-500 text-white shadow-green-200" 
                    : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                {isCarted ? "Đã trong giỏ hàng" : "Thêm vào giỏ"}
              </button>
              
              <button 
                onClick={handleToggleWishlist}
                className={cn(
                  "px-8 py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border-2",
                  isWished 
                    ? "bg-red-50 text-red-500 border-red-500" 
                    : "bg-white text-foreground/50 border-black/5 hover:bg-black/5"
                )}
              >
                <Heart className={cn("w-5 h-5", isWished && "fill-current")} />
              </button>
            </div>

            {/* More Info */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl shadow-black/5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Kiểm định bởi Re-Book</p>
                <p className="text-xs text-foreground/50">Cam kết sách thật, đúng mô tả và độ mới.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
