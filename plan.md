# Kế Hoạch Xây Dựng Rico Study

## Tom tat

Rico Study là WebApp quản lý lớp học cho giáo viên dạy thêm và trung tâm nhỏ. Ứng dụng chạy dạng web app, frontend deploy static, backend dùng Google Apps Script, dữ liệu lưu trong Google Sheet của từng khách hàng.

MVP tập trung vào giao diện glass/liquid theo file `quanly-lophoc(1).html`, quản lý học viên, lớp học, điểm danh một chạm, học phí, công nợ, dashboard, báo cáo, thông báo phụ huynh qua Zalo/email và phân quyền admin/giáo viên.

## Kien truc

- Frontend: Vue 3 + Vite, mobile-first, demo local trước khi nối API thật.
- Backend: Google Apps Script Web App nhận request HTTP và đọc/ghi Google Sheet.
- Database: Google Sheet template gồm các tab chuẩn hóa.
- Auth MVP: tài khoản quản trị/giáo viên lưu trong tab `GiaoVien`.
- Deploy: Vercel production hoặc upload thư mục `dist/` lên subdomain.

## Cac buoc trien khai

1. Port UI Rico Study từ file mẫu vào Vue: login, sidebar, bottom nav, card, modal, toast.
2. Hoàn thiện workflow ít thao tác: điểm danh auto-save, thu tiền tự điền công nợ, tự tạo thông báo.
3. Cập nhật schema Google Sheet cho thông tin Zalo/phụ huynh, queue thông báo và báo cáo phụ huynh.
4. Mở rộng Apps Script API: gửi thông báo, Zalo OA, ZNS, queue, report phụ huynh.
5. Kết nối frontend với Apps Script khi có `VITE_APPS_SCRIPT_URL`.
6. Kiểm thử local, build production và deploy Vercel.

## Tieu chi nghiem thu MVP

- Đăng nhập demo và xem dashboard Rico Study được.
- Xem học viên, lớp học, điểm danh, học phí, báo cáo, thông báo, cài đặt.
- Điểm danh một chạm tự lưu và tạo hàng đợi nhắn phụ huynh khi vắng/nghỉ phép.
- Thu học phí tự cập nhật công nợ và tạo xác nhận phụ huynh.
- Zalo/email có preview, lịch sử gửi và fallback thủ công khi chưa đủ cấu hình.
- Giao diện không vỡ trên mobile, tablet, desktop.

## Ghi chu

- Ban đầu app chạy ở chế độ demo local để phát triển UI nhanh.
- Khi có Google Apps Script URL, điền `VITE_APPS_SCRIPT_URL` vào `.env` để frontend gọi backend.
- Zalo OA/ZNS cần token và template thật trước khi bật gửi production.
