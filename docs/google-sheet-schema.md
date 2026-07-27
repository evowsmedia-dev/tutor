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
