"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteBook(bookId: string) {
  const { error } = await supabase
    .from("eb_books")
    .delete()
    .eq("id", bookId);

  if (error) {
    return { error: "Không thể xóa sách: " + error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/marketplace");
  revalidatePath("/");
  return { success: true };
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from("eb_users")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Không thể tải danh sách người dùng: " + error.message };
  }

  return { data };
}

export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from("eb_users")
    .delete()
    .eq("id", userId);

  if (error) {
    return { error: "Không thể xóa người dùng: " + error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
