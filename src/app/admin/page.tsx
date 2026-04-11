"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Plus, Book, Trash2, Edit3, Loader2, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteBook } from "@/lib/actions/admin";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) return;
    
    setIsDeleting(id);
    const result = await deleteBook(id);
    
    if (result.success) {
      setBooks(books.filter(b => b.id !== id));
    } else {
      alert(result.error);
    }
    setIsDeleting(null);
  };

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user as any).role !== "ADMIN")) {
      router.push("/");
      return;
    }

    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("eb_books")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setBooks(data || []);
      }
      setIsLoading(false);
    };

    if (status === "authenticated") {
      fetchBooks();
    }
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Quản lý kho sách</h1>
            <p className="text-foreground/50">Chào mừng trở lại, {session?.user?.name}. Bạn có {books.length} đầu sách đang hoạt động.</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/admin/users"
              className="bg-black/5 text-foreground px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black/10 transition-all border border-black/5"
            >
              Quản lý người dùng
            </Link>
            <Link 
              href="/admin/books/new"
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
            >
              <Plus className="w-5 h-5" /> Thêm sách mới
            </Link>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-black/5 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Book className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-4">Chưa có cuốn sách nào</h2>
            <p className="text-foreground/50 mb-8 max-w-md mx-auto">
              Bắt đầu xây dựng thư viện của bạn bằng cách thêm cuốn sách đầu tiên ngay hôm nay.
            </p>
            <Link 
              href="/admin/books/new"
              className="text-primary font-bold hover:underline"
            >
              Thêm sách ngay &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {books.map((book) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 flex items-center gap-6 border border-black/5 hover:shadow-lg transition-all"
              >
                <div className="w-20 h-28 bg-black/5 rounded-xl overflow-hidden flex-shrink-0">
                   {book.image_url ? (
                     <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <Book className="w-8 h-8 text-black/10" />
                     </div>
                   )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold">{book.title}</h3>
                  <p className="text-sm text-foreground/50">{book.author} • {book.category}</p>
                  <p className="text-lg font-black text-primary mt-2">{book.price.toLocaleString()}đ</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 hover:bg-black/5 rounded-xl transition-colors">
                      <Edit3 className="w-5 h-5 text-foreground/40" />
                   </button>
                   <button 
                      onClick={() => handleDeleteBook(book.id)}
                      disabled={isDeleting === book.id}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50"
                    >
                       {isDeleting === book.id ? (
                         <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                       ) : (
                         <Trash2 className="w-5 h-5 text-foreground/40 group-hover:text-red-500" />
                       )}
                    </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
