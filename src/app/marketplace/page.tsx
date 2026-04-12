"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Search, Filter, Book, Heart, ShoppingBag, Loader2, Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { deleteBook } from "@/lib/actions/admin";
import { toggleCartItem, toggleWishlistItem, getUserData } from "@/lib/actions/user-actions";

const categories = ["Tất cả", "Literature", "Philosophy", "History", "Tech", "Business"];
const conditions = ["Tất cả", "Like New", "Good", "Vintage"];
const moods = ["Tất cả", "Hứng khởi", "Sâu sắc", "Chill", "Trầm mặc", "Phiêu lưu"];

export default function MarketplacePage() {
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeCondition, setActiveCondition] = useState("Tất cả");
  const [activeMood, setActiveMood] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: session } = useSession();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  const [cartIds, setCartIds] = useState<string[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user) {
      getUserData().then(res => {
        setCartIds(res.cartIds);
        setWishlistIds(res.wishlistIds);
      });
    } else {
      setCartIds([]);
      setWishlistIds([]);
    }
  }, [session]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("eb_books")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setBooks(data || []);
        setFilteredBooks(data || []);
      }
      setIsLoading(false);
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;
    if (activeCategory !== "Tất cả") {
      result = result.filter(b => b.category === activeCategory);
    }
    if (activeCondition !== "Tất cả") {
      result = result.filter(b => b.condition === activeCondition);
    }
    if (activeMood !== "Tất cả") {
      result = result.filter(b => b.mood === activeMood);
    }
    if (searchQuery) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        b.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBooks(result);
  }, [activeCategory, activeCondition, activeMood, searchQuery, books]);

  const handleToggleCart = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (!session) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    const isCarted = cartIds.includes(bookId);
    setCartIds(prev => isCarted ? prev.filter(id => id !== bookId) : [...prev, bookId]);
    
    const res = await toggleCartItem(bookId);
    if (res?.error) {
      setCartIds(prev => isCarted ? [...prev, bookId] : prev.filter(id => id !== bookId));
      alert(res.error);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (!session) {
      alert("Vui lòng đăng nhập để yêu thích sách");
      return;
    }
    const isWished = wishlistIds.includes(bookId);
    setWishlistIds(prev => isWished ? prev.filter(id => id !== bookId) : [...prev, bookId]);

    const res = await toggleWishlistItem(bookId);
    if (res?.error) {
      setWishlistIds(prev => isWished ? [...prev, bookId] : prev.filter(id => id !== bookId));
      alert(res.error);
    }
  };

  const handleDeleteBook = async (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa cuốn sách này? Việc này không thể hoàn tác.")) return;
    
    const res = await deleteBook(bookId);
    if (res.success) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
    } else {
      alert(res.error);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Search & Filter Header */}
        <div className="space-y-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm tác giả, tiêu đề sách..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-full py-5 pl-14 pr-6 shadow-xl shadow-black/5 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                    activeCategory === cat 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-white text-foreground/50 hover:bg-black/5"
                  )}
                >
                  {cat === "Tất cả" ? "Tất cả" : 
                   cat === "Literature" ? "Văn học" :
                   cat === "Philosophy" ? "Triết học" :
                   cat === "History" ? "Lịch sử" :
                   cat === "Tech" ? "Công nghệ" : "Kinh doanh"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-center bg-white p-6 rounded-[2rem] shadow-xl shadow-black/5 border border-black/5">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Độ mới:</span>
              <div className="flex gap-2">
                {conditions.map(cond => (
                  <button
                    key={cond}
                    onClick={() => setActiveCondition(cond)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      activeCondition === cond ? "bg-accent text-white" : "bg-black/5 text-foreground/40 hover:bg-black/10"
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:block w-[1px] h-8 bg-black/5" />

            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-foreground/30">Tâm trạng (Mood):</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {moods.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setActiveMood(mood)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      activeMood === mood ? "bg-primary/20 text-primary" : "bg-black/5 text-foreground/40 hover:bg-black/10"
                    )}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-foreground/50 font-serif italic">Đang tải kho tàng tri thức...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-32">
            <Book className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-2">Không tìm thấy sách</h2>
            <p className="text-foreground/50">Hãy thử tìm kiếm với từ khóa khác hoặc danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
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
                  {isAdmin && (
                    <button 
                      onClick={(e) => handleDeleteBook(e, book.id)}
                      className="absolute top-4 left-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                      title="Xoá sách (ADMIN)"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-10">
                    <button 
                      onClick={(e) => handleToggleWishlist(e, book.id)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors",
                        wishlistIds.includes(book.id) ? "bg-red-500 text-white" : "bg-white hover:bg-primary hover:text-white"
                      )}
                    >
                      <Heart className="w-5 h-5 transition-transform active:scale-75" />
                    </button>
                    <button 
                      onClick={(e) => handleToggleCart(e, book.id)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors",
                        cartIds.includes(book.id) ? "bg-primary text-white" : "bg-white hover:bg-primary hover:text-white"
                      )}
                    >
                      <ShoppingBag className="w-5 h-5 transition-transform active:scale-75" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <button className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-serif font-bold truncate pr-4">{book.title}</h3>
                    <div className="flex items-center gap-1 text-accent font-bold text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/50">{book.author}</p>
                  <p className="text-lg font-black text-primary pt-2">{book.price.toLocaleString()}đ</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
