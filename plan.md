# Kế Hoạch Xây Dựng Rico Study

## Tom tat

Rico Study là WebApp quản lý lớp học cho giáo viên dạy thêm và trung tâm nhỏ. Ứng dụng chạy dạng web app, frontend deploy static, backend dùng Google Apps Script, dữ liệu lưu trong Google Sheet của từng khách hàng.

MVP hiện tập trung vào giao diện vận hành theo file `quanly-lophoc(1).html` và các ảnh tham chiếu: sidebar nhóm mục, topbar, bottom nav mobile, modal tạo lớp, drawer tạo hóa đơn, điểm danh ảnh, học phí, công nợ, dashboard, báo cáo, thông báo phụ huynh qua Zalo/email/share card và phân quyền admin/giáo viên.

## Kien truc

- Frontend: Vue 3 + Vite, mobile-first, demo local trước khi nối API thật.
- Backend: Google Apps Script Web App nhận request HTTP và đọc/ghi Google Sheet.
- Database: Google Sheet template gồm các tab chuẩn hóa.
- Auth MVP: tài khoản quản trị/giáo viên lưu trong tab `GiaoVien`.
- Deploy: Vercel production hoặc upload thư mục `dist/` lên subdomain.
- PWA/Web Push: service worker nhận push, Vercel serverless API gửi push bằng VAPID keys, fallback local notification khi chưa cấu hình.

## Cac buoc trien khai

1. Port UI Rico Study từ file mẫu vào Vue: login, sidebar, bottom nav, card, modal, toast.
2. Hoàn thiện workflow ít thao tác: điểm danh auto-save, thu tiền tự điền công nợ, tự tạo thông báo.
3. Cập nhật schema Google Sheet cho thông tin Zalo/phụ huynh, queue thông báo và báo cáo phụ huynh.
4. Mở rộng Apps Script API: gửi thông báo, Zalo OA, ZNS, queue, report phụ huynh.
5. Kết nối frontend với Apps Script khi có `VITE_APPS_SCRIPT_URL`.
6. Kiểm thử local, build production và deploy Vercel.
7. Bổ sung PWA notification, preference theo từng loại thông báo và API push Vercel.
8. Bổ sung điểm danh ảnh theo consent, media log và hàng chờ xác nhận khi độ tin cậy thấp.
9. Bổ sung thẻ chia sẻ phụ huynh dạng ảnh PNG duy nhất cho đã đến lớp, vắng học, phiếu học phí, xác nhận thu tiền và sổ liên lạc.
10. Bổ sung các màn theo ảnh tham chiếu: Sổ liên lạc, Phiếu học phí, Thu học phí tự động, Thống kê tab, Bảng giá và Dùng thử.
11. Dùng `rivex-solutions-favicon.png` làm logo web app, nới padding toàn site và thêm layout grid cards bên cạnh layout list cho lịch/danh sách.

## Tieu chi nghiem thu MVP

- Đăng nhập demo và xem dashboard Rico Study được.
- Xem học viên, lớp học, điểm danh, học phí, báo cáo, thông báo, cài đặt.
- Điểm danh một chạm tự lưu và tạo hàng đợi nhắn phụ huynh khi vắng/nghỉ phép.
- Thu học phí tự cập nhật công nợ và tạo xác nhận phụ huynh.
- Zalo/email có preview, lịch sử gửi và fallback thủ công khi chưa đủ cấu hình.
- Bật/tắt riêng nhắc lịch dạy, tổng hợp công nợ đầu tháng và cảnh báo nguy cơ nghỉ học.
- Chụp/tải ảnh trong màn Điểm danh, tự điểm danh học sinh đủ consent và đưa ca cần xác nhận vào hàng chờ.
- Tạo thẻ ảnh PNG duy nhất và share/copy/download được cho phụ huynh.
- Các danh sách chính có lựa chọn List/Grid, không bị díu rít hoặc overlap trên desktop/mobile.
- Modal thêm lớp và drawer tạo hóa đơn hoạt động trên desktop/mobile.
- Giao diện không vỡ trên mobile, tablet, desktop.

## Ghi chu

- Ban đầu app chạy ở chế độ demo local để phát triển UI nhanh.
- Khi có Google Apps Script URL, điền `VITE_APPS_SCRIPT_URL` vào `.env` để frontend gọi backend.
- Zalo OA/ZNS cần token và template thật trước khi bật gửi production.
- Web Push thật cần cấu hình `VITE_VAPID_PUBLIC_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.
- Nhận diện ảnh production cần consent rõ ràng và backend lưu ảnh/embedding phù hợp chính sách dữ liệu cá nhân.
