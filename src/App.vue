<script setup>
import { computed, reactive } from 'vue';

const appScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL || '';
const todayIso = new Date().toISOString().slice(0, 10);

const navItems = [
  { id: 'dashboard', label: 'Tổng quan', short: 'Tổng quan', icon: 'Home' },
  { id: 'students', label: 'Học viên', short: 'Học viên', icon: 'GraduationCap' },
  { id: 'classes', label: 'Lớp học', short: 'Lớp', icon: 'School' },
  { id: 'attendance', label: 'Điểm danh', short: 'Điểm danh', icon: 'ClipboardCheck' },
  { id: 'fees', label: 'Học phí & Công nợ', short: 'Học phí', icon: 'WalletCards' },
  { id: 'reports', label: 'Báo cáo', short: 'Báo cáo', icon: 'ChartNoAxesColumnIncreasing' },
  { id: 'notify', label: 'Thông báo', short: 'Tin nhắn', icon: 'MessageCircle' },
  { id: 'settings', label: 'Cài đặt', short: 'Cài đặt', icon: 'Settings' },
];

const bottomNav = ['dashboard', 'classes', 'attendance', 'fees', 'notify'];

const attendanceStatuses = [
  { id: 'present', label: 'Có mặt', icon: 'Check' },
  { id: 'absent', label: 'Vắng', icon: 'X' },
  { id: 'late', label: 'Muộn', icon: 'Clock' },
  { id: 'makeup', label: 'Học bù', icon: 'RotateCcw' },
  { id: 'excused', label: 'Nghỉ phép', icon: 'FileText' },
];

const notificationTypes = [
  { id: 'remind_class', label: 'Nhắc lịch học' },
  { id: 'reschedule', label: 'Thông báo nghỉ / đổi lịch' },
  { id: 'remind_fee', label: 'Nhắc học phí' },
  { id: 'confirm_paid', label: 'Xác nhận đã thu học phí' },
  { id: 'learning_report', label: 'Tóm tắt học tập' },
  { id: 'absence_followup', label: 'Trao đổi khi vắng học' },
];

const feePackages = [
  { id: 'fee_001', name: 'Toán 6 - Theo tháng', type: 'Theo tháng', price: 900000 },
  { id: 'fee_002', name: 'Anh văn giao tiếp - Combo 10 buổi', type: 'Theo combo', price: 1800000, sessions: 10 },
  { id: 'fee_003', name: 'Lý 9 nâng cao - Theo buổi', type: 'Theo buổi', price: 150000 },
  { id: 'fee_004', name: 'Văn 7 - Trọn khóa', type: 'Theo khóa', price: 3200000 },
];

