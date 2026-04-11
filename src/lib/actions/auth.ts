"use server";

import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password) {
    return { error: "Email và mật khẩu là bắt buộc." };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user exists
  const { data: existingUser } = await supabase
    .from("eb_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    return { error: "Email này đã được đăng ký." };
  }

  // Insert user
  const { error } = await supabase.from("eb_users").insert([
    {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      role: "USER" // Default role
    }
  ]);

  if (error) {
    return { error: "Đã có lỗi xảy ra khi tạo tài khoản: " + error.message };
  }

  return { success: true };
}
