"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function uploadBookCover(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    return { error: "Không tìm thấy file ảnh." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create a unique filename
  const filename = `books/cover_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

  const { data, error } = await supabaseAdmin.storage
    .from("book_covers")
    .upload(filename, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    return { error: "Lỗi tải ảnh lên: " + error.message };
  }

  // Get public URL
  const { data: publicData } = supabaseAdmin.storage
    .from("book_covers")
    .getPublicUrl(data.path);

  return { url: publicData.publicUrl };
}
