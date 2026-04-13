import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

const getAppUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${getAppUrl()}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Re-Book Team" <${user}>`,
    to: email,
    subject: "Xác thực tài khoản Re-Book của bạn",
    html: `
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h2 style="color: #2F9464;">Chào mừng đến với Re-Book! 📚</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm vào nút bên dưới để xác thực địa chỉ email của bạn:</p>
        <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; margin-top: 15px; margin-bottom: 20px; background-color: #2F9464; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Xác Nhận Email</a>
        <p style="font-size: 12px; color: #888;">Nếu nút bấm không hoạt động, bạn có thể copy đường link dưới đây và dán vào trình duyệt:</p>
        <p style="font-size: 12px; color: #888; word-break: break-all;">${confirmLink}</p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 10px; color: #aaa;">Đây là email tự động, vui lòng không phản hồi.</p>
      </div>
    `,
  };

  try {
    if (!user || user === '""' || user === '') {
        console.error("Missing EMAIL config");
        return { error: "Bạn chưa điền đúng EMAIL_USER và EMAIL_PASS trong Vercel Settings. Hãy kiểm tra lại tab Environment Variables." };
    }
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Gửi mail thất bại: ", error);
    return { error: "Lỗi SMTP: " + (error as any).message };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${getAppUrl()}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Re-Book Team" <${user}>`,
    to: email,
    subject: "Yêu cầu khôi phục mật khẩu Re-Book",
    html: `
      <div style="font-family: sans-serif; padding: 20px; text-align: center;">
        <h2 style="color: #2F9464;">Khôi Phục Mật Khẩu 🔄</h2>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với email này.</p>
        <p>Nhấp vào nút dưới đây để tạo mật khẩu mới. Bỏ qua email này nếu đây không phải yêu cầu của bạn.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; margin-top: 15px; margin-bottom: 20px; background-color: #2F9464; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Đặt Lại Mật Khẩu</a>
        <p style="font-size: 12px; color: #888; word-break: break-all;">${resetLink}</p>
      </div>
    `,
  };

  try {
    if (!user || user === '""' || user === '') {
        console.error("Missing EMAIL config");
        return { error: "Bạn chưa điền đúng EMAIL_USER và EMAIL_PASS trong Vercel Settings. Hệ thống không thể gửi email đổi mật khẩu." };
    }
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Gửi mail thất bại: ", error);
    return { error: "Không thể gửi email. Vui lòng thử lại sau." };
  }
};
