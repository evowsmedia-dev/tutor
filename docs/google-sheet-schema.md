# Google Sheet Schema - Rico Study

Google Sheet cua moi khach hang can co cac tab sau. Cot `id` nen la chuoi duy nhat, vi du `stu_001`, `cls_001`.

## HocVien

| Cot | Mo ta |
|---|---|
| id | Ma hoc vien |
| name | Ho ten hoc vien |
| phone | So dien thoai hoc vien |
| parentName | Tên phụ huynh |
| parentPhone | Số điện thoại phụ huynh |
| parentEmail | Email phụ huynh |
| zaloUserId | Zalo OA follower/user ID nếu phụ huynh đã quan tâm OA |
| zaloFollowStatus | followed, not_followed, unknown |
| zaloConsentStatus | granted, pending, denied |
| photoUrl | Ảnh đại diện dùng cho điểm danh ảnh |
| photoConsentStatus | granted, pending, denied |
| lastNotifiedAt | Lần gần nhất gửi thông báo phụ huynh |
| email | Email phụ huynh/học viên, giữ để tương thích dữ liệu cũ |
| classIds | Danh sach ma lop, phan tach bang dau phay |
| status | active, paused, archived |
| note | Ghi chu |

## LopHoc

| Cot | Mo ta |
|---|---|
| id | Ma lop |
| name | Ten lop |
| teacherId | Giao vien phu trach |
| scheduleText | Lich hoc hien thi |
| feeType | per_session, monthly, combo, course |
| feeAmount | Hoc phi |
| colorKey | peach, mint, sky, lavender, butter, rose |
| weeklyScheduleJson | Lịch học tuần dạng JSON, ví dụ `[{"day":"T2","start":"18:00","end":"19:30"}]` |
| description | Mô tả lớp |
| status | active, paused, archived |

## LichHoc

| Cot | Mo ta |
|---|---|
| id | Ma buoi hoc |
| classId | Ma lop |
| date | Ngay hoc ISO yyyy-mm-dd |
| startTime | Gio bat dau |
| endTime | Gio ket thuc |
| status | scheduled, changed, cancelled, completed |
| note | Ghi chu |

## DiemDanh

| Cot | Mo ta |
|---|---|
| id | Ma diem danh |
| sessionId | Ma buoi hoc |
| classId | Ma lop |
| studentId | Ma hoc vien |
| status | present, absent, late, makeup, excused |
| checkedAt | Thoi diem ghi nhan |
| source | tap, photo, photo_review |
| confidence | Độ tin cậy khi ghi nhận bằng ảnh |
| mediaId | Liên kết tới AttendanceMedia nếu có |
| notifiedAt | Thời điểm đã nhắn phụ huynh nếu vắng/nghỉ phép |
| notificationStatus | queued, sent, manual, failed |
| note | Ghi chu |

## ThuHocPhi

| Cot | Mo ta |
|---|---|
| id | Ma phieu thu |
| studentId | Ma hoc vien |
| classId | Ma lop |
| amount | So tien da thu |
| method | cash, bank, other |
| paidAt | Ngay thu |
| notifyParent | TRUE/FALSE, tự gửi xác nhận cho phụ huynh |
| notificationId | Mã thông báo xác nhận đã thu |
| note | Ghi chu |

## CongNo

| Cot | Mo ta |
|---|---|
| id | Ma cong no |
| studentId | Ma hoc vien |
| classId | Ma lop |
| expectedAmount | So tien can thu |
| paidAmount | So tien da thu |
| remainingAmount | So tien con no |
| dueDate | Han thu |
| status | open, partial, paid |

## GiaoVien

| Cot | Mo ta |
|---|---|
| id | Ma giao vien |
| name | Ho ten |
| email | Email dang nhap |
| password | Mat khau MVP |
| role | admin, teacher |
| classIds | Lop duoc phan cong |

## ThongBao

| Cot | Mo ta |
|---|---|
| id | Ma thong bao |
| channel | email, zalo |
| recipient | Nguoi nhan |
| studentId | Mã học viên liên quan |
| classId | Mã lớp liên quan |
| templateKey | Mau tin |
| payload | Nội dung/payload gửi qua API |
| content | Noi dung |
| sentAt | Thoi diem gui |
| status | queued, sent, manual, failed |
| error | Lỗi nếu gửi thất bại hoặc cần gửi thủ công |

