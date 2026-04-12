"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Book, DollarSign, Tag, AlignLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { uploadBookCover } from "@/lib/actions/upload";

export default function NewBookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    condition: "Good",
    mood: "",
    description: "",
    image_url: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const sellerId = (session?.user as any)?.id;
    
    if (!sellerId) {
      alert("Không tìm thấy ID người dùng. Vui lòng Đăng xuất và Đăng nhập lại để cập nhật tài khoản!");
      setIsLoading(false);
      return;
    }

    let finalImageUrl = formData.image_url;
    if (coverFile) {
      const uploadData = new FormData();
      uploadData.append("file", coverFile);
      const res = await uploadBookCover(uploadData);
      if (res.error || !res.url) {
        alert(res.error || "Có lỗi xảy ra khi tải ảnh.");
        setIsLoading(false);
        return;
      }
      finalImageUrl = res.url;
    }

    const { error } = await supabase.from("eb_books").insert([
      {
        ...formData,
        image_url: finalImageUrl,
        price: parseFloat(formData.price.replace(/\D/g, "") || "0"),
        seller_id: sellerId
      }
    ]);

    if (error) {
      alert("Lỗi khi thêm sách: " + error.message);
    } else {
      router.push("/admin");
    }
    setIsLoading(false);
  };

  if (status === "loading") return null;

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/admin" className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại quản trị
        </Link>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 border border-black/5">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Book className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold">Thêm sách mới</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Row 1: Title & Author */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Tiêu đề sách</label>
                <div className="relative group">
                  <Book className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="Ví dụ: Nhà Giả Kim"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Tác giả</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="Ví dụ: Paulo Coelho"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Price & Category */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Giá bán (VNĐ)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="Ví dụ: 89000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Thể loại</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                    placeholder="Ví dụ: Tiểu thuyết, Kinh tế..."
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Condition & Mood */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Độ mới (Condition)</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Vintage">Vintage</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Tâm trạng (Mood)</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option value="">Chọn tâm trạng</option>
                  <option value="Hứng khởi">Hứng khởi</option>
                  <option value="Sâu sắc">Sâu sắc</option>
                  <option value="Chill">Chill</option>
                  <option value="Trầm mặc">Trầm mặc</option>
                  <option value="Phiêu lưu">Phiêu lưu</option>
                </select>
              </div>
            </div>

            {/* Upload ảnh bìa */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Ảnh bìa sách</label>
              <div className="relative group flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="w-full bg-black/5 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm
                             file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary file:text-white hover:file:opacity-90"
                  />
                </div>
                {coverFile && (
                  <div className="shrink-0">
                    <img 
                      src={URL.createObjectURL(coverFile)} 
                      alt="Preview" 
                      className="w-16 h-16 object-cover rounded-2xl shadow-lg border border-black/5"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mô tả sách */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">Mô tả sách</label>
              <div className="relative group">
                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-bold resize-none"
                  placeholder="Viết một vài dòng giới thiệu về cuốn sách..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full bg-primary text-white py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all hover:bg-primary/90 active:scale-[0.98] shadow-2xl shadow-primary/20",
                isLoading && "opacity-70 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Lưu sách
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
