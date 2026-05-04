import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-6 bg-background-soft">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2rem] shadow-xl border border-black/5">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4 text-center">VỀ RE-BOOK</h1>
          <h2 className="text-xl font-bold text-foreground/70 mb-10 text-center uppercase tracking-widest">HỆ SINH THÁI SÁCH CŨ TOÀN DIỆN</h2>
          
          <p className="text-foreground/80 leading-relaxed mb-10 text-lg text-center max-w-2xl mx-auto">
            Re-Book là một dự án khởi nghiệp sáng tạo được ra đời với sứ mệnh tái định nghĩa giá trị của những cuốn sách cũ. Chúng tôi không chỉ đơn thuần là một website mua bán, mà là một hệ sinh thái kết nối cộng đồng yêu sách thông qua công nghệ và dịch vụ chuyên nghiệp.
          </p>

          <div className="space-y-12">
            <section>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">1. Sứ mệnh của chúng tôi</h3>
              <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
                <li><strong className="text-foreground">Xoay vòng tri thức:</strong> Giúp những cuốn sách đã qua sử dụng tìm thấy "cuộc đời mới", góp phần lan tỏa văn hóa đọc bền vững.</li>
                <li><strong className="text-foreground">Giải quyết vấn nạn sách lậu:</strong> Thông qua quy trình kiểm duyệt nghiêm ngặt, chúng tôi cam kết loại bỏ sách lậu, sách giả để bảo vệ quyền lợi của tác giả và người đọc.</li>
                <li><strong className="text-foreground">Bảo vệ môi trường:</strong> Thúc đẩy tiêu dùng xanh bằng cách tái sử dụng tài nguyên, giảm thiểu rác thải giấy ra môi trường.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">2. Tại sao nên chọn Re-Book?</h3>
              <ul className="space-y-4 text-foreground/80 leading-relaxed list-disc list-inside">
                <li><strong className="text-foreground">Dịch vụ Spa 3S Độc quyền:</strong> Mỗi cuốn sách tại Re-Book đều có cơ hội được "chăm sóc đặc biệt" để đạt trạng thái tốt nhất trước khi đến tay chủ mới.</li>
                <li><strong className="text-foreground">An toàn & Tin cậy:</strong> Chúng tôi đóng vai trò là đơn vị trung gian bảo lãnh giao dịch, đảm bảo người mua nhận đúng hàng và người bán nhận đúng tiền.</li>
                <li><strong className="text-foreground">Tối ưu cho sinh viên:</strong> Hệ thống Hub vận chuyển thông minh giúp giảm thiểu chi phí và thời gian giao nhận, đặc biệt trong các khu vực cộng đồng học thuật.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">3. Tầm nhìn phát triển</h3>
              <p className="text-foreground/80 leading-relaxed">
                Re-Book hướng tới trở thành nền tảng hàng đầu tại Việt Nam trong lĩnh vực trao đổi và mua bán sách cũ, nơi mọi người có thể tìm thấy bất kỳ cuốn sách nào mình cần với mức giá hợp lý và chất lượng đảm bảo nhất.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
