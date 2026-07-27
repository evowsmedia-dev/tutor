# Đề xuất giải pháp quản lý lớp học dành cho giáo viên dạy thêm và trung tâm nhỏ

## 1. Phân tích đối thủ và nhu cầu mục tiêu

### 1.1. Đối thủ hiện tại

| Đối thủ | Mô hình | Điểm mạnh | Hạn chế |
|---|---|---|---|
| TopID | SaaS, thuê bao tháng/năm | Tự động hóa cao, điểm danh nhanh, tích hợp Zalo | Phát sinh chi phí định kỳ, phụ thuộc nhà cung cấp |
| Loppi | SaaS, thuê bao tháng/năm | Quản lý lớp học và học viên khá đầy đủ | Chi phí duy trì hàng tháng |
| Kizuna | SaaS, thuê bao tháng/năm | Có các chức năng quản lý và tương tác phụ huynh | Hệ thống có thể phức tạp với giáo viên nhỏ lẻ |
| Eduspace | SaaS, thuê bao tháng/năm | Tích hợp nhiều nghiệp vụ trung tâm | Chi phí cao, dư thừa chức năng với trung tâm nhỏ |
| Worksheet.vn | Mua một lần, dùng lâu dài | Dữ liệu lưu trên Google Sheet của người dùng, tiết kiệm chi phí | Là đối thủ trực tiếp nhất về mô hình sở hữu trọn đời |

### 1.2. Nhu cầu của nhóm khách hàng mục tiêu

Nhóm khách hàng chính gồm:

- Giáo viên dạy thêm cá nhân.
- Nhóm giáo viên cùng quản lý một vài lớp.
- Trung tâm nhỏ có từ vài chục đến vài trăm học viên.

Các nhu cầu chính:

- **Quản lý đơn giản:** Không cần hệ thống ERP giáo dục phức tạp.
- **Chi phí hợp lý:** Ưu tiên mua một lần thay vì trả phí hàng tháng.
- **Sở hữu lâu dài:** Không muốn bị phụ thuộc vào nhà cung cấp phần mềm.
- **Thao tác nhanh:** Điểm danh một chạm, tính học phí và công nợ tự động.
- **Gửi thông báo thuận tiện:** Nhắc lịch học, nhắc học phí qua Zalo hoặc email.
- **Bảo mật dữ liệu:** Dữ liệu học sinh và phụ huynh được lưu trên Google Sheet hoặc Google Drive của chính người dùng.
- **Tối ưu trên điện thoại:** Giáo viên có thể điểm danh và kiểm tra công nợ ngay trong lớp.

---

## 2. Sitemap và nhóm chức năng đề xuất

Hệ thống có thể chạy trên subdomain:

```text
quanly.tenmien.com
```

hoặc:

```text
ql.tenmien.com
```

### 2.1. Cấu trúc sitemap

```text
[Home / Dashboard]
   |-- Số lớp đang dạy hôm nay
   |-- Tổng doanh thu tháng này
   |-- Tổng công nợ chưa thu
   |-- Học sinh vắng mặt trong ngày
   |-- Lịch dạy tiếp theo

[Quản lý học viên]
   |-- Danh sách học viên
   |   |-- Lọc theo lớp
   |   |-- Tìm kiếm học viên
   |   |-- Thêm học viên mới
   |   |-- Import học viên từ Excel hoặc file mẫu
   |
   |-- Hồ sơ chi tiết học viên
       |-- Thông tin cá nhân
       |-- Thông tin phụ huynh
       |-- Lớp đang theo học
       |-- Lịch sử điểm danh
       |-- Lịch sử học phí
       |-- Công nợ hiện tại

[Quản lý lớp học]
   |-- Danh sách lớp
   |   |-- Lớp học theo buổi
   |   |-- Lớp học theo tháng
   |   |-- Lớp học theo combo
   |   |-- Lớp học theo khóa
   |
   |-- Chi tiết lớp
       |-- Danh sách học viên
       |-- Lịch học
       |-- Giáo viên phụ trách
       |-- Gói học phí áp dụng
       |-- Điểm danh
       |-- Lịch sử buổi học

[Quản lý học phí và doanh thu]
   |-- Cấu hình gói học phí
   |   |-- Theo buổi
   |   |-- Theo tháng
   |   |-- Theo combo
   |   |-- Theo khóa
   |
   |-- Quản lý thu tiền
   |-- Quản lý công nợ
   |-- Tạo hóa đơn hoặc phiếu thu
   |-- Gửi xác nhận thanh toán
   |-- Báo cáo doanh thu
       |-- Theo ngày
       |-- Theo tháng
       |-- Theo lớp
       |-- Theo giáo viên

[Tương tác và thông báo]
   |-- Gửi thông báo hàng loạt
   |   |-- Nhắc lịch học
   |   |-- Thông báo nghỉ hoặc đổi lịch
   |   |-- Nhắc nợ học phí
   |   |-- Xác nhận đã thu học phí
   |
   |-- Gửi qua Zalo
   |-- Gửi qua email
   |-- Lịch sử gửi thông báo

[Cài đặt]
   |-- Kết nối Google Sheet
   |-- Cấu hình Google Sheet ID
   |-- Cấu hình mẫu tin nhắn
   |-- Cấu hình Zalo OA
   |-- Cấu hình email
   |-- Quản lý tài khoản
   |-- Phân quyền giáo viên
       |-- Admin xem toàn bộ hệ thống
       |-- Giáo viên chỉ xem lớp được phân công
```

