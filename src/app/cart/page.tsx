"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Trash2, Book, ArrowRight, Loader2, Plus, Minus } from "lucide-react";
import { getCartDetails, toggleCartItem, updateCartQuantity } from "@/lib/actions/user-actions";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getCartDetails();
    setItems(res.items || []);
    setLoading(false);
  };

  const removeItem = async (bookId: string) => {
    // optimistic update
    setItems(items.filter(i => i.book.id !== bookId));
    await toggleCartItem(bookId);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) return; // Users should use remove button to delete entirely if needed
    // optimistic update
    setItems(items.map(i => i.cart_id === cartId ? { ...i, quantity: newQuantity } : i));
    await updateCartQuantity(cartId, newQuantity);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = items.reduce((sum, item) => sum + (item.book?.price || 0) * (item.quantity || 1), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-serif font-bold mb-8">Giỏ Hàng Của Bạn</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl shadow-black/5">
            <Book className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-foreground/50 mb-8">Bạn chưa chọn cuốn sách nào. Hãy dạo quanh và chọn vài cuốn nhé!</p>
            <Link href="/marketplace" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all transition-transform active:scale-95 shadow-lg shadow-primary/20">
               Tiếp tục khám phá <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={item.cart_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-6 shadow-xl shadow-black/5 flex gap-6 items-center"
                  >
                    <div className="w-24 h-32 bg-black/5 rounded-xl shrink-0 overflow-hidden relative">
                      {item.book?.image_url ? (
                        <img src={item.book.image_url} alt={item.book.title} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center"><Book className="w-8 h-8 text-black/10" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-serif mb-1">{item.book?.title}</h3>
                      <p className="text-sm text-foreground/50 mb-3">{item.book?.author}</p>
                      <p className="font-black text-primary text-lg">{Number(item.book?.price || 0).toLocaleString()}đ</p>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <button 
                          onClick={() => changeQuantity(item.cart_id, (item.quantity || 1) - 1)} 
                          disabled={(item.quantity || 1) <= 1}
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center">{item.quantity || 1}</span>
                        <button 
                          onClick={() => changeQuantity(item.cart_id, (item.quantity || 1) + 1)} 
                          className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="font-bold text-lg mb-4 text-slate-800">
                        {((item.book?.price || 0) * (item.quantity || 1)).toLocaleString()}đ
                      </p>
                      <button
                        onClick={() => removeItem(item.book.id)}
                        className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-black/5 sticky top-28 border border-black/5">
                <h3 className="text-2xl font-serif font-bold mb-6">Tóm Tắt</h3>
                <div className="space-y-4 mb-6 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Số lượng ({totalItemsCount} cuốn)</span>
                    <span>{total.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Phí giao dịch</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="h-px bg-black/5 my-4" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-black text-primary text-2xl">{total.toLocaleString()}đ</span>
                  </div>
                </div>
                <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                  Thanh Toán <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
