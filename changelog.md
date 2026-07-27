# Changelog

File này dùng để ghi lại lịch sử thay đổi trong quá trình xây dựng dự án Tutor.

## 2026-07-27

### Added

- Tạo file `changelog.md` để theo dõi log công việc.
- Tạo `plan.md` làm kế hoạch triển khai dự án Tutor.
- Khởi tạo frontend Vue 3 + Vite cho WebApp quản lý lớp học.
- Thêm các màn hình MVP demo: đăng nhập, dashboard, lớp học, điểm danh, học viên, học phí, báo cáo và cài đặt.
- Thêm dữ liệu demo để app chạy độc lập trước khi nối API thật.
- Thêm schema Google Sheet tại `docs/google-sheet-schema.md`.
- Thêm backend Google Apps Script mẫu tại `apps-script/Code.gs`.
- Thêm `README.md` hướng dẫn chạy local, build production và cấu hình Apps Script.

### Verified

- Chạy `npm install` thành công.
- Chạy `npm run build` thành công.
- Khởi động dev server tại `http://localhost:5173/`.
- Kiểm tra `curl -I http://localhost:5173/` trả `HTTP/1.1 200 OK`.

### Notes

- Mỗi lần thực hiện thay đổi nên ghi rõ nội dung đã làm, file liên quan, cách kiểm thử và vấn đề còn tồn đọng nếu có.
- Frontend hiện đang dùng chế độ demo local; bước tiếp theo là nối API Apps Script thật và tạo Google Sheet template.