---

## 3. Các chức năng cốt lõi nên ưu tiên

### 3.1. Điểm danh một chạm

- Hiển thị danh sách học viên theo từng lớp.
- Giáo viên chỉ cần chạm để chọn:
  - Có mặt.
  - Vắng mặt.
  - Đi muộn.
  - Học bù.
  - Nghỉ có phép.
- Hệ thống tự động ghi nhận buổi học.
- Có thể tự động trừ số buổi còn lại trong combo.
- Có thể tự động tính phí phát sinh theo buổi.

### 3.2. Quản lý học phí và công nợ

- Theo dõi số tiền đã thu.
- Theo dõi số tiền còn nợ.
- Tính học phí theo:
  - Buổi học.
  - Tháng.
  - Combo.
  - Khóa học.
- Ghi nhận nhiều lần thanh toán.
- Tạo phiếu thu hoặc hóa đơn điện tử dạng đơn giản.
- Gửi thông báo cho phụ huynh sau khi thanh toán.

### 3.3. Quản lý lịch học

- Cấu hình lịch học cố định theo thứ.
- Thêm buổi học phát sinh.
- Đổi lịch hoặc hủy lịch.
- Quản lý lịch học bù.
- Hiển thị lịch dạy hôm nay và lịch dạy tiếp theo.

### 3.4. Quản lý học viên

- Thêm nhanh học viên.
- Import từ Excel hoặc Google Sheet.
- Quản lý thông tin phụ huynh.
- Theo dõi lớp đang học.
- Theo dõi lịch sử điểm danh.
- Theo dõi lịch sử đóng học phí.

### 3.5. Thông báo Zalo và email

- Gửi nhắc lịch học.
- Gửi thông báo nghỉ hoặc đổi lịch.
- Gửi nhắc học phí.
- Gửi xác nhận thu tiền.
- Lưu lịch sử gửi thông báo.
- Cho phép tùy chỉnh nội dung mẫu.

### 3.6. Báo cáo nhanh

- Doanh thu theo ngày và tháng.
- Công nợ chưa thu.
- Số học viên đang học.
- Tỷ lệ đi học.
- Danh sách học viên nghỉ nhiều.
- Doanh thu theo lớp.
- Doanh thu theo giáo viên.

---

## 4. Đề xuất mô hình kỹ thuật

### 4.1. Kiến trúc tổng thể

```text
Người dùng
    |
    v
WebApp trên Subdomain
    |
    v
Google Apps Script API
    |
    v
Google Sheet của giáo viên hoặc trung tâm
```

### 4.2. Domain và hosting

- Sử dụng hosting hiện có trên Hostinger.
- Website chính tiếp tục chạy trên WordPress.
- WebApp quản lý được triển khai trên subdomain riêng.

Ví dụ:

```text
app.tenmiencuaban.com
```

hoặc:

```text
quanly.tenmiencuaban.com
```

### 4.3. Frontend

Có thể sử dụng:

- HTML, CSS và JavaScript thuần.
- ReactJS.
- VueJS.

Đối với phiên bản MVP, nên ưu tiên HTML, CSS và JavaScript hoặc VueJS để:

- Nhẹ.
- Chạy nhanh.
- Dễ triển khai.
- Dễ bảo trì.
- Phù hợp với Hostinger.

Không nên cài thêm một website WordPress riêng cho ứng dụng quản lý vì có thể:

- Làm hosting nặng hơn.
- Tăng rủi ro xung đột plugin.
- Khó tối ưu trải nghiệm dạng ứng dụng.
- Khó xử lý dữ liệu thời gian thực.

### 4.4. Backend

Sử dụng Google Apps Script để:

- Đọc và ghi dữ liệu Google Sheet.
- Xử lý đăng nhập và phân quyền cơ bản.
- Tính học phí.
- Tính công nợ.
- Ghi nhận điểm danh.
- Tạo báo cáo.
- Gửi email.
- Kết nối Zalo OA API nếu đủ điều kiện.