## AttendanceMedia

| Cot | Mo ta |
|---|---|
| id | Mã ảnh điểm danh |
| classId | Mã lớp |
| sessionId | Mã buổi học |
| fileName | Tên file ảnh |
| fileUrl | Link ảnh lưu trên Drive/storage |
| capturedAt | Thời điểm chụp/tải ảnh |
| matchedStudentIds | Danh sách học sinh đã nhận diện, phân tách bằng dấu phẩy |
| reviewStudentIds | Danh sách cần giáo viên xác nhận |
| status | matched, review, failed |
| resultJson | Kết quả nhận diện chi tiết |

## NotificationPreferences

| Cot | Mo ta |
|---|---|
| id | userId_type |
| userId | Mã tài khoản giáo viên |
| type | classReminder, monthlyDebt, absenceRisk |
| enabled | TRUE/FALSE |
| reminderMinutes | Số phút nhắc trước giờ dạy |
| updatedAt | Thời điểm cập nhật |

## PushSubscriptions

| Cot | Mo ta |
|---|---|
| id | Mã subscription |
| userId | Mã tài khoản giáo viên |
| endpoint | Web Push endpoint |
| p256dh | Push key p256dh |
| auth | Push auth secret |
| userAgent | Thiết bị/trình duyệt |
| active | TRUE/FALSE |
| preferencesJson | Cấu hình thông báo dạng JSON |
| updatedAt | Thời điểm cập nhật |

## HoaDon

| Cot | Mo ta |
|---|---|
| id | Mã hóa đơn/phiếu học phí |
| studentId | Mã học sinh |
| classId | Mã lớp |
| period | Kỳ thu phí |
| amount | Số tiền sau giảm trừ |
| discount | Số tiền giảm trừ |
| template | Mẫu phiếu |
| status | unpaid, partial, paid, cancelled |
| createdAt | Thời điểm tạo |
| notificationId | Mã thông báo phụ huynh nếu có |

## HoaDonItems

| Cot | Mo ta |
|---|---|
| id | Mã dòng phí |
| invoiceId | Mã hóa đơn |
| name | Tên khoản phí |
| amount | Số tiền |
| note | Ghi chú |

## ChiPhi

| Cot | Mo ta |
|---|---|
| id | Mã chi phí |
| name | Tên khoản chi |
| amount | Số tiền |
| date | Ngày chi |
| note | Ghi chú |

## ShareArtifacts

| Cot | Mo ta |
|---|---|
| id | Mã thẻ chia sẻ |
| type | arrival, absence_followup, payment, invoice, learning_report |
| studentId | Mã học sinh |
| classId | Mã lớp |
| title | Tiêu đề thẻ |
| content | Nội dung text |
| fileUrl | Link ảnh/PDF nếu đã lưu |
| format | png, pdf |
| createdAt | Thời điểm tạo |
| sharedAt | Thời điểm share/gửi |
| status | created, shared, failed |

## SoLienLac

| Cot | Mo ta |
|---|---|
| id | Mã sổ liên lạc |
| studentId | Mã học sinh |
| token | Token link phụ huynh |
| attendanceSummary | Tóm tắt chuyên cần |
| scheduleSummary | Lịch học tiếp theo |
| sessionJournal | Nhật ký buổi học |
| feeSummary | Công nợ/học phí |
| teacherNote | Ghi chú giáo viên |
| createdAt | Thời điểm tạo |

## BaoCaoPhuHuynh

| Cot | Mo ta |
|---|---|
| id | Mã báo cáo |
| studentId | Mã học viên |
| classId | Mã lớp |
| token | Token link phụ huynh |
| summary | Nội dung tóm tắt học tập |
| expiresAt | Ngày hết hạn link |
| createdAt | Thời điểm tạo |

## CauHinh

| Cot | Mo ta |
|---|---|
| key | Khoa cau hinh |
| value | Gia tri |
| note | Ghi chu |

Các khóa cấu hình khuyến nghị:

```text
ZALO_OA_ACCESS_TOKEN
ZNS_ACCESS_TOKEN
ZNS_TEMPLATE_ID
TPL_remind_class
TPL_reschedule
TPL_remind_fee
TPL_confirm_paid
TPL_learning_report
TPL_absence_followup
```
