"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function deleteBook(bookId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này." };
  }

  const { error } = await supabaseAdmin
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
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này." };
  }

  const { data, error } = await supabaseAdmin
    .from("eb_users")
    .select("id, email, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: "Không thể tải danh sách người dùng: " + error.message };
  }

  return { data };
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Bạn không có quyền thực hiện hành động này." };
  }

  const { error } = await supabaseAdmin
    .from("eb_users")
    .delete()
    .eq("id", userId);

  if (error) {
    return { error: "Không thể xóa người dùng: " + error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