### 4.5. Database

Dữ liệu được lưu trên Google Sheet của chính giáo viên hoặc trung tâm.

Các tab dữ liệu đề xuất:

```text
Học viên
Lớp học
Lịch học
Điểm danh
Gói học phí
Thu học phí
Công nợ
Giáo viên
Thông báo
Cấu hình
```

---

## 5. Kế hoạch triển khai

### Bước 1. Xây dựng Google Sheet Template

Tạo sẵn một file Google Sheet mẫu gồm các tab:

- Học viên.
- Lớp học.
- Lịch học.
- Điểm danh.
- Thu học phí.
- Công nợ.
- Giáo viên.
- Cấu hình.

Các công thức và quy tắc cần có:

- Tính số buổi đã học.
- Tính số buổi còn lại.
- Tính học phí phát sinh.
- Tính số tiền đã thu.
- Tính số tiền còn nợ.
- Đối soát dữ liệu theo lớp và học viên.

### Bước 2. Xây dựng Google Apps Script Backend

Các API cần phát triển:

- Đăng nhập.
- Lấy danh sách học viên.
- Thêm hoặc sửa học viên.
- Lấy danh sách lớp.
- Tạo buổi học.
- Điểm danh.
- Thu học phí.
- Lấy dữ liệu công nợ.
- Lấy dữ liệu dashboard.
- Gửi email.
- Gửi thông báo Zalo.

### Bước 3. Xây dựng giao diện WebApp

Ưu tiên thiết kế Mobile-First.

Các màn hình MVP:

1. Đăng nhập.
2. Dashboard.
3. Danh sách lớp.
4. Chi tiết lớp.
5. Điểm danh.
6. Danh sách học viên.
7. Chi tiết học viên.
8. Thu học phí.
9. Danh sách công nợ.
10. Báo cáo doanh thu.
11. Cài đặt.

### Bước 4. Triển khai trên subdomain

- Tạo subdomain trên Hostinger.
- Upload frontend lên thư mục subdomain.
- Kết nối WebApp với Google Apps Script.
- Cấu hình HTTPS.
- Kiểm tra hiển thị trên:
  - Laptop.
  - Tablet.
  - Điện thoại.

### Bước 5. Đóng gói sản phẩm

Mỗi khách hàng có thể nhận:

- Một bản WebApp riêng.
- Một Google Sheet riêng.
- Một tài khoản quản trị.
- Tên miền hoặc subdomain riêng.
- Tài liệu hướng dẫn.
- Video hướng dẫn sử dụng.
- Gói hỗ trợ cài đặt ban đầu.

### Bước 6. Xây dựng hệ thống demo

- Tạo tài khoản demo.
- Chuẩn bị dữ liệu mẫu.
- Cho phép dùng thử trong 7 ngày.
- Đặt nút dùng thử trên landing page WordPress.
- Không cần nhúng iframe nếu có thể mở trực tiếp WebApp trên subdomain.

---

## 6. Mô hình kinh doanh đề xuất

### 6.1. Mô hình bán một lần

Thông điệp chính:

> Không cần trả phí phần mềm hàng tháng. Chỉ với chi phí tương đương khoảng hai buổi dạy thêm, thầy cô có thể sở hữu lâu dài một hệ thống quản lý lớp học chạy trên tên miền riêng.

Giá bán tham khảo:

```text
1.500.000 - 2.500.000 VNĐ
```

### 6.2. Các gói sản phẩm tham khảo

| Gói | Đối tượng | Nội dung |
|---|---|---|
| Cơ bản | Giáo viên cá nhân | Quản lý học viên, lớp học, điểm danh, học phí |
| Nâng cao | Nhóm giáo viên | Thêm phân quyền, báo cáo, thông báo email |
| Trung tâm nhỏ | Trung tâm có nhiều giáo viên | Phân quyền đầy đủ, Zalo OA, dashboard nâng cao |

### 6.3. Dịch vụ có thể thu phí bổ sung

- Cài đặt tên miền riêng.
- Thiết kế giao diện theo thương hiệu.
- Tích hợp Zalo OA.
- Tùy chỉnh báo cáo.
- Import dữ liệu cũ.
- Hỗ trợ kỹ thuật hàng năm.
- Nâng cấp chức năng theo yêu cầu.

---

## 7. Định vị sản phẩm

### 7.1. Lợi thế cạnh tranh

- Không mất phí thuê bao hàng tháng.
- Dữ liệu thuộc quyền sở hữu của giáo viên.
- Google Sheet dễ kiểm tra và sao lưu.
- Có thể sử dụng trên tên miền riêng.
- Giao diện tối ưu cho điện thoại.
- Chỉ tập trung vào chức năng thiết thực.
- Phù hợp với giáo viên và trung tâm nhỏ.
- Dễ triển khai và đào tạo sử dụng.

