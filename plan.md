# Ke Hoach Xay Dung Du An Tutor

## Tom tat

Tutor la WebApp quan ly lop hoc cho giao vien day them va trung tam nho. Ung dung chay tren subdomain rieng, frontend deploy dang static site len Hostinger, backend dung Google Apps Script, du lieu luu trong Google Sheet cua tung khach hang.

MVP tap trung vao quan ly hoc vien, lop hoc, lich hoc, diem danh, hoc phi, cong no, dashboard, bao cao co ban, email va phan quyen admin/giao vien. Zalo OA, thanh toan online, hoa don dien tu va mobile app native se trien khai sau MVP.

## Kien truc

- Frontend: Vue 3 + Vite, mobile-first, co che demo local truoc khi noi API that.
- Backend: Google Apps Script Web App nhan request HTTP va doc/ghi Google Sheet.
- Database: Google Sheet template gom cac tab chuan hoa.
- Auth MVP: tai khoan quan tri/giao vien luu trong tab `GiaoVien`.
- Deploy: build thu muc `dist/`, upload len subdomain nhu `quanly.tenmien.com`.

## Cac buoc trien khai

1. Khoi tao project Vue 3 + Vite va theme UI mobile-first.
2. Tao schema Google Sheet template va tai lieu cot du lieu bat buoc.
3. Tao Google Apps Script backend voi response chuan `{ success, data, error }`.
4. Dung frontend bang du lieu demo va API client co the chuyen sang Apps Script URL.
5. Xay cac man hinh MVP: dang nhap, dashboard, lop hoc, diem danh, hoc vien, thu hoc phi, cong no, bao cao, cai dat.
6. Them flow email thong bao qua Apps Script.
7. Hoan thien phan quyen admin/giao vien.
8. Tao du lieu demo va checklist cai dat cho moi khach hang.
9. Build production va deploy len Hostinger.
10. Kiem thu tren mobile, tablet va desktop.

## Tieu chi nghiem thu MVP

- Dang nhap demo va xem dashboard duoc.
- Tao/loc/xem hoc vien va lop hoc duoc.
- Diem danh mot cham theo trang thai: co mat, vang, di muon, hoc bu, nghi co phep.
- Ghi nhan thu hoc phi va cap nhat cong no.
- Bao cao doanh thu, cong no va ty le di hoc hien thi dung theo du lieu.
- Giao dien khong vo tren man hinh dien thoai.
- Co file Apps Script de copy len Google Apps Script va cau hinh Google Sheet ID.

## Ghi chu

- Ban dau app chay o che do demo local de co the phat trien UI nhanh.
- Khi co Google Apps Script URL, dien `VITE_APPS_SCRIPT_URL` vao `.env` de frontend goi backend.
- Ten cot Google Sheet nen giu dung nhu tai lieu schema de Apps Script doc/ghi on dinh.
