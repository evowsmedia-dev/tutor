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
  parentReports: 'BaoCaoPhuHuynh',
  attendanceMedia: 'AttendanceMedia',
  notificationPreferences: 'NotificationPreferences',
  pushSubscriptions: 'PushSubscriptions',
  invoices: 'HoaDon',
  invoiceItems: 'HoaDonItems',
  expenses: 'ChiPhi',
  shareArtifacts: 'ShareArtifacts',
  parentLedger: 'SoLienLac',
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
      sendNotification,
      sendZaloMessage,
      sendZnsTemplate,
      enqueueNotification,
      processNotificationQueue,
      createParentReport,
      uploadStudentPhoto,
      saveAttendanceMedia,
      recordPhotoAttendance,
      createInvoiceDraft,
      createInvoice,
      getInvoiceHistory: () => listRows(SHEETS.invoices),
      createShareArtifact,
      getParentLedger,
      updateNotificationPreferences,
      getNotificationPreferences,
      registerPushSubscription,
      getNotificationHistory: () => listRows(SHEETS.notifications),
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

  const row = headers.map(header => data[header] === undefined || data[header] === null ? '' : data[header]);
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
  if (!user) throw new Error('Email hoặc mật khẩu không đúng');
  delete user.password;
  return user;
}

function markAttendance(data) {
  const checkedAt = new Date().toISOString();
  const records = data.records || [];
  records.forEach(record => {
    const shouldNotify = record.status === 'absent' || record.status === 'excused';
    upsertRow(SHEETS.attendance, {
      id: record.id || Utilities.getUuid(),
      sessionId: data.sessionId,
      classId: data.classId,
      studentId: record.studentId,
      status: record.status,
      checkedAt,
      source: record.source || 'tap',
      confidence: record.confidence || '',
      mediaId: record.mediaId || '',
      notifiedAt: '',
      notificationStatus: shouldNotify ? 'queued' : '',
      note: record.note || '',
    });
    if (shouldNotify) {
      enqueueNotification({
        type: 'absence_followup',
        studentId: record.studentId,
        classId: data.classId,
        reason: record.status === 'absent' ? 'Vắng học' : 'Nghỉ phép',
      });
    }
  });
  return { checkedAt, count: records.length };
}

