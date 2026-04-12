"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@/auth";

export async function toggleCartItem(bookId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vui lòng đăng nhập" };
  }

  const userId = session.user.id;

  // Check if exists
  const { data: existing } = await supabaseAdmin
    .from("eb_cart_items")
    .select("id")
    .match({ user_id: userId, book_id: bookId })
    .single();

  if (existing) {
    // Remove
    await supabaseAdmin.from("eb_cart_items").delete().eq("id", existing.id);
    return { success: true, action: "removed", message: "Đã xoá khỏi giỏ hàng" };
  } else {
    // Add
    await supabaseAdmin.from("eb_cart_items").insert({ user_id: userId, book_id: bookId });
    return { success: true, action: "added", message: "Đã thêm vào giỏ hàng" };
  }
}

export async function toggleWishlistItem(bookId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vui lòng đăng nhập" };
  }

  const userId = session.user.id;

  // Check if exists
  const { data: existing } = await supabaseAdmin
    .from("eb_wishlist_items")
    .select("id")
    .match({ user_id: userId, book_id: bookId })
    .single();

  if (existing) {
    // Remove
    await supabaseAdmin.from("eb_wishlist_items").delete().eq("id", existing.id);
    return { success: true, action: "removed", message: "Đã huỷ yêu thích" };
  } else {
    // Add
    await supabaseAdmin.from("eb_wishlist_items").insert({ user_id: userId, book_id: bookId });
    return { success: true, action: "added", message: "Đã thêm vào mục yêu thích" };
  }
}

export async function getUserData() {
  const session = await auth();
  if (!session?.user?.id) {
    return { cartIds: [], wishlistIds: [] };
  }

  const userId = session.user.id;

  const [cartRes, wishRes] = await Promise.all([
    supabaseAdmin.from("eb_cart_items").select("book_id").eq("user_id", userId),
    supabaseAdmin.from("eb_wishlist_items").select("book_id").eq("user_id", userId)
  ]);

  return {
    cartIds: (cartRes.data || []).map(r => r.book_id),
    wishlistIds: (wishRes.data || []).map(r => r.book_id)
  };
}

export async function getCartDetails() {
  const session = await auth();
  if (!session?.user?.id) return { items: [] };

  const { data, error } = await supabaseAdmin
    .from("eb_cart_items")
    .select("id, eb_books(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return { items: [] };

  return { items: data.map((d: any) => ({
    cart_id: d.id,
    book: d.eb_books
  }))};
}
