"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { Users, Trash2, ArrowLeft, Loader2, ShieldCheck, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { fetchUsers, deleteUser } from "@/lib/actions/admin";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && (session.user as any).role !== "ADMIN")) {
      router.push("/");
      return;
    }

    const loadUsers = async () => {
      const result = await fetchUsers();
      if (result.data) {
        setUsers(result.data);
      }
      setIsLoading(false);
    };

    if (status === "authenticated") {
      loadUsers();
    }
  }, [session, status, router]);

  const handleDeleteUser = async (id: string, email: string) => {
    if (email === session?.user?.email) {
      alert("Bạn không thể tự xóa chính mình!");
      return;
    }
    
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản ${email}?`)) return;
    
    setIsDeleting(id);
    const result = await deleteUser(id);
    
    if (result.success) {
      setUsers(users.filter(u => u.id !== id));
    } else {
      alert(result.error);
    }
    setIsDeleting(null);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 bg-background-soft">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/admin" className="flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-8 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
        </Link>

        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Quản lý người dùng</h1>
            <p className="text-foreground/50">Danh sách tất cả độc giả và quản trị viên trên hệ thống.</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl shadow-black/5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/5 bg-black/[0.02]">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-foreground/40">Người dùng</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-foreground/40">Vai trò</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-foreground/40">Ngày tham gia</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-foreground/40 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/[0.01] transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center font-bold text-primary">
                        {user.full_name?.charAt(0) || user.email?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.full_name || "Chưa cập nhật"}</p>
                        <p className="text-xs text-foreground/40 flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                       user.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                     }`}>
                       {user.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
                       {user.role}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-foreground/50">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4" />
                       {new Date(user.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={isDeleting === user.id || user.email === session?.user?.email}
                      className="p-3 hover:bg-red-50 rounded-xl transition-colors group disabled:opacity-50"
                    >
                       {isDeleting === user.id ? (
                         <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                       ) : (
                         <Trash2 className="w-4 h-4 text-foreground/40 group-hover:text-red-500" />
                       )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