function collectPayment(data) {
  const notificationId = data.notifyParent ? Utilities.getUuid() : '';
  const payment = upsertRow(SHEETS.payments, {
    id: data.id || Utilities.getUuid(),
    studentId: data.studentId,
    classId: data.classId,
    amount: data.amount,
    method: data.method || 'cash',
    paidAt: data.paidAt || new Date().toISOString().slice(0, 10),
    notifyParent: data.notifyParent ? 'TRUE' : 'FALSE',
    notificationId,
    note: data.note || '',
  });
  if (data.notifyParent) {
    sendNotification({
      type: 'confirm_paid',
      studentIds: [data.studentId],
      classId: data.classId,
      channels: data.channels || ['zalo', 'email'],
      amount: data.amount,
    });
  }
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

function sendNotification(data) {
  const students = listRows(SHEETS.students);
  const classes = listRows(SHEETS.classes);
  const targetIds = data.studentIds || [];
  const classItem = classes.find(item => item.id === data.classId) || {};
  const targets = targetIds.length
    ? students.filter(item => targetIds.indexOf(item.id) >= 0)
    : students.filter(item => String(item.classIds || '').split(',').indexOf(data.classId) >= 0);

  const results = targets.map(student => {
    const message = buildNotificationMessage(data.type, student, classItem, data);
    const result = deliverNotification(student, message, data.channels || ['zalo', 'email']);
    upsertRow(SHEETS.notifications, {
      id: Utilities.getUuid(),
      studentId: student.id,
      classId: data.classId || '',
      templateKey: data.type || '',
      channel: result.channel,
      recipient: result.recipient,
      payload: message,
      content: message,
      sentAt: new Date().toISOString(),
      status: result.status,
      error: result.error || '',
    });
    return result;
  });

  return { count: results.length, results };
}

function deliverNotification(student, message, channels) {
  const wantsZalo = channels.indexOf('zalo') >= 0;
  const wantsEmail = channels.indexOf('email') >= 0;
  const settings = getSettingsMap();

  if (wantsZalo && settings.ZALO_OA_ACCESS_TOKEN && student.zaloUserId && student.zaloFollowStatus === 'followed') {
    return sendZaloMessage({ userId: student.zaloUserId, message });
  }

  if (wantsZalo && settings.ZNS_ACCESS_TOKEN && settings.ZNS_TEMPLATE_ID && student.parentPhone && student.zaloConsentStatus === 'granted') {
    return sendZnsTemplate({ phone: student.parentPhone, message, templateId: settings.ZNS_TEMPLATE_ID });
  }

  if (wantsEmail && student.parentEmail) {
    MailApp.sendEmail({
      to: student.parentEmail,
      subject: 'Thông báo từ Rico Study',
      body: message,
    });
    return { channel: 'email', recipient: student.parentEmail, status: 'sent' };
  }

  return {
    channel: 'zalo_manual',
    recipient: student.parentPhone || student.parentEmail || '',
    status: 'manual',
    error: 'Chưa đủ cấu hình Zalo OA/ZNS hoặc email; cần gửi thủ công.',
  };
}

function sendZaloMessage(data) {
  const settings = getSettingsMap();
  if (!settings.ZALO_OA_ACCESS_TOKEN) {
    return { channel: 'zalo_oa', recipient: data.userId || '', status: 'failed', error: 'Missing ZALO_OA_ACCESS_TOKEN' };
  }
  const response = UrlFetchApp.fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
    method: 'post',
    contentType: 'application/json',
    headers: { access_token: settings.ZALO_OA_ACCESS_TOKEN },
    payload: JSON.stringify({
      recipient: { user_id: data.userId },
      message: { text: data.message },
    }),
    muteHttpExceptions: true,
  });
  const ok = response.getResponseCode() >= 200 && response.getResponseCode() < 300;
  return { channel: 'zalo_oa', recipient: data.userId, status: ok ? 'sent' : 'failed', error: ok ? '' : response.getContentText() };
}

function sendZnsTemplate(data) {
  const settings = getSettingsMap();
  if (!settings.ZNS_ACCESS_TOKEN || !settings.ZNS_TEMPLATE_ID) {
    return { channel: 'zns', recipient: data.phone || '', status: 'failed', error: 'Missing ZNS_ACCESS_TOKEN or ZNS_TEMPLATE_ID' };
  }
  return {
    channel: 'zns',
    recipient: data.phone,
    status: 'manual',
    error: 'ZNS template parameters must be finalized after template approval.',
  };
}

function enqueueNotification(data) {
  const id = data.id || Utilities.getUuid();
  upsertRow(SHEETS.notifications, {
    id,
    studentId: data.studentId || '',
    classId: data.classId || '',
    templateKey: data.type || '',
    channel: 'queue',
    recipient: '',
    payload: JSON.stringify(data),
    content: data.reason || '',
    sentAt: '',
    status: 'queued',
    error: '',
  });
  return { id, queued: true };
}

function processNotificationQueue() {
  const queued = listRows(SHEETS.notifications).filter(item => item.status === 'queued');
  const results = queued.map(item => sendNotification({
    type: item.templateKey,
    studentIds: [item.studentId],
    classId: item.classId,
    channels: ['zalo', 'email'],
  }));
  return { count: results.length, results };
}

function createParentReport(data) {
  const students = listRows(SHEETS.students);
  const classes = listRows(SHEETS.classes);
  const student = students.find(item => item.id === data.studentId);
  const classItem = classes.find(item => item.id === data.classId);
  if (!student || !classItem) throw new Error('Không tìm thấy học viên hoặc lớp học');

  const token = 'rico-' + Utilities.getUuid();
  const report = {
    id: Utilities.getUuid(),
    studentId: student.id,
    classId: classItem.id,
    token,
    summary: buildNotificationMessage('learning_report', student, classItem, data),
    expiresAt: data.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
  };
  upsertRow(SHEETS.parentReports, report);
  return report;
}

