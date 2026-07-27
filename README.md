# Tutor Class Manager

WebApp quan ly lop hoc cho giao vien day them va trung tam nho. Frontend dung Vue 3 + Vite, backend du kien dung Google Apps Script, du lieu luu tren Google Sheet rieng cua tung khach hang.

## Chay local

```bash
npm install
npm run dev
```

Mo app tai:

```text
http://localhost:5173/
```

Tai khoan demo:

```text
admin@tutor.local / 123456
```

## Build production

```bash
npm run build
```

Thu muc `dist/` la ban static co the upload len subdomain Hostinger.

## Cau hinh Google Apps Script

1. Tao Google Sheet theo schema trong `docs/google-sheet-schema.md`.
2. Tao Apps Script project va copy noi dung `apps-script/Code.gs`.
3. Them script property:

```text
SPREADSHEET_ID=<Google Sheet ID>
```

4. Deploy Apps Script dang Web App.
5. Tao file `.env` tu `.env.example` va dien:

```text
VITE_APPS_SCRIPT_URL=<Apps Script Web App URL>
```

6. Build lai frontend va deploy thu muc `dist/`.

## Trang thai hien tai

- Da co MVP frontend chay demo local.
- Da co schema Google Sheet va backend Apps Script mau.
- Chua ket noi API that vao frontend.
- Chua tich hop Zalo OA, thanh toan online, hoa don dien tu.
