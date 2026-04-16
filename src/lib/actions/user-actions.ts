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
    .select("id, quantity, eb_books(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return { items: [] };

  return { items: data.map((d: any) => ({
    cart_id: d.id,
    quantity: d.quantity || 1,
    book: d.eb_books
  }))};
}

export async function updateCartQuantity(cartId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập" };

  if (quantity <= 0) {
    await supabaseAdmin.from("eb_cart_items").delete().eq("id", cartId).eq("user_id", session.user.id);
    return { success: true, message: "Đã xoá sách khỏi giỏ hàng" };
  }

  const { error } = await supabaseAdmin
    .from("eb_cart_items")
    .update({ quantity })
    .match({ id: cartId, user_id: session.user.id });

  if (error) return { error: "Không thể cập nhật số lượng" };
  return { success: true };
}

export async function getUserWallet() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Vui lòng đăng nhập", balance: 0, coins: 0 };

  const userId = session.user.id;

  // Try to get wallet
  let { data: wallet, error } = await supabaseAdmin
    .from("eb_wallets")
    .select("cash_balance, book_coins")
    .eq("user_id", userId)
    .single();

  if (error || !wallet) {
    // Create wallet if not exists
    const { data: newWallet, error: createError } = await supabaseAdmin
      .from("eb_wallets")
      .insert({ user_id: userId, cash_balance: 0, book_coins: 0 })
      .select("cash_balance, book_coins")
      .single();
    
    if (createError) return { error: "Không thể khởi tạo ví", balance: 0, coins: 0 };
    wallet = newWallet;
  }

  return { 
    success: true, 
    balance: Number(wallet.cash_balance), 
    coins: Number(wallet.book_coins) 
  };
}