const state = reactive({
  isAuthenticated: false,
  activeView: 'dashboard',
  selectedClassId: 'cls_001',
  attendanceDate: todayIso,
  studentSearch: '',
  modal: null,
  toast: '',
  notifyType: 'remind_class',
  notifyClassId: 'cls_001',
  notifyAudience: 'class',
  notifyChannels: { zalo: true, email: true },
  login: { email: 'admin@ricostudy.vn', password: '123456' },
  user: { name: 'Cô Hạnh', role: 'admin', initials: 'CH', email: 'admin@ricostudy.vn' },
  settings: {
    sheetConnected: true,
    sheetId: '1F8x-RicoStudy-Demo-2026',
    zaloConnected: false,
    znsConnected: false,
    emailConnected: true,
  },
  templates: {
    remind_class: 'Chào anh/chị, {ten_hoc_sinh} có lịch học lớp {ten_lop} vào {gio_hoc} hôm nay. Mong bé sắp xếp đi học đúng giờ ạ!',
    reschedule: 'Rico Study xin thông báo buổi học lớp {ten_lop} ngày {ngay} sẽ được đổi lịch. Trung tâm sẽ báo lịch học bù sớm nhất ạ.',
    remind_fee: 'Chào anh/chị, học phí lớp {ten_lop} của {ten_hoc_sinh} còn {so_tien}. Anh/chị vui lòng thanh toán giúp Rico Study ạ.',
    confirm_paid: 'Rico Study đã nhận {so_tien} học phí của {ten_hoc_sinh} lớp {ten_lop}. Cảm ơn anh/chị đã tin tưởng ạ!',
    learning_report: 'Tóm tắt học tập của {ten_hoc_sinh}: chuyên cần {ty_le_chuyen_can}, buổi vắng {so_buoi_vang}, công nợ {so_tien}. Lịch học tiếp theo: {gio_hoc}.',
    absence_followup: 'Chào anh/chị, hôm nay {ten_hoc_sinh} vắng lớp {ten_lop}. Rico Study gửi anh/chị thông tin để tiện theo dõi và hỗ trợ bé ạ.',
  },
  teachers: [
    { id: 'tea_001', name: 'Cô Hạnh', role: 'admin', initials: 'CH', classIds: ['cls_001', 'cls_003'] },
    { id: 'tea_002', name: 'Thầy Nam', role: 'teacher', initials: 'TN', classIds: ['cls_002'] },
    { id: 'tea_003', name: 'Cô Thảo', role: 'teacher', initials: 'CT', classIds: ['cls_004'] },
  ],
  classes: [
    { id: 'cls_001', name: 'Toán 6A', icon: 'Calculator', tone: 'violet', teacherId: 'tea_001', schedule: ['T2', 'T4', 'T6'], time: '18:00 - 19:30', feePackageId: 'fee_001', studentIds: ['stu_001', 'stu_002', 'stu_003', 'stu_004'], status: 'active' },
    { id: 'cls_002', name: 'Anh văn giao tiếp', icon: 'MessagesSquare', tone: 'mint', teacherId: 'tea_002', schedule: ['T3', 'T5'], time: '19:00 - 20:30', feePackageId: 'fee_002', studentIds: ['stu_002', 'stu_005', 'stu_006'], status: 'active' },
    { id: 'cls_003', name: 'Lý 9 nâng cao', icon: 'FlaskConical', tone: 'sky', teacherId: 'tea_001', schedule: ['T7'], time: '08:00 - 10:00', feePackageId: 'fee_003', studentIds: ['stu_003', 'stu_007', 'stu_008', 'stu_001'], status: 'active' },
    { id: 'cls_004', name: 'Văn 7B', icon: 'BookOpen', tone: 'sun', teacherId: 'tea_003', schedule: ['T2', 'T5'], time: '17:00 - 18:30', feePackageId: 'fee_004', studentIds: ['stu_004', 'stu_006', 'stu_009'], status: 'active' },
  ],
  students: [
    { id: 'stu_001', name: 'Nguyễn Minh An', parentName: 'Anh Nguyễn Văn Bình', parentPhone: '0901 234 567', parentEmail: 'binh@example.com', zaloUserId: 'zalo_001', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', paid: 900000, due: 900000, note: 'Tập trung tốt, cần luyện trình bày.' },
    { id: 'stu_002', name: 'Trần Bảo Châu', parentName: 'Chị Trần Thị Hoa', parentPhone: '0912 345 678', parentEmail: 'hoa@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'granted', paid: 1200000, due: 1800000, note: 'Nên ôn từ vựng mỗi ngày.' },
    { id: 'stu_003', name: 'Lê Gia Bảo', parentName: 'Anh Lê Văn Cường', parentPhone: '0987 654 321', parentEmail: 'cuong@example.com', zaloUserId: 'zalo_003', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', paid: 900000, due: 1050000, note: 'Vắng 1 buổi trong tuần này.' },
    { id: 'stu_004', name: 'Phạm Thảo My', parentName: 'Chị Phạm Thị Lan', parentPhone: '0977 888 999', parentEmail: 'lan@example.com', zaloUserId: '', zaloFollowStatus: 'unknown', zaloConsentStatus: 'pending', paid: 3200000, due: 4100000, note: 'Cần nhắc bài tập về nhà.' },
    { id: 'stu_005', name: 'Vũ Đăng Khoa', parentName: 'Anh Vũ Đình Khoa', parentPhone: '0933 111 222', parentEmail: 'khoa@example.com', zaloUserId: 'zalo_005', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', paid: 1800000, due: 1800000, note: 'Hoàn thành tốt bài nói.' },
    { id: 'stu_006', name: 'Đỗ Hạnh Nguyên', parentName: 'Chị Đỗ Thị Nga', parentPhone: '0966 222 333', parentEmail: 'nga@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'granted', paid: 600000, due: 1800000, note: 'Đi học chưa đều.' },
    { id: 'stu_007', name: 'Hoàng Anh Tuấn', parentName: 'Anh Hoàng Văn Tú', parentPhone: '0944 555 666', parentEmail: 'tu@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'pending', paid: 150000, due: 450000, note: 'Cần trao đổi thêm với phụ huynh.' },
    { id: 'stu_008', name: 'Bùi Ngọc Diệp', parentName: 'Chị Bùi Thị Diễm', parentPhone: '0922 777 888', parentEmail: 'diem@example.com', zaloUserId: 'zalo_008', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', paid: 450000, due: 450000, note: 'Học ổn định.' },
    { id: 'stu_009', name: 'Ngô Quốc Đạt', parentName: 'Anh Ngô Văn Đức', parentPhone: '0955 999 000', parentEmail: 'duc@example.com', zaloUserId: '', zaloFollowStatus: 'unknown', zaloConsentStatus: 'pending', paid: 3200000, due: 3200000, note: 'Đọc hiểu tốt.' },
  ],
  attendance: {
    [`cls_001|${todayIso}`]: {
      stu_001: { status: 'present', notifiedAt: '', notificationStatus: '' },
      stu_002: { status: 'present', notifiedAt: '', notificationStatus: '' },
      stu_003: { status: 'absent', notifiedAt: '', notificationStatus: 'queued' },
      stu_004: { status: 'late', notifiedAt: '', notificationStatus: '' },
    },
  },
  payments: [
    { id: 'pay_001', studentId: 'stu_001', classId: 'cls_001', amount: 900000, method: 'bank', paidAt: '2026-07-12', notifyParent: true, notificationId: 'noti_001' },
    { id: 'pay_002', studentId: 'stu_005', classId: 'cls_002', amount: 1800000, method: 'cash', paidAt: '2026-07-15', notifyParent: true, notificationId: 'noti_002' },
  ],
  notificationLog: [
    { id: 'noti_001', type: 'Xác nhận thu tiền', target: 'Nguyễn Minh An', channel: 'Zalo OA', status: 'sent', time: '12/07/2026', error: '' },
    { id: 'noti_002', type: 'Xác nhận thu tiền', target: 'Vũ Đăng Khoa', channel: 'Zalo OA', status: 'sent', time: '15/07/2026', error: '' },
  ],
  notificationQueue: [
    { id: 'queue_001', type: 'absence_followup', studentId: 'stu_003', classId: 'cls_001', reason: 'Vắng học hôm nay', createdAt: todayIso },
  ],
  parentReports: [],
});

const activeNav = computed(() => navItems.find(item => item.id === state.activeView) || navItems[0]);
const activeClass = computed(() => state.classes.find(item => item.id === state.selectedClassId) || state.classes[0]);
const activeAttendanceKey = computed(() => `${activeClass.value.id}|${state.attendanceDate}`);
const activeAttendance = computed(() => state.attendance[activeAttendanceKey.value] || {});
const classStudents = computed(() => activeClass.value.studentIds.map(studentById).filter(Boolean));
const filteredStudents = computed(() => {
  const query = state.studentSearch.trim().toLowerCase();
  if (!query) return state.students;
  return state.students.filter(student => `${student.name} ${student.parentName} ${student.parentPhone}`.toLowerCase().includes(query));
});
const todayClasses = computed(() => {
  const day = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date().getDay()];
  return state.classes.filter(item => item.schedule.includes(day));
});
const selectedNotifyClass = computed(() => state.classes.find(item => item.id === state.notifyClassId) || state.classes[0]);
const notificationPreview = computed(() => buildTemplate(state.notifyType, selectedNotifyClass.value, firstStudentInClass(selectedNotifyClass.value)));
const dashboard = computed(() => {
  const totalPaid = state.students.reduce((sum, item) => sum + item.paid, 0);
  const totalDebt = state.students.reduce((sum, item) => sum + Math.max(0, item.due - item.paid), 0);
  const absentToday = attendanceRows.value.filter(item => ['absent', 'excused'].includes(item.status));
  return { totalPaid, totalDebt, absentToday, classesToday: todayClasses.value.length };
});
const attendanceRows = computed(() => {
  return state.classes.flatMap(classItem => {
    const records = state.attendance[`${classItem.id}|${todayIso}`] || {};
    return Object.entries(records).map(([studentId, record]) => ({ classItem, student: studentById(studentId), ...record })).filter(item => item.student);
  });
});
const tasks = computed(() => {
  const missingAttendance = classStudents.value.filter(student => !activeAttendance.value[student.id]).length;
  const unpaid = state.students.filter(student => student.due - student.paid > 0).slice(0, 3);
  return [
    { id: 'task_attendance', icon: 'ClipboardCheck', tone: 'violet', title: `${missingAttendance} học viên chưa điểm danh`, sub: `${activeClass.value.name} · ${state.attendanceDate}`, action: 'Điểm danh ngay', view: 'attendance' },
    { id: 'task_notify', icon: 'MessageCircle', tone: 'coral', title: `${state.notificationQueue.length} tin chờ gửi phụ huynh`, sub: 'Tự tạo từ vắng học, nghỉ phép, công nợ', action: 'Xem hàng đợi', view: 'notify' },
    { id: 'task_debt', icon: 'WalletCards', tone: 'sun', title: `${unpaid.length} học viên cần nhắc phí`, sub: unpaid.map(item => item.name).join(', '), action: 'Thu / nhắc phí', view: 'fees' },
  ];
});

function login() {
  state.isAuthenticated = true;
  toast('Đăng nhập thành công.');
}

function logout() {
  state.isAuthenticated = false;
  state.activeView = 'dashboard';
}

function setView(view) {
  state.activeView = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function teacherById(id) {
  return state.teachers.find(item => item.id === id) || state.teachers[0];
}

function studentById(id) {
  return state.students.find(item => item.id === id);
}

function classById(id) {
  return state.classes.find(item => item.id === id) || state.classes[0];
}

function packageById(id) {
  return feePackages.find(item => item.id === id) || feePackages[0];
}

function firstStudentInClass(classItem) {
  return studentById(classItem.studentIds[0]) || state.students[0];
}

function studentClasses(studentId) {
  return state.classes.filter(item => item.studentIds.includes(studentId));
}

function initials(name) {
  const parts = name.trim().split(' ');
  return `${parts.at(-2)?.[0] || ''}${parts.at(-1)?.[0] || ''}`.toUpperCase();
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`;
}

function debtOf(student) {
  return Math.max(0, student.due - student.paid);
}

function attendanceLabel(status) {
  return attendanceStatuses.find(item => item.id === status)?.label || 'Chưa điểm danh';
}

function roleLabel(role) {
  return role === 'admin' ? 'Quản trị viên' : 'Giáo viên';
}

function statusLabel(status) {
  return {
    sent: 'Đã gửi',
    queued: 'Đang chờ',
    failed: 'Lỗi',
    manual: 'Cần gửi thủ công',
    skipped: 'Đã bỏ qua',
  }[status] || status;
}

function channelFor(student, channels = state.notifyChannels) {
  if (channels.zalo && state.settings.zaloConnected && student.zaloFollowStatus === 'followed' && student.zaloUserId) return 'Zalo OA';
  if (channels.zalo && state.settings.znsConnected && student.zaloConsentStatus === 'granted') return 'ZNS';
  if (channels.email && state.settings.emailConnected && student.parentEmail) return 'Email';
  return 'Zalo thủ công';
}

function channelStatus(channel) {
  return channel === 'Zalo thủ công' ? 'manual' : 'sent';
}

function buildTemplate(type, classItem, student) {
  const template = state.templates[type] || state.templates.remind_class;
  const studentDebt = student ? debtOf(student) : 0;
  const report = student ? createReportData(student, classItem) : null;
  return template
    .replaceAll('{ten_hoc_sinh}', student?.name || 'học viên')
    .replaceAll('{ten_lop}', classItem?.name || 'lớp học')
    .replaceAll('{gio_hoc}', classItem?.time || 'lịch học')
    .replaceAll('{so_tien}', formatCurrency(studentDebt))
    .replaceAll('{ngay}', new Date().toLocaleDateString('vi-VN'))
    .replaceAll('{ty_le_chuyen_can}', report ? `${report.attendanceRate}%` : '100%')
    .replaceAll('{so_buoi_vang}', report ? `${report.absentCount}` : '0');
}

function markAttendance(studentId, status) {
  if (!state.attendance[activeAttendanceKey.value]) state.attendance[activeAttendanceKey.value] = {};
  state.attendance[activeAttendanceKey.value][studentId] = {
    status,
    notifiedAt: '',
    notificationStatus: ['absent', 'excused'].includes(status) ? 'queued' : '',
  };

  if (['absent', 'excused'].includes(status)) {
    enqueueNotification('absence_followup', studentId, activeClass.value.id, status === 'absent' ? 'Vắng học hôm nay' : 'Nghỉ phép hôm nay');
    toast('Đã điểm danh và đưa tin nhắn phụ huynh vào hàng đợi.');
  } else {
    toast('Đã tự động lưu điểm danh.');
  }
}

function enqueueNotification(type, studentId, classId, reason) {
  const exists = state.notificationQueue.some(item => item.type === type && item.studentId === studentId && item.classId === classId && item.createdAt === todayIso);
  if (exists) return;
  state.notificationQueue.unshift({ id: `queue_${Date.now()}_${studentId}`, type, studentId, classId, reason, createdAt: todayIso });
}

function openStudentModal(student) {
  state.modal = { type: 'student', studentId: student.id };
}

function openClassModal(classItem) {
  state.modal = { type: 'class', classId: classItem.id };
}

function openPaymentModal(student) {
  const firstClass = studentClasses(student.id)[0] || state.classes[0];
  state.modal = {
    type: 'payment',
    studentId: student.id,
    classId: firstClass.id,
    amount: debtOf(student) || packageById(firstClass.feePackageId).price,
    method: 'bank',
    paidAt: todayIso,
    note: '',
    notifyParent: true,
  };
}

function openReportModal(student) {
  const classItem = studentClasses(student.id)[0] || state.classes[0];
  const report = createParentReport(student.id, classItem.id);
  state.modal = { type: 'report', reportId: report.id };
}

function closeModal() {
  state.modal = null;
}

function collectPayment() {
  const student = studentById(state.modal.studentId);
  const amount = Number(state.modal.amount || 0);
  if (!student || amount <= 0) {
    toast('Số tiền thu chưa hợp lệ.');
    return;
  }

  student.paid += amount;
  const notificationId = state.modal.notifyParent ? `noti_${Date.now()}` : '';
  state.payments.unshift({
    id: `pay_${Date.now()}`,
    studentId: student.id,
    classId: state.modal.classId,
    amount,
    method: state.modal.method,
    paidAt: state.modal.paidAt,
    note: state.modal.note,
    notifyParent: state.modal.notifyParent,
    notificationId,
  });

  if (state.modal.notifyParent) {
    sendNotificationToStudent('confirm_paid', student, classById(state.modal.classId));
  }

  closeModal();
  toast('Đã ghi nhận học phí và cập nhật công nợ.');
}

function sendNotificationToStudent(type, student, classItem) {
  const channel = channelFor(student);
  const content = buildTemplate(type, classItem, student);
  state.notificationLog.unshift({
    id: `noti_${Date.now()}_${student.id}`,
    type: notificationTypes.find(item => item.id === type)?.label || 'Thông báo',
    target: student.name,
    channel,
    status: channelStatus(channel),
    content,
    time: 'Vừa xong',
    error: channel === 'Zalo thủ công' ? 'Chưa đủ cấu hình OA/ZNS, cần gửi thủ công.' : '',
  });
  student.lastNotifiedAt = todayIso;
}

function sendNotification() {
  const classItem = selectedNotifyClass.value;
  const recipients = notificationRecipients();
  recipients.forEach(student => sendNotificationToStudent(state.notifyType, student, classItem));
  state.notificationQueue = state.notificationQueue.filter(item => !recipients.some(student => student.id === item.studentId));
  toast(`Đã xử lý ${recipients.length} thông báo phụ huynh.`);
}

function sendQueued(item) {
  const student = studentById(item.studentId);
  if (!student) return;
  sendNotificationToStudent(item.type, student, classById(item.classId));
  state.notificationQueue = state.notificationQueue.filter(queueItem => queueItem.id !== item.id);
  toast('Đã xử lý tin nhắn trong hàng đợi.');
}

function notificationRecipients() {
  if (state.notifyAudience === 'debt') return state.students.filter(student => debtOf(student) > 0);
  if (state.notifyAudience === 'absence') return state.notificationQueue.map(item => studentById(item.studentId)).filter(Boolean);
  return selectedNotifyClass.value.studentIds.map(studentById).filter(Boolean);
}

function createReportData(student, classItem) {
  const relatedRecords = Object.entries(state.attendance)
    .filter(([key]) => key.startsWith(`${classItem.id}|`))
    .map(([, records]) => records[student.id]?.status)
    .filter(Boolean);
  const total = relatedRecords.length || 5;
  const absentCount = relatedRecords.filter(status => ['absent', 'excused'].includes(status)).length;
  const attendanceRate = Math.round(((total - absentCount) / total) * 100);
  return {
    attendanceRate,
    absentCount,
    note: student.note,
    debt: debtOf(student),
    nextClass: `${classItem.name} · ${classItem.time}`,
  };
}

function createParentReport(studentId, classId) {
  const student = studentById(studentId);
  const classItem = classById(classId);
  const data = createReportData(student, classItem);
  const existing = state.parentReports.find(item => item.studentId === studentId && item.classId === classId);
  if (existing) return existing;
  const report = {
    id: `report_${Date.now()}_${studentId}`,
    token: `rico-${studentId}-${Date.now()}`,
    studentId,
    classId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    data,
  };
  state.parentReports.unshift(report);
  return report;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Đã sao chép nội dung tin nhắn.');
  } catch {
    toast('Không thể sao chép tự động, vui lòng chọn nội dung để sao chép.');
  }
}

function methodLabel(method) {
  return { cash: 'Tiền mặt', bank: 'Chuyển khoản', other: 'Khác' }[method] || method;
}

function apiHint() {
  return appScriptUrl ? 'Đã cấu hình Apps Script API' : 'Đang chạy chế độ demo local';
}

function toast(message) {
  state.toast = message;
  window.setTimeout(() => {
    state.toast = '';
  }, 2600);
}
</script>

<template>
  <div class="bg-liquid" aria-hidden="true">
    <span class="b1"></span>
    <span class="b2"></span>
    <span class="b3"></span>
    <span class="b4"></span>
  </div>

  <section v-if="!state.isAuthenticated" class="login-screen">
    <div class="login-card glass glass-strong">
      <div class="login-mascot"><GraduationCap :size="36" /></div>
      <div class="brandmark">Rico Study<span>.</span></div>
      <p class="login-sub">Quản lý học viên, điểm danh, học phí và chia sẻ tình hình học tập với phụ huynh thật gọn.</p>
      <label class="field">
        <span>Email hoặc tên đăng nhập</span>
        <input v-model="state.login.email" type="text" autocomplete="username" />
      </label>
      <label class="field">
        <span>Mật khẩu</span>
        <input v-model="state.login.password" type="password" autocomplete="current-password" @keydown.enter="login" />
      </label>
      <button type="button" class="btn btn-primary btn-block" @click="login">
        <LogIn :size="17" />
        Đăng nhập
      </button>
      <div class="login-demo">Đây là bản demo. Nhấn Đăng nhập để xem toàn bộ ứng dụng với dữ liệu mẫu.</div>
    </div>
  </section>

  <div v-else class="app-layout">
    <aside class="sidebar glass">
      <div class="sidebar-brand">
        <div class="brand-ico"><GraduationCap :size="19" /></div>
        <div class="brandmark">Rico Study<span>.</span></div>
      </div>
      <nav class="nav-group" aria-label="Điều hướng chính">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-item"
          :class="{ active: state.activeView === item.id }"
          @click="setView(item.id)"
        >
          <span class="ico"><component :is="item.icon" :size="18" /></span>
          {{ item.label }}
        </button>
      </nav>
      <div class="sidebar-user">
        <div class="avatar">{{ state.user.initials }}</div>
        <div>
          <div class="u-name">{{ state.user.name }}</div>
          <div class="u-role">{{ roleLabel(state.user.role) }}</div>
        </div>
        <button type="button" class="logout-link" title="Đăng xuất" @click="logout">
          <Power :size="17" />
        </button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar glass">
        <div>
          <h1>{{ activeNav.label }}</h1>
          <p>{{ apiHint() }}</p>
        </div>
        <div class="pill-date">
          <CalendarDays :size="17" />
          {{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) }}
        </div>
      </header>

      <section v-if="state.activeView === 'dashboard'" class="content">
        <div class="grid grid-4">
          <article class="card glass stat-card">
            <div class="stat-ico tint-violet"><School :size="21" /></div>
            <strong>{{ dashboard.classesToday }}</strong>
            <span>Lớp dạy hôm nay</span>
          </article>
          <article class="card glass stat-card">
            <div class="stat-ico tint-mint"><WalletCards :size="21" /></div>
            <strong>{{ formatCurrency(dashboard.totalPaid) }}</strong>
            <span>Đã thu</span>
          </article>
          <article class="card glass stat-card">
            <div class="stat-ico tint-coral"><CircleDollarSign :size="21" /></div>
            <strong>{{ formatCurrency(dashboard.totalDebt) }}</strong>
            <span>Công nợ chưa thu</span>
          </article>
          <article class="card glass stat-card">
            <div class="stat-ico tint-sun"><UserX :size="21" /></div>
            <strong>{{ dashboard.absentToday.length }}</strong>
            <span>Vắng / nghỉ phép hôm nay</span>
          </article>
        </div>

        <div class="section-title">
          <h2><Zap :size="18" /> Việc cần làm hôm nay</h2>
        </div>
        <div class="grid grid-3">
          <article v-for="task in tasks" :key="task.id" class="card glass task-card">
            <div :class="['stat-ico', `tint-${task.tone}`]"><component :is="task.icon" :size="20" /></div>
            <h3>{{ task.title }}</h3>
            <p>{{ task.sub }}</p>
            <button type="button" class="link-btn" @click="setView(task.view)">{{ task.action }}</button>
          </article>
        </div>

        <div class="grid grid-2 dashboard-split">
          <section class="card glass">
            <div class="panel-title">
              <h2><CalendarCheck :size="18" /> Lịch dạy tiếp theo</h2>
              <button type="button" class="see-all" @click="setView('classes')">Xem tất cả <ArrowRight :size="15" /></button>
            </div>
            <div class="schedule-list">
              <article v-for="classItem in state.classes" :key="classItem.id" class="sched-row">
                <strong>{{ classItem.schedule[0] }}</strong>
                <span :class="['sched-dot', `dot-${classItem.tone}`]"></span>
                <div>
                  <b>{{ classItem.name }}</b>
                  <small>{{ classItem.time }} · {{ teacherById(classItem.teacherId).name }}</small>
                </div>
              </article>
            </div>
          </section>
          <section class="card glass">
            <div class="panel-title">
              <h2><UserX :size="18" /> Phụ huynh cần nhắn</h2>
              <button type="button" class="see-all" @click="setView('notify')">Gửi ngay <ArrowRight :size="15" /></button>
            </div>
            <article v-for="item in state.notificationQueue.slice(0, 4)" :key="item.id" class="mini-student">
              <div class="avatar">{{ initials(studentById(item.studentId)?.name || '') }}</div>
              <div>
                <b>{{ studentById(item.studentId)?.name }}</b>
                <span>{{ item.reason }} · {{ classById(item.classId).name }}</span>
              </div>
            </article>
            <div v-if="!state.notificationQueue.length" class="hint">Không có tin nhắn nào đang chờ xử lý.</div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'students'" class="content">
        <div class="toolbar">
          <label class="search-box">
            <Search :size="17" />
            <input v-model="state.studentSearch" type="search" placeholder="Tìm học viên, phụ huynh, số điện thoại..." />
          </label>
          <button type="button" class="btn btn-ghost btn-sm" @click="toast('Tải file mẫu Excel đang ở chế độ demo.')">
            <FileUp :size="16" />
            Import Excel
          </button>
          <button type="button" class="btn btn-primary btn-sm" @click="toast('Tính năng thêm học viên sẽ nối Google Sheet ở bước sau.')">
            <Plus :size="16" />
            Thêm học viên
          </button>
        </div>
        <div class="list">
          <article v-for="student in filteredStudents" :key="student.id" class="list-row" @click="openStudentModal(student)">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="list-main">
              <b>{{ student.name }}</b>
              <span>{{ studentClasses(student.id).map(item => item.name).join(', ') || 'Chưa xếp lớp' }} · PH: {{ student.parentName }}</span>
            </div>
            <span :class="['tag', debtOf(student) > 0 ? 'tag-coral' : 'tag-mint']">
              {{ debtOf(student) > 0 ? `Nợ ${formatCurrency(debtOf(student))}` : 'Đã đóng đủ' }}
            </span>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'classes'" class="content">
        <div class="toolbar">
          <button type="button" class="chip active">Tất cả</button>
          <button v-for="type in ['Theo buổi', 'Theo tháng', 'Theo combo', 'Theo khóa']" :key="type" type="button" class="chip">{{ type }}</button>
          <span class="spacer"></span>
          <button type="button" class="btn btn-primary btn-sm" @click="toast('Tính năng tạo lớp mới đang ở chế độ demo.')">
            <Plus :size="16" />
            Tạo lớp mới
          </button>
        </div>
        <div class="grid grid-3 class-grid">
          <article v-for="classItem in state.classes" :key="classItem.id" class="class-card" @click="openClassModal(classItem)">
            <div class="class-top">
              <div :class="['class-ico', `tint-${classItem.tone}`]"><component :is="classItem.icon" :size="22" /></div>
              <div>
                <h3>{{ classItem.name }}</h3>
                <p>{{ classItem.schedule.join(', ') }} · {{ classItem.time }}</p>
              </div>
            </div>
            <span>GV phụ trách: {{ teacherById(classItem.teacherId).name }}</span>
            <div class="progress-wrap"><div class="progress-bar" :style="{ width: `${Math.min(100, Math.round(classItem.studentIds.map(studentById).reduce((sum, student) => sum + (student?.paid || 0), 0) / (classItem.studentIds.length * packageById(classItem.feePackageId).price || 1) * 100))}%` }"></div></div>
            <footer><span>{{ classItem.studentIds.length }} học viên</span><span>{{ formatCurrency(packageById(classItem.feePackageId).price) }}</span></footer>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'attendance'" class="content">
        <div class="toolbar">
          <select v-model="state.selectedClassId" class="chip select-chip">
            <option v-for="classItem in state.classes" :key="classItem.id" :value="classItem.id">{{ classItem.name }}</option>
          </select>
          <input v-model="state.attendanceDate" type="date" class="chip select-chip" />
          <span class="spacer"></span>
          <span class="hint">Đã điểm danh {{ Object.keys(activeAttendance).length }}/{{ classStudents.length }}</span>
        </div>
        <div class="attendance-list">
          <article v-for="student in classStudents" :key="student.id" class="att-student">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="att-name">
              <b>{{ student.name }}</b>
              <span>{{ attendanceLabel(activeAttendance[student.id]?.status) }}</span>
            </div>
            <div class="att-buttons">
              <button
                v-for="status in attendanceStatuses"
                :key="status.id"
                type="button"
                class="att-btn"
                :class="[status.id, { on: activeAttendance[student.id]?.status === status.id }]"
                @click="markAttendance(student.id, status.id)"
              >
                <component :is="status.icon" :size="14" />
                {{ status.label }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'fees'" class="content">
        <div class="grid grid-3">
          <article class="card glass stat-card"><div class="stat-ico tint-mint"><Coins :size="21" /></div><strong>{{ formatCurrency(dashboard.totalPaid) }}</strong><span>Đã thu</span></article>
          <article class="card glass stat-card"><div class="stat-ico tint-coral"><CircleDollarSign :size="21" /></div><strong>{{ formatCurrency(dashboard.totalDebt) }}</strong><span>Còn nợ</span></article>
          <article class="card glass stat-card"><div class="stat-ico tint-sun"><Archive :size="21" /></div><strong>{{ feePackages.length }}</strong><span>Gói học phí</span></article>
        </div>
        <div class="section-title"><h2><Archive :size="18" /> Gói học phí</h2></div>
        <div class="grid grid-2">
          <article v-for="fee in feePackages" :key="fee.id" class="fee-card glass">
            <div class="class-ico tint-violet"><CreditCard :size="20" /></div>
            <div><b>{{ fee.name }}</b><span>{{ fee.type }}{{ fee.sessions ? ` · ${fee.sessions} buổi` : '' }}</span></div>
            <strong>{{ formatCurrency(fee.price) }}</strong>
          </article>
        </div>
        <div class="section-title"><h2><WalletCards :size="18" /> Công nợ theo học viên</h2></div>
        <div class="list">
          <article v-for="student in state.students" :key="student.id" class="list-row no-hover">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="list-main">
              <b>{{ student.name }}</b>
              <span>Đã đóng {{ formatCurrency(student.paid) }} / {{ formatCurrency(student.due) }}</span>
            </div>
            <span :class="['tag', debtOf(student) > 0 ? 'tag-coral' : 'tag-mint']">{{ debtOf(student) > 0 ? `Nợ ${formatCurrency(debtOf(student))}` : 'Đủ' }}</span>
            <button type="button" class="btn btn-primary btn-sm" @click="openPaymentModal(student)">Thu tiền</button>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'reports'" class="content">
        <div class="grid grid-4">
          <article class="card glass stat-card"><div class="stat-ico tint-violet"><Users :size="21" /></div><strong>{{ state.students.length }}</strong><span>Học viên đang học</span></article>
          <article class="card glass stat-card"><div class="stat-ico tint-mint"><ChartNoAxesColumnIncreasing :size="21" /></div><strong>88%</strong><span>Tỷ lệ đi học</span></article>
          <article class="card glass stat-card"><div class="stat-ico tint-sun"><School :size="21" /></div><strong>{{ state.classes.length }}</strong><span>Lớp đang mở</span></article>
          <article class="card glass stat-card"><div class="stat-ico tint-sky"><UserRoundCog :size="21" /></div><strong>{{ state.teachers.length }}</strong><span>Giáo viên</span></article>
        </div>
        <div class="grid grid-2 dashboard-split">
          <section class="card glass">
            <div class="panel-title"><h2><ChartNoAxesColumnIncreasing :size="18" /> Doanh thu theo lớp</h2></div>
            <article v-for="classItem in state.classes" :key="classItem.id" class="sched-row revenue-row">
              <div><b>{{ classItem.name }}</b><small>{{ classItem.studentIds.length }} học viên</small></div>
              <strong>{{ formatCurrency(classItem.studentIds.map(studentById).reduce((sum, student) => sum + (student?.paid || 0), 0)) }}</strong>
            </article>
          </section>
          <section class="card glass">
            <div class="panel-title"><h2><UserX :size="18" /> Học viên cần theo sát</h2></div>
            <article v-for="student in state.students.filter(item => debtOf(item) > 0).slice(0, 4)" :key="student.id" class="mini-student">
              <div class="avatar">{{ initials(student.name) }}</div>
              <div><b>{{ student.name }}</b><span>{{ student.note }}</span></div>
            </article>
            <div class="hint">Gợi ý: tạo báo cáo học tập hoặc nhắn phụ huynh ngay trong hồ sơ học viên.</div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'notify'" class="content">
        <div class="grid grid-2 dashboard-split">
          <section class="card glass">
            <div class="panel-title"><h2><PenLine :size="18" /> Soạn thông báo</h2></div>
            <label class="field"><span>Loại thông báo</span><select v-model="state.notifyType"><option v-for="item in notificationTypes" :key="item.id" :value="item.id">{{ item.label }}</option></select></label>
            <label class="field"><span>Gửi đến</span><select v-model="state.notifyAudience"><option value="class">Phụ huynh trong lớp</option><option value="debt">Học viên còn công nợ</option><option value="absence">Hàng đợi vắng / nghỉ phép</option></select></label>
            <label class="field"><span>Lớp học</span><select v-model="state.notifyClassId"><option v-for="classItem in state.classes" :key="classItem.id" :value="classItem.id">{{ classItem.name }}</option></select></label>
            <div class="channel-row">
              <label><input v-model="state.notifyChannels.zalo" type="checkbox" /> Zalo OA / ZNS</label>
              <label><input v-model="state.notifyChannels.email" type="checkbox" /> Email</label>
            </div>
            <button type="button" class="btn btn-primary btn-block" @click="sendNotification"><Send :size="17" /> Gửi thông báo ngay</button>
          </section>
          <section class="card glass preview-card">
            <div class="panel-title"><h2><Eye :size="18" /> Xem trước tin nhắn</h2></div>
            <p>{{ notificationPreview }}</p>
            <button type="button" class="btn btn-ghost btn-sm" @click="copyText(notificationPreview)">Sao chép nội dung</button>
            <div class="hint">Nếu Zalo OA/ZNS chưa cấu hình, Rico Study sẽ tạo tin nhắn và đánh dấu cần gửi thủ công.</div>
          </section>
        </div>

        <div class="section-title"><h2><ListTodo :size="18" /> Hàng đợi tự động</h2></div>
        <div class="list">
          <article v-for="item in state.notificationQueue" :key="item.id" class="list-row no-hover">
            <div class="avatar"><MessageCircle :size="17" /></div>
            <div class="list-main">
              <b>{{ studentById(item.studentId)?.name }}</b>
              <span>{{ item.reason }} · {{ classById(item.classId).name }}</span>
            </div>
            <button type="button" class="btn btn-primary btn-sm" @click="sendQueued(item)">Xử lý</button>
          </article>
          <div v-if="!state.notificationQueue.length" class="empty-card">Không có thông báo nào trong hàng đợi.</div>
        </div>

        <div class="section-title"><h2><History :size="18" /> Lịch sử gửi thông báo</h2></div>
        <div class="list">
          <article v-for="item in state.notificationLog" :key="item.id" class="list-row no-hover">
            <div class="avatar"><MessageCircle :size="17" /></div>
            <div class="list-main">
              <b>{{ item.type }}</b>
              <span>Gửi đến {{ item.target }} · {{ item.channel }} · {{ statusLabel(item.status) }}</span>
            </div>
            <span :class="['tag', item.status === 'sent' ? 'tag-mint' : item.status === 'manual' ? 'tag-sun' : 'tag-coral']">{{ item.time }}</span>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'settings'" class="content">
        <div class="grid grid-2 dashboard-split">
          <section class="card glass">
            <div class="panel-title"><h2><LinkIcon :size="18" /> Kết nối dữ liệu</h2></div>
            <label class="switch-row"><span><b>Google Sheet</b><small>Dữ liệu lưu trên Sheet của chính bạn</small></span><input v-model="state.settings.sheetConnected" type="checkbox" /></label>
            <label class="field"><span>Google Sheet ID</span><input v-model="state.settings.sheetId" /></label>
            <label class="switch-row"><span><b>Zalo OA</b><small>Gửi tin cho phụ huynh đã quan tâm OA</small></span><input v-model="state.settings.zaloConnected" type="checkbox" /></label>
            <label class="switch-row"><span><b>ZNS Template</b><small>Gửi thông báo theo số điện thoại khi mẫu đã duyệt</small></span><input v-model="state.settings.znsConnected" type="checkbox" /></label>
            <label class="switch-row"><span><b>Email</b><small>Kênh dự phòng và gửi xác nhận</small></span><input v-model="state.settings.emailConnected" type="checkbox" /></label>
          </section>
          <section class="card glass">
            <div class="panel-title"><h2><UsersRound :size="18" /> Tài khoản & phân quyền</h2></div>
            <div class="list compact-list">
              <article v-for="teacher in state.teachers" :key="teacher.id" class="list-row no-hover">
                <div class="avatar">{{ teacher.initials }}</div>
                <div class="list-main"><b>{{ teacher.name }}</b><span>{{ roleLabel(teacher.role) }}</span></div>
                <span :class="['tag', teacher.role === 'admin' ? 'tag-violet' : 'tag-sky']">{{ roleLabel(teacher.role) }}</span>
              </article>
            </div>
          </section>
        </div>
        <div class="section-title"><h2><Mail :size="18" /> Mẫu tin nhắn</h2></div>
        <div class="template-grid">
          <label v-for="item in notificationTypes" :key="item.id" class="template-card glass">
            <b>{{ item.label }}</b>
            <textarea v-model="state.templates[item.id]"></textarea>
            <span>{ten_hoc_sinh} · {ten_lop} · {gio_hoc} · {so_tien} · {ngay}</span>
          </label>
        </div>
      </section>
    </main>

    <nav class="bottom-nav glass">
      <button v-for="id in bottomNav" :key="id" type="button" class="bn-item" :class="{ active: state.activeView === id }" @click="setView(id)">
        <component :is="navItems.find(item => item.id === id)?.icon" :size="19" />
        {{ navItems.find(item => item.id === id)?.short }}
      </button>
    </nav>
  </div>

  <div v-if="state.modal" class="modal-overlay" @click.self="closeModal">
    <section v-if="state.modal.type === 'student'" class="modal glass-strong">
      <header class="modal-head">
        <h3><IdCard :size="19" /> Hồ sơ học viên</h3>
        <button type="button" class="modal-close" @click="closeModal"><X :size="17" /></button>
      </header>
      <template v-if="studentById(state.modal.studentId)">
        <div class="profile-head">
          <div class="avatar large">{{ initials(studentById(state.modal.studentId).name) }}</div>
          <div>
            <h3>{{ studentById(state.modal.studentId).name }}</h3>
            <p>Phụ huynh: {{ studentById(state.modal.studentId).parentName }} · {{ studentById(state.modal.studentId).parentPhone }}</p>
          </div>
        </div>
        <div class="grid grid-2">
          <div class="mini-stat tint-mint"><span>Đã đóng</span><b>{{ formatCurrency(studentById(state.modal.studentId).paid) }}</b></div>
          <div class="mini-stat tint-coral"><span>Còn nợ</span><b>{{ formatCurrency(debtOf(studentById(state.modal.studentId))) }}</b></div>
        </div>
        <div class="divider"></div>
        <b>Lớp đang học</b>
        <div class="tag-row"><span v-for="classItem in studentClasses(state.modal.studentId)" :key="classItem.id" class="tag tag-violet">{{ classItem.name }}</span></div>
        <p class="hint">{{ studentById(state.modal.studentId).note }}</p>
        <footer class="modal-foot">
          <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
          <button type="button" class="btn btn-ghost" @click="openReportModal(studentById(state.modal.studentId))">Tạo báo cáo</button>
          <button type="button" class="btn btn-primary" @click="openPaymentModal(studentById(state.modal.studentId))">Thu học phí</button>
        </footer>
      </template>
    </section>

    <section v-if="state.modal.type === 'class'" class="modal glass-strong">
      <header class="modal-head">
        <h3><School :size="19" /> {{ classById(state.modal.classId).name }}</h3>
        <button type="button" class="modal-close" @click="closeModal"><X :size="17" /></button>
      </header>
      <p class="hint">{{ classById(state.modal.classId).schedule.join(', ') }} · {{ classById(state.modal.classId).time }} · GV {{ teacherById(classById(state.modal.classId).teacherId).name }}</p>
      <div class="mini-stat tint-violet"><span>Gói học phí</span><b>{{ packageById(classById(state.modal.classId).feePackageId).name }} · {{ formatCurrency(packageById(classById(state.modal.classId).feePackageId).price) }}</b></div>
      <div class="divider"></div>
      <div class="list compact-list">
        <article v-for="studentId in classById(state.modal.classId).studentIds" :key="studentId" class="list-row" @click="openStudentModal(studentById(studentId))">
          <div class="avatar">{{ initials(studentById(studentId).name) }}</div>
          <div class="list-main"><b>{{ studentById(studentId).name }}</b><span>{{ studentById(studentId).parentName }}</span></div>
        </article>
      </div>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
        <button type="button" class="btn btn-primary" @click="state.selectedClassId = state.modal.classId; closeModal(); setView('attendance')">Điểm danh lớp này</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'payment'" class="modal glass-strong">
      <header class="modal-head">
        <h3><WalletCards :size="19" /> Thu học phí</h3>
        <button type="button" class="modal-close" @click="closeModal"><X :size="17" /></button>
      </header>
      <p class="hint">Học viên: <b>{{ studentById(state.modal.studentId).name }}</b> · Còn nợ: <b>{{ formatCurrency(debtOf(studentById(state.modal.studentId))) }}</b></p>
      <label class="field"><span>Số tiền thu</span><input v-model.number="state.modal.amount" type="number" min="0" step="50000" /></label>
      <div class="row2">
        <label class="field"><span>Hình thức</span><select v-model="state.modal.method"><option value="cash">Tiền mặt</option><option value="bank">Chuyển khoản</option><option value="other">Khác</option></select></label>
        <label class="field"><span>Ngày thu</span><input v-model="state.modal.paidAt" type="date" /></label>
      </div>
      <label class="field"><span>Ghi chú</span><input v-model="state.modal.note" placeholder="Không bắt buộc" /></label>
      <label class="check-row"><input v-model="state.modal.notifyParent" type="checkbox" /> Gửi xác nhận đã thu tiền cho phụ huynh</label>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Hủy</button>
        <button type="button" class="btn btn-primary" @click="collectPayment">Xác nhận thu tiền</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'report'" class="modal glass-strong">
      <header class="modal-head">
        <h3><FileText :size="19" /> Tóm tắt học tập</h3>
        <button type="button" class="modal-close" @click="closeModal"><X :size="17" /></button>
      </header>
      <template v-if="state.parentReports.find(item => item.id === state.modal.reportId)">
        <p class="hint">Link phụ huynh có hiệu lực đến {{ state.parentReports.find(item => item.id === state.modal.reportId).expiresAt }}</p>
        <div class="report-box">
          <b>{{ studentById(state.parentReports.find(item => item.id === state.modal.reportId).studentId).name }}</b>
          <span>Chuyên cần: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.attendanceRate }}%</span>
          <span>Buổi vắng: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.absentCount }}</span>
          <span>Công nợ: {{ formatCurrency(state.parentReports.find(item => item.id === state.modal.reportId).data.debt) }}</span>
          <span>Lịch tiếp theo: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.nextClass }}</span>
        </div>
        <footer class="modal-foot">
          <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
          <button type="button" class="btn btn-ghost" @click="copyText(`https://rico.study/phu-huynh/${state.parentReports.find(item => item.id === state.modal.reportId).token}`)">Sao chép link</button>
          <button type="button" class="btn btn-primary" @click="sendNotificationToStudent('learning_report', studentById(state.parentReports.find(item => item.id === state.modal.reportId).studentId), classById(state.parentReports.find(item => item.id === state.modal.reportId).classId)); closeModal(); toast('Đã tạo tin báo cáo cho phụ huynh.')">Gửi phụ huynh</button>
        </footer>
      </template>
    </section>
  </div>

  <div v-if="state.toast" class="toast">
    <CheckCircle2 :size="17" />
    {{ state.toast }}
  </div>
</template>
