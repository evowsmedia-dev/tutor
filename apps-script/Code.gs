const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');

const SHEETS = {
  students: 'HocVien',
  classes: 'LopHoc',
  schedules: 'LichHoc',
  attendance: 'DiemDanh',
  payments: 'ThuHocPhi',
  debts: 'CongNo',
  teachers: 'GiaoVien',
  notifications: 'ThongBao',
  settings: 'CauHinh',
};

function doGet(event) {
  return handleRequest(event);
}

function doPost(event) {
  return handleRequest(event);
}

function handleRequest(event) {
  try {
    const payload = parsePayload(event);
    const action = payload.action || event.parameter.action;
    const data = payload.data || {};

    const routes = {
      login,
      dashboard: getDashboard,
      listStudents: () => listRows(SHEETS.students),
      saveStudent: () => upsertRow(SHEETS.students, data),
      listClasses: () => listRows(SHEETS.classes),
      saveClass: () => upsertRow(SHEETS.classes, data),
      listSchedules: () => listRows(SHEETS.schedules),
      saveSchedule: () => upsertRow(SHEETS.schedules, data),
      markAttendance,
      collectPayment,
      listDebts: () => listRows(SHEETS.debts),
      listPayments: () => listRows(SHEETS.payments),
      sendEmailNotification,
    };

    if (!routes[action]) {
      throw new Error('Unknown action: ' + action);
    }

    return jsonResponse({ success: true, data: routes[action](data) });
  } catch (error) {
    return jsonResponse({ success: false, data: null, error: error.message });
  }
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) return {};
  return JSON.parse(event.postData.contents);
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  if (!SPREADSHEET_ID) throw new Error('Missing SPREADSHEET_ID script property');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getSheet(name) {
  const sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  return sheet;
}

function listRows(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).filter(row => row.some(Boolean)).map(row => {
    return headers.reduce((record, header, index) => {
      record[header] = row[index];
      return record;
    }, {});
  });
}

function upsertRow(sheetName, data) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex < 0) throw new Error(sheetName + ' must have an id column');

  const row = headers.map(header => data[header] || '');
  const existingIndex = values.findIndex((item, index) => index > 0 && item[idIndex] === data.id);

  if (existingIndex > 0) {
    sheet.getRange(existingIndex + 1, 1, 1, headers.length).setValues([row]);
  } else {
    row[idIndex] = data.id || Utilities.getUuid();
    sheet.appendRow(row);
  }

  return data;
}

function login(data) {
  const teachers = listRows(SHEETS.teachers);
  const user = teachers.find(item => item.email === data.email && item.password === data.password);
  if (!user) throw new Error('Email hoac mat khau khong dung');
  delete user.password;
  return user;
}

function markAttendance(data) {
  const checkedAt = new Date().toISOString();
  const records = data.records || [];
  records.forEach(record => {
    upsertRow(SHEETS.attendance, {
      id: record.id || Utilities.getUuid(),
      sessionId: data.sessionId,
      classId: data.classId,
      studentId: record.studentId,
      status: record.status,
      checkedAt,
      note: record.note || '',
    });
  });
  return { checkedAt, count: records.length };
}

function collectPayment(data) {
  const payment = upsertRow(SHEETS.payments, {
    id: data.id || Utilities.getUuid(),
    studentId: data.studentId,
    classId: data.classId,
    amount: data.amount,
    method: data.method || 'cash',
    paidAt: data.paidAt || new Date().toISOString().slice(0, 10),
    note: data.note || '',
  });
  return payment;
}

function getDashboard() {
  const students = listRows(SHEETS.students);
  const classes = listRows(SHEETS.classes);
  const debts = listRows(SHEETS.debts);
  const payments = listRows(SHEETS.payments);
  const revenue = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const debt = debts.reduce((sum, item) => sum + Number(item.remainingAmount || 0), 0);
  return {
    activeStudents: students.filter(item => item.status === 'active').length,
    activeClasses: classes.filter(item => item.status === 'active').length,
    revenue,
    debt,
  };
}

function sendEmailNotification(data) {
  MailApp.sendEmail({
    to: data.to,
    subject: data.subject,
    body: data.body,
  });
  upsertRow(SHEETS.notifications, {
    id: Utilities.getUuid(),
    channel: 'email',
    recipient: data.to,
    templateKey: data.templateKey || '',
    content: data.body,
    sentAt: new Date().toISOString(),
    status: 'sent',
  });
  return { sent: true };
}
