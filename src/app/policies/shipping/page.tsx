import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ShippingPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Chính sách Vận chuyển & Giao nhận</h1>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Tối ưu cho quy mô nhỏ và tập trung vào cộng đồng sinh viên:
          </p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
            <li><strong className="text-foreground">Hệ thống Hub:</strong> Hàng sẽ được tập kết tại các trạm (Hub) trong khu vực trường học để kiểm định chất lượng trước khi giao.</li>
            <li><strong className="text-foreground">Phí vận chuyển:</strong> Áp dụng mức phí cực rẻ cho khu vực nội khu hoặc hỗ trợ Freeship khi nhận hàng trực tiếp tại các Hub chỉ định.</li>
            <li><strong className="text-foreground">Thời gian xử lý:</strong> Đội ngũ Re-Book sẽ liên hệ và xử lý đơn hàng trong vòng tối đa 3 ngày làm việc kể từ khi xác nhận đơn.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