function uploadStudentPhoto(data) {
  if (!data.studentId) throw new Error('Missing studentId');
  const students = listRows(SHEETS.students);
  const student = students.find(item => item.id === data.studentId);
  if (!student) throw new Error('Không tìm thấy học viên');

  const photoUrl = data.photoUrl || '';
  upsertRow(SHEETS.students, {
    ...student,
    photoUrl,
    photoConsentStatus: data.photoConsentStatus || student.photoConsentStatus || 'pending',
    updatedAt: new Date().toISOString(),
  });
  return { studentId: data.studentId, photoUrl };
}

function saveAttendanceMedia(data) {
  const media = {
    id: data.id || Utilities.getUuid(),
    classId: data.classId || '',
    sessionId: data.sessionId || '',
    fileName: data.fileName || '',
    fileUrl: data.fileUrl || '',
    capturedAt: data.capturedAt || new Date().toISOString(),
    matchedStudentIds: Array.isArray(data.matchedStudentIds) ? data.matchedStudentIds.join(',') : (data.matchedStudentIds || ''),
    reviewStudentIds: Array.isArray(data.reviewStudentIds) ? data.reviewStudentIds.join(',') : (data.reviewStudentIds || ''),
    status: data.status || 'review',
    resultJson: JSON.stringify(data.result || {}),
  };
  upsertRow(SHEETS.attendanceMedia, media);
  return media;
}

function recordPhotoAttendance(data) {
  const media = saveAttendanceMedia(data.media || data);
  const records = (data.records || []).map(record => ({
    ...record,
    id: record.id || Utilities.getUuid(),
    source: record.source || 'photo',
    confidence: record.confidence || '',
    mediaId: media.id,
  }));
  const attendance = markAttendance({
    sessionId: data.sessionId,
    classId: data.classId,
    records,
  });
  return { media, attendance };
}

function createInvoiceDraft(data) {
  const students = listRows(SHEETS.students);
  const classes = listRows(SHEETS.classes);
  const student = students.find(item => item.id === data.studentId) || {};
  const classItem = classes.find(item => item.id === data.classId) || {};
  return {
    studentId: student.id || '',
    classId: classItem.id || '',
    period: data.period || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/yyyy'),
    amount: Number(data.amount || classItem.feeAmount || student.remainingAmount || 0),
    discount: Number(data.discount || 0),
    template: data.template || 'Rico hồng',
    notifyParent: data.notifyParent !== false,
  };
}

function createInvoice(data) {
  const draft = createInvoiceDraft(data);
  const invoice = upsertRow(SHEETS.invoices, {
    id: data.id || Utilities.getUuid(),
    studentId: draft.studentId,
    classId: draft.classId,
    period: draft.period,
    amount: Math.max(0, draft.amount - draft.discount),
    discount: draft.discount,
    template: draft.template,
    status: data.status || 'unpaid',
    createdAt: new Date().toISOString(),
    notificationId: '',
  });

  upsertRow(SHEETS.invoiceItems, {
    id: Utilities.getUuid(),
    invoiceId: invoice.id || data.id || '',
    name: data.itemName || 'Học phí',
    amount: Math.max(0, draft.amount - draft.discount),
    note: data.note || '',
  });

  if (draft.notifyParent) {
    sendNotification({
      type: 'remind_fee',
      studentIds: [draft.studentId],
      classId: draft.classId,
      amount: Math.max(0, draft.amount - draft.discount),
      channels: data.channels || ['zalo', 'email'],
    });
  }

  return invoice;
}

function createShareArtifact(data) {
  const artifact = {
    id: data.id || Utilities.getUuid(),
    type: data.type || '',
    studentId: data.studentId || '',
    classId: data.classId || '',
    title: data.title || 'Thông báo Rico Study',
    content: data.content || '',
    fileUrl: data.fileUrl || '',
    format: data.format || 'png',
    createdAt: new Date().toISOString(),
    sharedAt: data.sharedAt || '',
    status: data.status || 'created',
  };
  upsertRow(SHEETS.shareArtifacts, artifact);
  return artifact;
}

