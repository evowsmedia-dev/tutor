# Rico Study

WebApp quản lý lớp học cho giáo viên dạy thêm và trung tâm nhỏ. Frontend dùng Vue 3 + Vite, backend dự kiến dùng Google Apps Script, dữ liệu lưu trên Google Sheet riêng của từng khách hàng.

Rico Study ưu tiên thao tác ít nhất có thể: điểm danh một chạm, tự lưu trạng thái, tự đưa học viên vắng/nghỉ phép vào hàng đợi nhắn phụ huynh, tự điền số tiền còn nợ khi thu học phí và tạo tin Zalo/email từ mẫu có sẵn.

Phiên bản hiện tại bổ sung PWA notification, điểm danh bằng ảnh demo theo consent, thẻ chia sẻ phụ huynh dạng ảnh PNG, Sổ liên lạc, wizard tạo hóa đơn, thu học phí tự động, thống kê chi tiết và bảng giá.

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

## Thông báo thiết bị và PWA

App có `manifest.webmanifest` và service worker tại `public/sw.js`. Khi trình duyệt hỗ trợ Web Push và người dùng cấp quyền, Rico Study có thể nhận:

- nhắc trước giờ dạy theo lịch tuần;
- tổng hợp học sinh chưa đóng học phí đầu tháng;
- cảnh báo học sinh có nguy cơ nghỉ nhiều buổi.

Để gửi Web Push thật trên Vercel, cấu hình biến môi trường:

```text
VITE_VAPID_PUBLIC_KEY=<public key dùng ở browser>
VAPID_PUBLIC_KEY=<public key dùng ở API>
VAPID_PRIVATE_KEY=<private key dùng ở API>
VAPID_SUBJECT=mailto:admin@ricostudy.vn
```

Nếu thiếu VAPID keys, app vẫn bật được local notification demo và hiển thị fallback rõ ràng.

## Ảnh điểm danh và chia sẻ phụ huynh

- Điểm danh ảnh hiện là workflow demo/mock: học sinh có `photoConsentStatus=granted` có thể được tự đánh dấu Có mặt; hồ sơ thiếu consent được đưa vào hàng chờ xác nhận.
- Tất cả nội dung chia sẻ phụ huynh được tạo dưới dạng một ảnh PNG duy nhất bằng canvas, dùng Web Share API trên mobile nếu hỗ trợ; fallback là tải ảnh, copy nội dung và mở Zalo thủ công.
- Các màn danh sách như học sinh, lịch dạy, phiếu học phí và thẻ chia sẻ có thể đổi giữa layout list và grid cards.
- Logo web app dùng `docs/rivex-solutions-favicon.png`, được publish qua `public/rivex-solutions-favicon.png`.

## Trạng thái hiện tại

- Đã có frontend Rico Study chạy demo local với layout vận hành theo ảnh tham chiếu.
- Đã có schema Google Sheet và backend Apps Script mẫu mở rộng cho thông báo, ảnh điểm danh, hóa đơn, chi phí và share artifact.
- Đã có UI hàng đợi thông báo, mock Zalo/OA/ZNS fallback, báo cáo phụ huynh, PWA notification và share card.
- Chưa kết nối API thật vào frontend.
- Chưa cấu hình token Zalo OA/ZNS production.
- Chưa cấu hình VAPID keys production cho Web Push thật.
