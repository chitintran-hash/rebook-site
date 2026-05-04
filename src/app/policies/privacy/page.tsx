import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Chính sách Bảo mật & Quyền riêng tư</h1>
          <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
            <li><strong className="text-foreground">Bảo mật danh tính:</strong> Re-Book đóng vai trò trung gian giao nhận, giúp người bán và người mua không phải lộ thông tin cá nhân nhạy cảm như địa chỉ nhà hay số điện thoại riêng tư cho người lạ.</li>
            <li><strong className="text-foreground">Quản lý dữ liệu:</strong> Mọi thông tin (Tên, SĐT,...) chỉ được sử dụng để quản lý đơn hàng và hỗ trợ chăm sóc khách hàng tốt hơn.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
