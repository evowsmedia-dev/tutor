# Rico Study

WebApp quản lý lớp học cho giáo viên dạy thêm và trung tâm nhỏ. Frontend dùng Vue 3 + Vite, backend dự kiến dùng Google Apps Script, dữ liệu lưu trên Google Sheet riêng của từng khách hàng.

Rico Study ưu tiên thao tác ít nhất có thể: điểm danh một chạm, tự lưu trạng thái, tự đưa học viên vắng/nghỉ phép vào hàng đợi nhắn phụ huynh, tự điền số tiền còn nợ khi thu học phí và tạo tin Zalo/email từ mẫu có sẵn.

## Chạy local

```bash
npm install
npm run dev
```

Mở app tại:

```text
http://localhost:5173/
```

Tài khoản demo:

```text
admin@ricostudy.vn / 123456
```

## Build production

```bash
npm run build
```

Thư mục `dist/` là bản static có thể upload lên Hostinger hoặc deploy lên Vercel.

## Cấu hình Google Apps Script

1. Tạo Google Sheet theo schema trong `docs/google-sheet-schema.md`.
2. Tạo Apps Script project và copy nội dung `apps-script/Code.gs`.
3. Thêm script property:

```text
SPREADSHEET_ID=<Google Sheet ID>
```

4. Deploy Apps Script dạng Web App.
5. Tạo file `.env` từ `.env.example` và điền:

```text
VITE_APPS_SCRIPT_URL=<Apps Script Web App URL>
```

6. Build lại frontend và deploy thư mục `dist/`.

## Zalo và phụ huynh

Rico Study hỗ trợ 3 mức gửi:

- Zalo OA khi phụ huynh đã quan tâm OA và có `zaloUserId`.
- ZNS khi có token, template đã duyệt và số điện thoại đủ điều kiện.
- Fallback thủ công: tạo sẵn nội dung để giáo viên sao chép/mở Zalo gửi.

## Trạng thái hiện tại

- Đã có MVP frontend Rico Study chạy demo local.
- Đã có schema Google Sheet và backend Apps Script mẫu.
- Đã có UI hàng đợi thông báo, mock Zalo/OA/ZNS fallback và báo cáo phụ huynh.
- Chưa kết nối API thật vào frontend.
- Chưa cấu hình token Zalo OA/ZNS production.