### 7.2. Thông điệp bán hàng cốt lõi

> Dữ liệu học sinh, phụ huynh và học phí được lưu trực tiếp trên Google Drive của thầy cô. Ngay cả khi nhà cung cấp ngừng hoạt động, thầy cô vẫn giữ toàn bộ dữ liệu và có thể tiếp tục sử dụng.

### 7.3. Một số thông điệp marketing tham khảo

- Quản lý lớp học đơn giản, không mất phí hàng tháng.
- Điểm danh một chạm, tính học phí tự động.
- Dữ liệu thuộc về thầy cô, không phụ thuộc nhà cung cấp.
- Sở hữu lâu dài với chi phí chỉ bằng vài buổi dạy thêm.
- Quản lý học viên và công nợ ngay trên điện thoại.
- WebApp riêng cho giáo viên và trung tâm nhỏ.

---

## 8. Đề xuất nội dung landing page

### Phần 1. Hero Section

**Tiêu đề:**

> Quản lý lớp học dễ dàng, không mất phí hàng tháng

**Mô tả:**

> Điểm danh, quản lý học phí, công nợ và lịch học ngay trên điện thoại. Dữ liệu được lưu trên Google Drive của chính thầy cô.

**CTA:**

- Dùng thử miễn phí.
- Xem bản demo.
- Nhận tư vấn.

### Phần 2. Vấn đề khách hàng đang gặp

- Quản lý học sinh bằng nhiều file Excel rời rạc.
- Mất thời gian tính học phí và công nợ.
- Dễ quên nhắc lịch hoặc thu học phí.
- Phần mềm hiện tại quá phức tạp.
- Không muốn trả phí hàng tháng.
- Lo lắng mất dữ liệu khi ngừng sử dụng phần mềm.

### Phần 3. Giải pháp

- Điểm danh một chạm.
- Tự động tính học phí.
- Quản lý công nợ.
- Nhắc lịch và nhắc học phí.
- Báo cáo doanh thu.
- Dữ liệu lưu trên Google Sheet riêng.

### Phần 4. Điểm khác biệt

| Phần mềm SaaS thông thường | Giải pháp đề xuất |
|---|---|
| Trả phí hàng tháng | Thanh toán một lần |
| Dữ liệu lưu trên hệ thống nhà cung cấp | Dữ liệu lưu trên Google Drive của khách hàng |
| Dễ bị khóa khi ngừng trả phí | Vẫn giữ toàn bộ dữ liệu |
| Nhiều chức năng phức tạp | Chỉ tập trung vào nhu cầu thiết thực |
| Dùng chung thương hiệu nhà cung cấp | Có thể chạy trên tên miền riêng |

### Phần 5. Kêu gọi hành động

> Bắt đầu quản lý lớp học chuyên nghiệp mà không cần đầu tư một hệ thống đắt đỏ.

CTA:

- Đăng ký dùng thử.
- Nhận báo giá.
- Xem hệ thống mẫu.

---

## 9. Phạm vi MVP đề xuất

Phiên bản đầu tiên nên tập trung vào:

1. Quản lý học viên.
2. Quản lý lớp học.
3. Điểm danh.
4. Quản lý lịch học.
5. Quản lý học phí.
6. Quản lý công nợ.
7. Dashboard tổng quan.
8. Báo cáo cơ bản.
9. Gửi email.
10. Phân quyền admin và giáo viên.

Các chức năng nên triển khai sau:

- Zalo OA.
- Hóa đơn điện tử.
- Thanh toán online.
- App mobile native.
- Báo cáo nâng cao.
- Phụ huynh đăng nhập.
- Học viên đăng nhập.
- Tích hợp chatbot.
- Tự động hóa marketing.

---

## 10. Kết luận

Mô hình **Self-hosted WebApp kết hợp Google Sheet Backend** phù hợp với giáo viên dạy thêm và trung tâm nhỏ vì:

- Chi phí phát triển và vận hành thấp.
- Không yêu cầu hạ tầng server phức tạp.
- Dễ đóng gói thành sản phẩm mua một lần.
- Người dùng sở hữu dữ liệu.
- Tối ưu cho nhu cầu thực tế.
- Có thể tạo lợi thế cạnh tranh rõ ràng trước các nền tảng SaaS thu phí định kỳ.

Điểm bán hàng quan trọng nhất cần được nhấn mạnh là:

> Thầy cô không chỉ mua một phần mềm quản lý lớp học, mà còn sở hữu toàn bộ dữ liệu và hệ thống vận hành của chính mình.
