"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Heart, ShoppingBag, Book, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2000&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("eb_books")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: false });
      
      if (data) setBooks(data);
      setIsLoading(false);
    };
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-12 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="px-6 py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-8xl font-serif font-bold leading-tight mb-8">
              Khai mở <br />
              <span className="text-primary italic">Tri thức</span> mới
            </h1>
            <p className="text-xl text-foreground/60 mb-12 max-w-lg leading-relaxed">
              Khám phá bộ sưu tập sách được tuyển chọn kỹ lưỡng, từ văn học kinh điển đến công nghệ hiện đại. 
              Trải nghiệm đọc sách đẳng cấp trong lòng bàn tay.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                href="/marketplace"
                className="bg-primary text-white px-10 py-5 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-2xl shadow-primary/30"
              >
                Khám phá ngay <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/marketplace"
                className="px-10 py-5 rounded-full font-bold border-2 border-black/5 hover:bg-black/5 transition-colors"
              >
                Xem bộ sưu tập
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-primary/5 rounded-[4rem] flex items-center justify-center p-12">
               <div className="w-full h-full glass rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIdx}
                      src={heroImages[currentImageIdx]} 
                      alt="Featured Library"
                      className="w-full h-full object-cover absolute inset-0"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    />
                  </AnimatePresence>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Slider */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-3">Sách vừa cập bến</h2>
              <p className="text-foreground/50">Khám phá những tựa sách mới nhất tại Re-Book</p>
            </div>
            <Link href="/marketplace" className="text-primary font-bold hover:underline flex items-center gap-1 text-sm">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="min-w-[280px] aspect-[3/4] bg-black/5 rounded-[2rem] animate-pulse flex items-center justify-center">
                   <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                </div>
              ))
            ) : (
              books.length > 0 ? books.map((book, idx) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="min-w-[280px] w-[280px] shrink-0 snap-start group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 mb-6">
                    {book.image_url ? (
                      <img 
                        src={book.image_url} 
                        alt={book.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                         <Book className="w-12 h-12 text-primary/20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold truncate">{book.title}</h3>
                    <p className="text-sm text-foreground/50">{book.author}</p>
                    <p className="text-lg font-black text-primary pt-2">{Number(book.price).toLocaleString()}đ</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-foreground/50 italic py-10 w-full text-center">Chưa có cuốn sách nào đăng bán.</p>
              )
            )}
          </div>
        </div>
      </section>

      {/* Hot Exchanges Slider */}
      <section className="px-6 py-16 bg-background-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-3">Góc trao đổi hot trong ngày</h2>
              <p className="text-foreground/50">Cộng đồng đang trao đổi gì hôm nay?</p>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {books.length > 0 ? books.slice(0, 5).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="min-w-[320px] snap-start bg-white p-6 rounded-[2.5rem] shadow-xl shadow-black/5 flex gap-4 items-center group cursor-pointer hover:bg-primary hover:text-white transition-all transform active:scale-95"
              >
                <div className="w-20 h-24 bg-black/5 rounded-2xl overflow-hidden shrink-0 group-hover:bg-white/20 flex items-center justify-center">
                   {item.image_url ? (
                     <img 
                       src={item.image_url} 
                       alt={item.title}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <Book className="w-8 h-8 text-black/10 group-hover:text-white/30" />
                   )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-white/80 mb-1">Trao đổi</p>
                  <h4 className="font-serif font-bold text-lg mb-1 truncate">{item.title}</h4>
                  <p className="text-xs text-foreground/50 group-hover:text-white/60 truncate">Bởi: {item.author}</p>
                </div>
              </motion.div>
            )) : (
               <p className="text-foreground/50 italic py-5 w-full">Chưa có giao dịch trao đổi nào hôm nay.</p>
            )}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="px-6 py-32 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <span className="text-5xl font-serif italic text-primary/20 block mb-8">"</span>
          <p className="text-3xl lg:text-4xl font-serif italic leading-relaxed text-foreground/80 mb-8">
            Việc đọc sách là một cuộc đối thoại không ngừng, <br />
            nơi cuốn sách trò chuyện còn tâm hồn bạn lắng nghe.
          </p>
          <div className="w-12 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>
      </section>

      <footer className="px-6 py-12 border-t border-black/5 text-center text-sm text-foreground/40 font-medium tracking-wide">
        &copy; 2026 RE-BOOK. ALL RIGHTS RESERVED.
      </footer>
    </main>
  );
}
