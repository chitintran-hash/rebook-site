import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TransactionPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Chính sách Giao dịch & Thanh toán</h1>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Website vận hành theo mô hình sàn trung gian bảo lãnh dòng tiền:
          </p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
            <li><strong className="text-foreground">Cơ chế Ký quỹ (Escrow):</strong> Khi bạn mua sách, số tiền (hoặc Book Coins) sẽ được hệ thống "đóng băng". Tiền chỉ được chuyển cho người bán sau khi bạn xác nhận đã nhận hàng đúng mô tả.</li>
            <li><strong className="text-foreground">Hệ thống Book Coins:</strong> Khuyến khích người dùng sử dụng điểm tích lũy (Book Coins) để trao đổi sách (Trade-in), giúp tiết kiệm chi phí và xoay vòng tri thức.</li>
            <li><strong className="text-foreground">Minh bạch chi phí:</strong> Tổng hóa đơn sẽ hiển thị rõ ràng từng khoản mục: Giá sách + Phí dịch vụ 3S (nếu chọn) + Phí vận chuyển.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
