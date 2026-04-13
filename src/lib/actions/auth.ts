"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/mail";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

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

  // Generate verification token
  const verifyToken = uuidv4();
  const role = email === "chitintran123@gmail.com" ? "ADMIN" : "USER";

  // Insert user
  const { error } = await supabaseAdmin.from("eb_users").insert([
    {
      email,
      password_hash: hashedPassword,
      full_name: fullName,
      phone,
      role: role,
      email_verified: false,
      verify_token: verifyToken
    }
  ]);

  if (error) {
    return { error: "Đã có lỗi xảy ra khi tạo tài khoản: " + error.message };
  }

  // Send verification email
  const mailRes = await sendVerificationEmail(email, verifyToken);
  
  if (mailRes?.error) {
    return { success: true, message: "Tạo thành công, nhưng cấu hình Vercel EMAIL_PASS bị sai: " + mailRes.error };
  }

  return { success: true, message: "Vui lòng kiểm tra hộp thư email để xác thực tài khoản." };
}

export async function verifyEmailToken(token: string) {
  if (!token) return { error: "Token không hợp lệ." };

  const { data: user, error } = await supabaseAdmin
    .from("eb_users")
    .select("id")
    .eq("verify_token", token)
    .single();

  if (error || !user) {
    return { error: "Mã xác thực không hợp lệ hoặc đã được sử dụng." };
  }

  const { error: updateError } = await supabaseAdmin
    .from("eb_users")
    .update({ email_verified: true, verify_token: null })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Lỗi khi cập nhật trạng thái xác thực." };
  }

  return { success: true };
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Vui lòng nhập email." };

  const { data: user } = await supabaseAdmin
    .from("eb_users")
    .select("id")
    .eq("email", email)
    .single();

  if (!user) {
    // Return success anyway to prevent email enumeration
    return { success: true };
  }

  const resetToken = uuidv4();
  // Token expires in 1 hour
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await supabaseAdmin
    .from("eb_users")
    .update({ 
      reset_password_token: resetToken, 
      reset_password_expires: expiresAt.toISOString() 
    })
    .eq("id", user.id);

  await sendPasswordResetEmail(email, resetToken);

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) return { error: "Thiếu thông tin bảo mật." };

  const { data: user, error } = await supabaseAdmin
    .from("eb_users")
    .select("id, reset_password_expires")
    .eq("reset_password_token", token)
    .single();

  if (error || !user) {
    return { error: "Mã khôi phục không hợp lệ." };
  }

  if (new Date(user.reset_password_expires) < new Date()) {
    return { error: "Mã khôi phục đã hết hạn. Vui lòng yêu cầu lại." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error: updateError } = await supabaseAdmin
    .from("eb_users")
    .update({ 
      password_hash: hashedPassword,
      reset_password_token: null,
      reset_password_expires: null
    })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Không thể đổi mật khẩu. Hãy thử lại." };
  }

  return { success: true };
}

export async function resendVerification(email: string) {
  if (!email) return { error: "Không tìm thấy email." };

  const { data: user } = await supabaseAdmin
    .from("eb_users")
    .select("id, email_verified, verify_token")
    .eq("email", email)
    .single();

  if (!user) return { error: "Tài khoản không tồn tại." };
  if (user.email_verified) return { error: "Tài khoản đã được xác thực." };

  let token = user.verify_token;
  if (!token) {
    token = uuidv4();
    await supabaseAdmin.from("eb_users").update({ verify_token: token }).eq("id", user.id);
  }

  const mailRes = await sendVerificationEmail(email, token);
  if (mailRes?.error) {
    return { error: "Lỗi cấu hình Vercel EMAIL_PASS: " + mailRes.error };
  }

  return { success: true, message: "Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư." };
}
