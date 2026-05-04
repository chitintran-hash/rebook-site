import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Policies */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt="Re-Book Logo" className="h-16 w-auto" />
            </Link>
            <p className="text-foreground/60 mb-6 max-w-md">
              Re-Book - Nền tảng giao dịch và trao đổi sách cũ uy tín, an toàn và tiết kiệm. Giữ lại tri thức, trao đi câu chuyện.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h4 className="font-bold text-lg mb-4 text-foreground">Về Re-Book</h4>
                <Link href="/about" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Về chúng tôi</Link>
                <Link href="/marketplace" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Sàn giao dịch</Link>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-lg mb-4 text-foreground">Chính sách</h4>
                <Link href="/policies/quality" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Chất lượng & Thẩm định</Link>
                <Link href="/policies/transaction" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Giao dịch & Thanh toán</Link>
                <Link href="/policies/shipping" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Vận chuyển & Giao nhận</Link>
              </div>
              <div className="space-y-3 sm:mt-11">
                <Link href="/policies/refund" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link>
                <Link href="/policies/privacy" className="block text-sm text-foreground/60 hover:text-primary transition-colors">Bảo mật & Quyền riêng tư</Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h4 className="font-bold text-lg mb-6 text-foreground">Liên hệ với chúng tôi</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>085.206.3206</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:00ReBook00@gmail.com" className="hover:text-primary transition-colors">00ReBook00@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/60">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <span className="leading-relaxed">19 Nguyễn Hữu Thọ, Phường Tân Hưng, Hồ Chí Minh 758307, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 pt-8 text-center text-sm text-foreground/40 font-medium tracking-wide">
          &copy; 2026 RE-BOOK. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};
