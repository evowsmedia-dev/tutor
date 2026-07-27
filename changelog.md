# Changelog

File này dùng để ghi lại lịch sử thay đổi trong quá trình xây dựng dự án Tutor.

## 2026-07-27

### Rico Study Notification, Photo Attendance and Parent Share Expansion

- Điều chỉnh UI sang layout vận hành theo ảnh tham chiếu: sidebar nhóm mục, topbar tìm kiếm/trạng thái/tháng/tài khoản, bottom nav mobile, modal/drawer và bảng giá.
- Thêm các màn mới: Lịch dạy, Sổ liên lạc, Phiếu học phí, Thu học phí tự động, Thống kê theo tab, Bảng giá, Hướng dẫn.
- Thêm modal Thêm lớp mới với màu nhận diện, kiểu học phí, mô tả và lịch học hàng tuần nhiều buổi.
- Thêm drawer Tạo hóa đơn 6 bước, hỗ trợ một học sinh hoặc tạo hàng loạt, tự điền kỳ thu phí/số tiền và tạo thẻ gửi phụ huynh.
- Thêm luồng điểm danh ảnh: chụp/tải ảnh, mock nhận diện học sinh có consent, tự đánh dấu Có mặt, đưa hồ sơ thiếu consent vào hàng chờ xác nhận.
- Thêm thẻ chia sẻ phụ huynh dạng PNG bằng canvas, fallback Web Share/copy/download và xuất PDF qua print dialog.
- Thêm PWA manifest, service worker, icon PWA, local notification và Vercel API scaffold cho Web Push.
- Thêm Cài đặt thông báo theo từng loại: nhắc trước giờ dạy, tổng hợp công nợ đầu tháng, cảnh báo nguy cơ nghỉ học.
- Mở rộng Apps Script routes/schema cho ảnh điểm danh, push subscription, notification preferences, hóa đơn, chi phí, thẻ share và sổ liên lạc.
- Tối ưu bundle bằng cách chỉ import các icon lucide đang dùng.

### Verified

- Chạy `npm install` thành công, thêm `web-push`, không có vulnerability.
- Chạy `npm run build` thành công.
- Kiểm tra dev server tại `http://localhost:5174/` bằng Chrome DevTools MCP.
- Xác nhận login, dashboard, sidebar nhóm mục, mobile bottom nav, modal Thêm lớp mới và drawer Tạo hóa đơn render đúng.
- Kiểm tra network chỉ còn favicon đã được xử lý bằng icon PWA.

### Rico Study Implementation

- Đổi thương hiệu app sang `Rico Study`.
- Port giao diện từ `quanly-lophoc(1).html` sang Vue: liquid/glass background, login card, sidebar desktop, bottom nav mobile, cards, modal và toast.
- Mở rộng frontend đủ màn hình: Tổng quan, Học viên, Lớp học, Điểm danh, Học phí & Công nợ, Báo cáo, Thông báo, Cài đặt.
- Thêm workflow ít thao tác: điểm danh một chạm tự lưu, vắng/nghỉ phép tự tạo hàng đợi nhắn phụ huynh, thu học phí tự điền công nợ và tạo xác nhận.
- Thêm mô phỏng Zalo OA/ZNS/email/fallback thủ công, preview tin nhắn, lịch sử gửi và báo cáo phụ huynh.
- Cập nhật Apps Script API mẫu cho queue thông báo, gửi Zalo OA, ZNS, email, báo cáo phụ huynh và lịch sử thông báo.
- Cập nhật Google Sheet schema với thông tin phụ huynh/Zalo, trạng thái gửi, báo cáo phụ huynh và cấu hình template.
- Deploy production Rico Study thành công; deployment URL là `https://tutor-re63otkjq-rubybao.vercel.app`, alias production là `https://tutor-six-delta.vercel.app`.

### Added

- Tạo file `changelog.md` để theo dõi log công việc.
- Tạo `plan.md` làm kế hoạch triển khai dự án Tutor.
- Khởi tạo frontend Vue 3 + Vite cho WebApp quản lý lớp học.
- Thêm các màn hình MVP demo: đăng nhập, dashboard, lớp học, điểm danh, học viên, học phí, báo cáo và cài đặt.
- Thêm dữ liệu demo để app chạy độc lập trước khi nối API thật.
- Thêm schema Google Sheet tại `docs/google-sheet-schema.md`.
- Thêm backend Google Apps Script mẫu tại `apps-script/Code.gs`.
- Thêm `README.md` hướng dẫn chạy local, build production và cấu hình Apps Script.
- Thêm Sites build adapter để production build có `dist/server/index.js` và `dist/.openai/hosting.json`.

### Verified

- Chạy `npm install` thành công.
- Chạy `npm run build` thành công.
- Khởi động dev server tại `http://localhost:5173/`.
- Kiểm tra `curl -I http://localhost:5173/` trả `HTTP/1.1 200 OK`.
- Tạo Sites project production `Tutor Class Manager`.
- Deploy production version 2 thành công tại `https://tutor-class-manager.rubybao-tre.chatgpt.site`.
- Kiểm tra production URL trả `HTTP/2 401` do site đang ở chế độ truy cập private/custom.
- Push source lên GitHub repository `https://github.com/evowsmedia-dev/tutor`.
- Link local project với Vercel project `rubybao/tutor`.
- Deploy production trên Vercel thành công; alias production là `https://tutor-six-delta.vercel.app`.
- Kiểm tra `curl -I https://tutor-six-delta.vercel.app` trả `HTTP/2 200`.
- Redeploy production từ HEAD mới nhất; deployment URL là `https://tutor-iqjtap03a-rubybao.vercel.app`, alias vẫn là `https://tutor-six-delta.vercel.app`.
- Cập nhật toàn bộ ngôn ngữ hiển thị trên frontend sang tiếng Việt có dấu.
- Thêm nhãn tiếng Việt cho vai trò, trạng thái lớp/buổi học/học viên/công nợ và phương thức thanh toán.
- Deploy production bản tiếng Việt có dấu; deployment URL là `https://tutor-hw7bx02mt-rubybao.vercel.app`, alias vẫn là `https://tutor-six-delta.vercel.app`.
- Kiểm tra production bundle có các cụm tiếng Việt có dấu như `Tổng quan`, `Đăng nhập`, `Quản lý lớp học`, `Công nợ`, `Tiền mặt`.

### Notes

- Mỗi lần thực hiện thay đổi nên ghi rõ nội dung đã làm, file liên quan, cách kiểm thử và vấn đề còn tồn đọng nếu có.
- Frontend hiện đang dùng chế độ demo local; bước tiếp theo là nối API Apps Script thật và tạo Google Sheet template.