function getParentLedger(data) {
  const rows = listRows(SHEETS.parentLedger).filter(item => {
    if (data.studentId && item.studentId !== data.studentId) return false;
    return !data.token || item.token === data.token;
  });
  return rows;
}

function updateNotificationPreferences(data) {
  const prefs = data.preferences || {};
  Object.keys(prefs).forEach(key => {
    upsertRow(SHEETS.notificationPreferences, {
      id: data.userId + '_' + key,
      userId: data.userId || '',
      type: key,
      enabled: prefs[key] ? 'TRUE' : 'FALSE',
      reminderMinutes: data.reminderMinutes || '',
      updatedAt: new Date().toISOString(),
    });
  });
  return getNotificationPreferences({ userId: data.userId });
}

function getNotificationPreferences(data) {
  return listRows(SHEETS.notificationPreferences).filter(item => !data.userId || item.userId === data.userId);
}

function registerPushSubscription(data) {
  const subscription = {
    id: data.id || Utilities.getUuid(),
    userId: data.userId || '',
    endpoint: data.endpoint || '',
    p256dh: data.keys && data.keys.p256dh ? data.keys.p256dh : (data.p256dh || ''),
    auth: data.keys && data.keys.auth ? data.keys.auth : (data.auth || ''),
    userAgent: data.userAgent || '',
    active: data.active === false ? 'FALSE' : 'TRUE',
    preferencesJson: JSON.stringify(data.preferences || {}),
    updatedAt: new Date().toISOString(),
  };
  upsertRow(SHEETS.pushSubscriptions, subscription);
  return subscription;
}

function buildNotificationMessage(type, student, classItem, data) {
  const templates = getSettingsMap();
  const defaults = {
    remind_class: 'Chào anh/chị, {ten_hoc_sinh} có lịch học lớp {ten_lop} vào {gio_hoc} hôm nay. Mong bé đi học đúng giờ ạ!',
    reschedule: 'Rico Study xin thông báo buổi học lớp {ten_lop} ngày {ngay} sẽ được đổi lịch.',
    remind_fee: 'Chào anh/chị, học phí lớp {ten_lop} của {ten_hoc_sinh} còn {so_tien}. Anh/chị vui lòng thanh toán giúp Rico Study ạ.',
    confirm_paid: 'Rico Study đã nhận {so_tien} học phí của {ten_hoc_sinh} lớp {ten_lop}. Cảm ơn anh/chị ạ!',
    learning_report: 'Tóm tắt học tập của {ten_hoc_sinh}: chuyên cần {ty_le_chuyen_can}, buổi vắng {so_buoi_vang}, công nợ {so_tien}. Lịch học tiếp theo: {gio_hoc}.',
    absence_followup: 'Chào anh/chị, hôm nay {ten_hoc_sinh} vắng lớp {ten_lop}. Rico Study gửi anh/chị thông tin để tiện theo dõi ạ.',
  };
  const template = templates['TPL_' + type] || defaults[type] || defaults.remind_class;
  return template
    .replaceAll('{ten_hoc_sinh}', student.name || '')
    .replaceAll('{ten_lop}', classItem.name || '')
    .replaceAll('{gio_hoc}', classItem.time || classItem.scheduleText || '')
    .replaceAll('{so_tien}', formatVnd(data.amount || student.remainingAmount || 0))
    .replaceAll('{ngay}', new Date().toLocaleDateString('vi-VN'))
    .replaceAll('{ty_le_chuyen_can}', data.attendanceRate || '100%')
    .replaceAll('{so_buoi_vang}', data.absentCount || '0');
}

function getSettingsMap() {
  return listRows(SHEETS.settings).reduce((map, item) => {
    map[item.key] = item.value;
    return map;
  }, {});
}

function formatVnd(value) {
  return Number(value || 0).toLocaleString('vi-VN') + 'đ';
}
