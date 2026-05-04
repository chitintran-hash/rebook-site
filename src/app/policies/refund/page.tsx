import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Chính sách Đổi trả & Hoàn tiền</h1>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Đảm bảo quyền lợi tối đa cho người mua trong môi trường C2C:
          </p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
            <li><strong className="text-foreground">Điều kiện đổi trả:</strong> Khách hàng được quyền trả hàng nếu sách nhận được không đúng với hình ảnh mô tả hoặc bị phát hiện là sách lậu sau khi thẩm định lại.</li>
            <li><strong className="text-foreground">Thời hạn báo cáo:</strong> Người mua cần gửi yêu cầu hỗ trợ/khiếu nại ngay thông qua tính năng "Báo cáo tin đăng" hoặc liên hệ CSKH khi nhận hàng.</li>
            <li><strong className="text-foreground">Hoàn tiền:</strong> Tiền/Book Coins sẽ được hoàn lại vào ví điện tử trên hệ thống nếu giao dịch bị hủy do lỗi từ phía người bán hoặc đơn vị vận hành.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
