# Google Sheet Schema

Google Sheet cua moi khach hang can co cac tab sau. Cot `id` nen la chuoi duy nhat, vi du `stu_001`, `cls_001`.

## HocVien

| Cot | Mo ta |
|---|---|
| id | Ma hoc vien |
| name | Ho ten hoc vien |
| phone | So dien thoai hoc vien |
| parentName | Ten phu huynh |
| parentPhone | So dien thoai phu huynh |
| email | Email phu huynh/hoc vien |
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
| templateKey | Mau tin |
| content | Noi dung |
| sentAt | Thoi diem gui |
| status | sent, failed |

## CauHinh

| Cot | Mo ta |
|---|---|
| key | Khoa cau hinh |
| value | Gia tri |
| note | Ghi chu |
