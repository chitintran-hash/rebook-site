import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function QualityPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-3xl font-serif font-bold text-primary mb-8">Chính sách Chất lượng & Thẩm định (Bảo chứng Re-Book)</h1>
          <p className="text-foreground/80 leading-relaxed mb-6">
            Để giải quyết "nỗi đau" về sách lậu và vệ sinh trên thị trường, website áp dụng các quy định sau:
          </p>
          <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
            <li><strong className="text-foreground">Cam kết sách thật:</strong> 100% sách đăng tải phải là sách chính bản. Hệ thống QC (Quality Control) sẽ từ chối và gỡ bỏ ngay lập tức các loại sách photo, sách lậu hoặc sách giả.</li>
            <li><strong className="text-foreground">Tiêu chuẩn đầu vào:</strong> Chỉ chấp nhận sách còn nguyên vẹn, không mất trang, không rách nát quá mức làm ảnh hưởng đến nội dung.</li>
            <li><strong className="text-foreground">Dịch vụ Spa 3S:</strong> Khách hàng có thể tùy chọn gói vệ sinh chuyên sâu bao gồm khử mùi, xử lý bụi và bọc màng co để nâng cấp giá trị cuốn sách như mới.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
