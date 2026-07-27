<script setup>
import { computed, reactive, ref } from 'vue';

const appScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL || '';
const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
const todayIso = new Date().toISOString().slice(0, 10);

const navSections = [
  {
    label: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Trang chủ', short: 'Trang chủ', icon: 'Home' },
    ],
  },
  {
    label: 'Dạy & học',
    items: [
      { id: 'classes', label: 'Lớp học', short: 'Lớp', icon: 'School' },
      { id: 'schedule', label: 'Lịch dạy', short: 'Lịch', icon: 'CalendarDays' },
      { id: 'attendance', label: 'Điểm danh', short: 'Điểm danh', icon: 'ClipboardCheck' },
    ],
  },
  {
    label: 'Học sinh',
    items: [
      { id: 'students', label: 'Học sinh', short: 'Học sinh', icon: 'Users' },
      { id: 'ledger', label: 'Sổ liên lạc', short: 'Sổ', icon: 'BookMarked' },
    ],
  },
  {
    label: 'Học phí',
    items: [
      { id: 'invoices', label: 'Phiếu học phí', short: 'Phiếu', icon: 'ReceiptText' },
      { id: 'autoFee', label: 'Thu học phí tự động', short: 'Thu phí', icon: 'WalletCards' },
      { id: 'stats', label: 'Thống kê', short: 'Thống kê', icon: 'ChartNoAxesColumnIncreasing' },
    ],
  },
  {
    label: 'Hỗ trợ',
    items: [
      { id: 'pricing', label: 'Bảng giá', short: 'Giá', icon: 'Gem' },
      { id: 'guide', label: 'Hướng dẫn', short: 'Hướng dẫn', icon: 'HelpCircle' },
      { id: 'notify', label: 'Thông báo', short: 'Tin', icon: 'MessageCircle' },
      { id: 'settings', label: 'Cài đặt', short: 'Cài đặt', icon: 'Settings' },
    ],
  },
];

const navItems = navSections.flatMap(section => section.items);
const bottomNav = ['dashboard', 'classes', 'attendance', 'invoices', 'notify'];

const classColors = [
  { id: 'peach', label: 'Đào', value: '#ffd2b6' },
  { id: 'mint', label: 'Bạc hà', value: '#beeccc' },
  { id: 'sky', label: 'Trời', value: '#b9d9f4' },
  { id: 'lavender', label: 'Lavender', value: '#d1c4f3' },
  { id: 'butter', label: 'Bơ', value: '#ffe7a7' },
  { id: 'rose', label: 'Hồng', value: '#f5bfcb' },
];

const attendanceStatuses = [
  { id: 'present', label: 'Có mặt', icon: 'Check' },
  { id: 'absent', label: 'Vắng', icon: 'X' },
  { id: 'late', label: 'Muộn', icon: 'Clock' },
  { id: 'makeup', label: 'Học bù', icon: 'RotateCcw' },
  { id: 'excused', label: 'Nghỉ phép', icon: 'FileText' },
];

const notificationTypes = [
  { id: 'remind_class', label: 'Nhắc lịch học' },
  { id: 'arrival', label: 'Báo đã đến lớp' },
  { id: 'reschedule', label: 'Thông báo nghỉ / đổi lịch' },
  { id: 'remind_fee', label: 'Nhắc học phí' },
  { id: 'confirm_paid', label: 'Xác nhận đã thu học phí' },
  { id: 'learning_report', label: 'Tóm tắt học tập' },
  { id: 'absence_followup', label: 'Trao đổi khi vắng học' },
];

const invoiceSteps = [
  { id: 'student', label: 'Học sinh', icon: 'Users' },
  { id: 'type', label: 'Loại học phí', icon: 'SlidersHorizontal' },
  { id: 'period', label: 'Kỳ thu phí', icon: 'CalendarDays' },
  { id: 'items', label: 'Khoản phí', icon: 'BadgeDollarSign' },
  { id: 'discount', label: 'Giảm trừ', icon: 'Percent' },
  { id: 'template', label: 'Mẫu phiếu', icon: 'Image' },
];

const pricingPlans = [
  { name: 'Free', price: 0, limit: '10 học sinh', active: true, features: ['Phiếu thu học phí', 'Thống kê chi tiết', 'Cảnh báo nguy cơ nghỉ học'] },
  { name: 'Pro Lite', price: 255000, limit: '25 học sinh', features: ['Link theo dõi thanh toán', 'Xác nhận chuyển khoản', 'Xuất lịch Google/Apple Calendar'] },
  { name: 'Pro', price: 672000, limit: '75 học sinh', features: ['Sổ liên lạc riêng', 'Khen thưởng', 'Ảnh buổi học gửi phụ huynh'] },
  { name: 'Pro Max', price: 927000, limit: '125 học sinh', popular: true, features: ['Tự nhắc phụ huynh qua Zalo', 'Quản lý điểm số', 'Báo cáo tháng'] },
];

const photoInput = ref(null);

const state = reactive({
  isAuthenticated: false,
  activeView: 'dashboard',
  selectedClassId: 'cls_001',
  attendanceDate: todayIso,
  studentSearch: '',
  layouts: {
    schedule: 'list',
    attendance: 'list',
    students: 'list',
    ledger: 'grid',
    invoices: 'list',
    notifications: 'list',
  },
  reportTab: 'attendance',
  pricingMode: 'card',
  modal: null,
  drawer: null,
  toast: '',
  pushStatus: 'Chưa bật',
  notifyType: 'remind_class',
  notifyClassId: 'cls_001',
  notifyAudience: 'class',
  notifyChannels: { zalo: true, email: true, share: true },
  login: { email: 'admin@ricostudy.vn', password: '123456' },
  user: { id: 'usr_001', name: 'Cô Hạnh', role: 'admin', initials: 'CH', email: 'admin@ricostudy.vn' },
  settings: {
    sheetConnected: true,
    sheetId: '1F8x-RicoStudy-Demo-2026',
    zaloConnected: false,
    znsConnected: false,
    emailConnected: true,
    pwaInstalled: false,
    notifications: {
      classReminder: true,
      monthlyDebt: true,
      absenceRisk: true,
      reminderMinutes: 30,
    },
  },
  templates: {
    remind_class: 'Chào anh/chị, {ten_hoc_sinh} có lịch học lớp {ten_lop} vào {gio_hoc} hôm nay. Rico Study nhắc bé đi học đúng giờ ạ.',
    arrival: '{ten_hoc_sinh} đã đến lớp {ten_lop} lúc {gio_hoc} ngày {ngay}. Rico Study gửi anh/chị để tiện theo dõi.',
    reschedule: 'Rico Study xin thông báo buổi học lớp {ten_lop} ngày {ngay} sẽ được đổi lịch. Trung tâm sẽ báo lịch học bù sớm nhất ạ.',
    remind_fee: 'Chào anh/chị, học phí lớp {ten_lop} của {ten_hoc_sinh} còn {so_tien}. Anh/chị vui lòng thanh toán giúp Rico Study ạ.',
    confirm_paid: 'Rico Study đã nhận {so_tien} học phí của {ten_hoc_sinh} lớp {ten_lop}. Cảm ơn anh/chị đã tin tưởng ạ.',
    learning_report: 'Tóm tắt học tập của {ten_hoc_sinh}: chuyên cần {ty_le_chuyen_can}, buổi vắng {so_buoi_vang}, công nợ {so_tien}. Lịch học tiếp theo: {gio_hoc}.',
    absence_followup: 'Chào anh/chị, hôm nay {ten_hoc_sinh} vắng lớp {ten_lop}. Rico Study gửi anh/chị thông tin để tiện theo dõi và hỗ trợ bé ạ.',
  },
  teachers: [
    { id: 'tea_001', name: 'Cô Hạnh', role: 'admin', initials: 'CH', classIds: ['cls_001', 'cls_003'] },
    { id: 'tea_002', name: 'Thầy Nam', role: 'teacher', initials: 'TN', classIds: ['cls_002'] },
    { id: 'tea_003', name: 'Cô Thảo', role: 'teacher', initials: 'CT', classIds: ['cls_004'] },
  ],
  classes: [
    { id: 'cls_001', name: 'Toán 6A', icon: 'Calculator', colorKey: 'lavender', teacherId: 'tea_001', schedule: ['T2', 'T4', 'T6'], weeklySchedule: [{ day: 'T2', start: '18:00', end: '19:30' }, { day: 'T4', start: '18:00', end: '19:30' }, { day: 'T6', start: '18:00', end: '19:30' }], time: '18:00 - 19:30', feeType: 'monthly', feeAmount: 900000, studentIds: ['stu_001', 'stu_002', 'stu_003', 'stu_004'], status: 'active', description: 'Lớp nền tảng, luyện bài tập hằng tuần.' },
    { id: 'cls_002', name: 'Anh văn giao tiếp', icon: 'MessagesSquare', colorKey: 'mint', teacherId: 'tea_002', schedule: ['T3', 'T5'], weeklySchedule: [{ day: 'T3', start: '19:00', end: '20:30' }, { day: 'T5', start: '19:00', end: '20:30' }], time: '19:00 - 20:30', feeType: 'package', feeAmount: 1800000, studentIds: ['stu_002', 'stu_005', 'stu_006'], status: 'active', description: 'Giao tiếp theo chủ đề, combo 10 buổi.' },
    { id: 'cls_003', name: 'Lý 9 nâng cao', icon: 'FlaskConical', colorKey: 'sky', teacherId: 'tea_001', schedule: ['T7'], weeklySchedule: [{ day: 'T7', start: '08:00', end: '10:00' }], time: '08:00 - 10:00', feeType: 'per_session', feeAmount: 150000, studentIds: ['stu_003', 'stu_007', 'stu_008', 'stu_001'], status: 'active', description: 'Ôn thi chuyển cấp.' },
    { id: 'cls_004', name: 'Văn 7B', icon: 'BookOpen', colorKey: 'butter', teacherId: 'tea_003', schedule: ['T2', 'T5'], weeklySchedule: [{ day: 'T2', start: '17:00', end: '18:30' }, { day: 'T5', start: '17:00', end: '18:30' }], time: '17:00 - 18:30', feeType: 'course', feeAmount: 3200000, studentIds: ['stu_004', 'stu_006', 'stu_009'], status: 'active', description: 'Đọc hiểu và viết đoạn văn.' },
  ],
  students: [
    { id: 'stu_001', name: 'Nguyễn Minh An', parentName: 'Anh Nguyễn Văn Bình', parentPhone: '0901 234 567', parentEmail: 'binh@example.com', zaloUserId: 'zalo_001', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 900000, due: 900000, stars: 24, note: 'Tập trung tốt, cần luyện trình bày.' },
    { id: 'stu_002', name: 'Trần Bảo Châu', parentName: 'Chị Trần Thị Hoa', parentPhone: '0912 345 678', parentEmail: 'hoa@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 1200000, due: 1800000, stars: 18, note: 'Nên ôn từ vựng mỗi ngày.' },
    { id: 'stu_003', name: 'Lê Gia Bảo', parentName: 'Anh Lê Văn Cường', parentPhone: '0987 654 321', parentEmail: 'cuong@example.com', zaloUserId: 'zalo_003', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 900000, due: 1050000, stars: 15, note: 'Vắng 1 buổi trong tuần này.' },
    { id: 'stu_004', name: 'Phạm Thảo My', parentName: 'Chị Phạm Thị Lan', parentPhone: '0977 888 999', parentEmail: 'lan@example.com', zaloUserId: '', zaloFollowStatus: 'unknown', zaloConsentStatus: 'pending', photoConsentStatus: 'pending', photoUrl: '', paid: 3200000, due: 4100000, stars: 12, note: 'Cần nhắc bài tập về nhà.' },
    { id: 'stu_005', name: 'Vũ Đăng Khoa', parentName: 'Anh Vũ Đình Khoa', parentPhone: '0933 111 222', parentEmail: 'khoa@example.com', zaloUserId: 'zalo_005', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 1800000, due: 1800000, stars: 31, note: 'Hoàn thành tốt bài nói.' },
    { id: 'stu_006', name: 'Đỗ Hạnh Nguyên', parentName: 'Chị Đỗ Thị Nga', parentPhone: '0966 222 333', parentEmail: 'nga@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 600000, due: 1800000, stars: 10, note: 'Đi học chưa đều.' },
    { id: 'stu_007', name: 'Hoàng Anh Tuấn', parentName: 'Anh Hoàng Văn Tú', parentPhone: '0944 555 666', parentEmail: 'tu@example.com', zaloUserId: '', zaloFollowStatus: 'not_followed', zaloConsentStatus: 'pending', photoConsentStatus: 'denied', photoUrl: '', paid: 150000, due: 450000, stars: 7, note: 'Cần trao đổi thêm với phụ huynh.' },
    { id: 'stu_008', name: 'Bùi Ngọc Diệp', parentName: 'Chị Bùi Thị Diễm', parentPhone: '0922 777 888', parentEmail: 'diem@example.com', zaloUserId: 'zalo_008', zaloFollowStatus: 'followed', zaloConsentStatus: 'granted', photoConsentStatus: 'granted', photoUrl: '', paid: 450000, due: 450000, stars: 26, note: 'Học ổn định.' },
    { id: 'stu_009', name: 'Ngô Quốc Đạt', parentName: 'Anh Ngô Văn Đức', parentPhone: '0955 999 000', parentEmail: 'duc@example.com', zaloUserId: '', zaloFollowStatus: 'unknown', zaloConsentStatus: 'pending', photoConsentStatus: 'pending', photoUrl: '', paid: 3200000, due: 3200000, stars: 19, note: 'Đọc hiểu tốt.' },
  ],
  attendance: {
    [`cls_001|${todayIso}`]: {
      stu_001: { status: 'present', source: 'tap', confidence: 1, mediaId: '', notifiedAt: '', notificationStatus: '' },
      stu_002: { status: 'present', source: 'tap', confidence: 1, mediaId: '', notifiedAt: '', notificationStatus: '' },
      stu_003: { status: 'absent', source: 'tap', confidence: 1, mediaId: '', notifiedAt: '', notificationStatus: 'queued' },
      stu_004: { status: 'late', source: 'tap', confidence: 1, mediaId: '', notifiedAt: '', notificationStatus: '' },
    },
  },
  attendanceMedia: [],
  ledgerNotes: {
    stu_001: { teacherNote: 'Minh An làm bài đều, cần trình bày lời giải rõ hơn.', lastSession: 'Hoàn thành 8/10 bài phân số, cần luyện bài toán lời văn.', nextGoal: 'Ôn quy đồng mẫu số và làm 3 bài vận dụng.', parentMessage: 'Anh/chị nhắc bé luyện thêm phần trình bày lời giải trong tuần này giúp Rico Study ạ.', behavior: 'Tập trung', homework: 'Đã giao 3 bài về nhà', score: 8.5 },
    stu_002: { teacherNote: 'Bảo Châu phát âm tốt hơn, cần duy trì ôn từ vựng.', lastSession: 'Luyện hội thoại chủ đề gia đình, phản xạ nhanh hơn.', nextGoal: 'Học 20 từ mới và ghi âm đoạn hội thoại ngắn.', parentMessage: 'Chị cho bé nghe lại file luyện nói 10 phút mỗi ngày giúp Rico Study ạ.', behavior: 'Tích cực', homework: 'Đã giao bài nghe', score: 8 },
    stu_003: { teacherNote: 'Gia Bảo cần đi học đều hơn để không hụt mạch bài.', lastSession: 'Vắng buổi gần nhất, cần học bù phần điện học cơ bản.', nextGoal: 'Sắp xếp học bù và làm phiếu ôn tập số 2.', parentMessage: 'Anh/chị hỗ trợ bé giữ lịch học đều để tránh mất nền trước kỳ kiểm tra ạ.', behavior: 'Cần theo sát', homework: 'Cần bổ sung', score: 6.5 },
    stu_004: { teacherNote: 'Thảo My hiểu bài nhưng hay quên bài tập về nhà.', lastSession: 'Luyện viết đoạn văn biểu cảm, bố cục đã rõ hơn.', nextGoal: 'Hoàn thiện đoạn văn 12 câu có mở-thân-kết.', parentMessage: 'Chị nhắc bé gửi bài trước buổi học sau để cô sửa sớm ạ.', behavior: 'Ổn định', homework: 'Chưa đủ', score: 7.2 },
  },
  payments: [
    { id: 'pay_001', studentId: 'stu_001', classId: 'cls_001', amount: 900000, method: 'bank', paidAt: '2026-07-12', notifyParent: true, notificationId: 'noti_001' },
    { id: 'pay_002', studentId: 'stu_005', classId: 'cls_002', amount: 1800000, method: 'cash', paidAt: '2026-07-15', notifyParent: true, notificationId: 'noti_002' },
  ],
  invoices: [
    { id: 'inv_001', studentId: 'stu_002', classId: 'cls_002', period: 'Tháng 07/2026', amount: 600000, status: 'unpaid', createdAt: '2026-07-01' },
    { id: 'inv_002', studentId: 'stu_003', classId: 'cls_003', period: 'Tháng 07/2026', amount: 150000, status: 'partial', createdAt: '2026-07-01' },
  ],
  expenses: [
    { id: 'exp_001', name: 'Tài liệu in tháng 7', amount: 180000, date: '2026-07-10' },
  ],
  shareArtifacts: [],
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
const attendanceRows = computed(() => {
  return state.classes.flatMap(classItem => {
    const records = state.attendance[`${classItem.id}|${todayIso}`] || {};
    return Object.entries(records).map(([studentId, record]) => ({ classItem, student: studentById(studentId), ...record })).filter(item => item.student);
  });
});
const dashboard = computed(() => {
  const totalPaid = state.students.reduce((sum, item) => sum + item.paid, 0);
  const totalDebt = state.students.reduce((sum, item) => sum + Math.max(0, item.due - item.paid), 0);
  const absentToday = attendanceRows.value.filter(item => ['absent', 'excused'].includes(item.status));
  const riskStudents = state.students.filter(student => riskScore(student) >= 2);
  return { totalPaid, totalDebt, absentToday, classesToday: todayClasses.value.length, riskStudents };
});
const tasks = computed(() => {
  const missingAttendance = classStudents.value.filter(student => !activeAttendance.value[student.id]).length;
  const unpaid = state.students.filter(student => debtOf(student) > 0).slice(0, 3);
  return [
    { id: 'task_attendance', icon: 'Camera', tone: 'pink', title: `${missingAttendance} học sinh chưa điểm danh`, sub: `${activeClass.value.name} · dùng chụp ảnh hoặc một chạm`, action: 'Điểm danh ngay', view: 'attendance' },
    { id: 'task_notify', icon: 'Bell', tone: 'mint', title: `${state.notificationQueue.length} tin chờ gửi phụ huynh`, sub: 'Tự tạo từ vắng học, công nợ và báo cáo', action: 'Xem hàng đợi', view: 'notify' },
    { id: 'task_debt', icon: 'WalletCards', tone: 'sun', title: `${unpaid.length} học sinh cần nhắc phí`, sub: unpaid.map(item => item.name).join(', '), action: 'Tạo phiếu', view: 'invoices' },
  ];
});
const revenue = computed(() => state.students.reduce((sum, item) => sum + item.paid, 0));
const expenseTotal = computed(() => state.expenses.reduce((sum, item) => sum + item.amount, 0));
const profit = computed(() => revenue.value - expenseTotal.value);

function login() {
  state.isAuthenticated = true;
  registerServiceWorker();
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

function firstStudentInClass(classItem) {
  return studentById(classItem.studentIds[0]) || state.students[0];
}

function studentClasses(studentId) {
  return state.classes.filter(item => item.studentIds.includes(studentId));
}

function classColor(key) {
  return classColors.find(item => item.id === key) || classColors[0];
}

function initials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  return `${parts.at(-2)?.[0] || ''}${parts.at(-1)?.[0] || parts.at(-1)?.[0] || ''}`.toUpperCase();
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`;
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
    unpaid: 'Chưa đóng',
    partial: 'Thu thiếu',
    paid: 'Đã thu',
  }[status] || status;
}

function feeTypeLabel(type) {
  return { per_session: 'Theo buổi', monthly: 'Theo tháng', package: 'Theo gói', course: 'Trọn khóa' }[type] || type;
}

function riskScore(student) {
  const absenceRisk = attendanceRows.value.filter(item => item.student.id === student.id && ['absent', 'excused'].includes(item.status)).length;
  const debtRisk = debtOf(student) > 0 ? 1 : 0;
  return absenceRisk + debtRisk;
}

function channelFor(student, channels = state.notifyChannels) {
  if (channels.zalo && state.settings.zaloConnected && student.zaloFollowStatus === 'followed' && student.zaloUserId) return 'Zalo OA';
  if (channels.zalo && state.settings.znsConnected && student.zaloConsentStatus === 'granted') return 'ZNS';
  if (channels.email && state.settings.emailConnected && student.parentEmail) return 'Email';
  if (channels.share) return 'Chia sẻ thủ công';
  return 'Zalo thủ công';
}

function channelStatus(channel) {
  return ['Zalo thủ công', 'Chia sẻ thủ công'].includes(channel) ? 'manual' : 'sent';
}

function buildTemplate(type, classItem, student) {
  const template = state.templates[type] || state.templates.remind_class;
  const studentDebt = student ? debtOf(student) : 0;
  const report = student ? createReportData(student, classItem) : null;
  return template
    .replaceAll('{ten_hoc_sinh}', student?.name || 'học sinh')
    .replaceAll('{ten_lop}', classItem?.name || 'lớp học')
    .replaceAll('{gio_hoc}', classItem?.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    .replaceAll('{so_tien}', formatCurrency(studentDebt))
    .replaceAll('{ngay}', new Date().toLocaleDateString('vi-VN'))
    .replaceAll('{ty_le_chuyen_can}', report ? `${report.attendanceRate}%` : '100%')
    .replaceAll('{so_buoi_vang}', report ? `${report.absentCount}` : '0');
}

function markAttendance(studentId, status, source = 'tap', confidence = 1, mediaId = '') {
  if (!state.attendance[activeAttendanceKey.value]) state.attendance[activeAttendanceKey.value] = {};
  state.attendance[activeAttendanceKey.value][studentId] = {
    status,
    source,
    confidence,
    mediaId,
    checkedAt: new Date().toISOString(),
    notifiedAt: '',
    notificationStatus: ['absent', 'excused'].includes(status) ? 'queued' : '',
  };

  if (status === 'present') {
    const student = studentById(studentId);
    sendNotificationToStudent('arrival', student, activeClass.value, { silent: true });
    createShareArtifact('arrival', student, activeClass.value);
  }

  if (['absent', 'excused'].includes(status)) {
    enqueueNotification('absence_followup', studentId, activeClass.value.id, status === 'absent' ? 'Vắng học hôm nay' : 'Nghỉ phép hôm nay');
    toast('Đã điểm danh và đưa tin nhắn phụ huynh vào hàng đợi.');
  } else {
    toast(source === 'photo' ? 'Đã nhận diện ảnh và tự lưu điểm danh.' : 'Đã tự động lưu điểm danh.');
  }
}

function triggerPhotoInput() {
  photoInput.value?.click();
}

function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  processAttendancePhoto(file);
  event.target.value = '';
}

function processAttendancePhoto(file) {
  const eligible = classStudents.value.filter(student => student.photoConsentStatus === 'granted' && !activeAttendance.value[student.id]);
  const lowReview = classStudents.value.filter(student => student.photoConsentStatus !== 'granted').slice(0, 2);
  const mediaId = `media_${Date.now()}`;
  const matched = eligible.slice(0, Math.max(1, Math.min(3, eligible.length)));
  const previewUrl = URL.createObjectURL(file);

  matched.forEach((student, index) => {
    markAttendance(student.id, 'present', 'photo', index === 0 ? 0.94 : 0.88, mediaId);
  });

  state.attendanceMedia.unshift({
    id: mediaId,
    classId: activeClass.value.id,
    fileName: file.name,
    capturedAt: new Date().toISOString(),
    previewUrl,
    matchedStudentIds: matched.map(item => item.id),
    reviewStudentIds: lowReview.map(item => item.id),
    status: lowReview.length ? 'review' : 'matched',
  });

  if (lowReview.length) {
    toast(`Đã tự điểm danh ${matched.length} học sinh, ${lowReview.length} hồ sơ cần xác nhận vì thiếu consent hoặc ảnh mẫu.`);
  }
}

function confirmPhotoReview(media, studentId) {
  markAttendance(studentId, 'present', 'photo_review', 0.62, media.id);
  media.reviewStudentIds = media.reviewStudentIds.filter(id => id !== studentId);
  media.status = media.reviewStudentIds.length ? 'review' : 'matched';
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

function openCreateClassModal() {
  state.modal = {
    type: 'createClass',
    name: '',
    colorKey: 'peach',
    feeType: 'per_session',
    feeAmount: 150000,
    description: '',
    weeklySchedule: [{ day: 'T2', start: '18:00', end: '19:30' }],
  };
}

function addScheduleRow() {
  state.modal.weeklySchedule.push({ day: 'T4', start: '18:00', end: '19:30' });
}

function removeScheduleRow(index) {
  if (state.modal.weeklySchedule.length === 1) return;
  state.modal.weeklySchedule.splice(index, 1);
}

function createClass() {
  if (!state.modal.name.trim()) {
    toast('Vui lòng nhập tên lớp.');
    return;
  }
  const newClass = {
    id: `cls_${Date.now()}`,
    name: state.modal.name.trim(),
    icon: 'School',
    colorKey: state.modal.colorKey,
    teacherId: state.user.id === 'usr_001' ? 'tea_001' : 'tea_001',
    schedule: state.modal.weeklySchedule.map(item => item.day),
    weeklySchedule: state.modal.weeklySchedule.map(item => ({ ...item })),
    time: `${state.modal.weeklySchedule[0].start} - ${state.modal.weeklySchedule[0].end}`,
    feeType: state.modal.feeType,
    feeAmount: Number(state.modal.feeAmount || 0),
    studentIds: [],
    status: 'active',
    description: state.modal.description,
  };
  state.classes.unshift(newClass);
  state.selectedClassId = newClass.id;
  closeModal();
  toast('Đã tạo lớp mới và lưu lịch học hàng tuần.');
}

function openPaymentModal(student) {
  const firstClass = studentClasses(student.id)[0] || state.classes[0];
  state.modal = {
    type: 'payment',
    studentId: student.id,
    classId: firstClass.id,
    amount: debtOf(student) || firstClass.feeAmount,
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

function openLedgerModal(student) {
  const ledger = ledgerByStudent(student.id);
  state.modal = {
    type: 'ledger',
    studentId: student.id,
    teacherNote: ledger.teacherNote,
    lastSession: ledger.lastSession,
    nextGoal: ledger.nextGoal,
    parentMessage: ledger.parentMessage,
    behavior: ledger.behavior,
    homework: ledger.homework,
    score: ledger.score,
  };
}

function openInvoiceDrawer(mode = 'single', student = null) {
  const selectedStudent = student || state.students.find(item => debtOf(item) > 0) || state.students[0];
  const classItem = studentClasses(selectedStudent.id)[0] || state.classes[0];
  state.drawer = {
    type: 'invoice',
    step: 0,
    mode,
    studentId: selectedStudent.id,
    classId: classItem.id,
    feeType: classItem.feeType,
    period: 'Tháng 07/2026',
    amount: debtOf(selectedStudent) || classItem.feeAmount,
    discount: 0,
    template: 'Rico hồng',
    sendParent: true,
  };
}

function closeDrawer() {
  state.drawer = null;
}

function nextInvoiceStep() {
  if (state.drawer.step < invoiceSteps.length - 1) state.drawer.step += 1;
  else createInvoice();
}

function createInvoice() {
  const student = studentById(state.drawer.studentId);
  const classItem = classById(state.drawer.classId);
  const amount = Math.max(0, Number(state.drawer.amount || 0) - Number(state.drawer.discount || 0));
  const invoice = {
    id: `inv_${Date.now()}`,
    studentId: student.id,
    classId: classItem.id,
    period: state.drawer.period,
    amount,
    status: 'unpaid',
    createdAt: todayIso,
  };
  state.invoices.unshift(invoice);
  if (state.drawer.sendParent) {
    sendNotificationToStudent('remind_fee', student, classItem);
    createShareArtifact('invoice', student, classItem, { amount, period: state.drawer.period });
  }
  closeDrawer();
  toast('Đã tạo phiếu học phí và chuẩn bị nội dung gửi phụ huynh.');
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
    createShareArtifact('payment', student, classById(state.modal.classId), { amount });
  }

  closeModal();
  toast('Đã ghi nhận học phí, cập nhật công nợ và tạo xác nhận phụ huynh.');
}

function sendNotificationToStudent(type, student, classItem, options = {}) {
  if (!student) return;
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
    error: channelStatus(channel) === 'manual' ? 'Chưa đủ cấu hình OA/ZNS hoặc cần giáo viên share thủ công.' : '',
  });
  student.lastNotifiedAt = todayIso;
  if (!options.silent) toast('Đã tạo thông báo phụ huynh.');
}

function sendNotification() {
  const classItem = selectedNotifyClass.value;
  const recipients = notificationRecipients();
  recipients.forEach(student => {
    sendNotificationToStudent(state.notifyType, student, classItem, { silent: true });
    createShareArtifact(state.notifyType, student, classItem);
  });
  state.notificationQueue = state.notificationQueue.filter(item => !recipients.some(student => student.id === item.studentId));
  toast(`Đã xử lý ${recipients.length} thông báo phụ huynh.`);
}

function sendQueued(item) {
  const student = studentById(item.studentId);
  if (!student) return;
  sendNotificationToStudent(item.type, student, classById(item.classId));
  createShareArtifact(item.type, student, classById(item.classId));
  state.notificationQueue = state.notificationQueue.filter(queueItem => queueItem.id !== item.id);
  toast('Đã xử lý tin nhắn trong hàng đợi.');
}

function notificationRecipients() {
  if (state.notifyAudience === 'debt') return state.students.filter(student => debtOf(student) > 0);
  if (state.notifyAudience === 'absence') return state.notificationQueue.map(item => studentById(item.studentId)).filter(Boolean);
  return selectedNotifyClass.value.studentIds.map(studentById).filter(Boolean);
}

function createReportData(student, classItem) {
  const ledger = ledgerByStudent(student.id);
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
    lastSession: ledger.lastSession,
    nextGoal: ledger.nextGoal,
    parentMessage: ledger.parentMessage,
    behavior: ledger.behavior,
    homework: ledger.homework,
    score: ledger.score,
  };
}

function ledgerByStudent(studentId) {
  const student = studentById(studentId);
  const fallback = {
    teacherNote: student?.note || 'Chưa có ghi chú riêng.',
    lastSession: 'Chưa cập nhật nhật ký buổi học gần nhất.',
    nextGoal: 'Chưa đặt mục tiêu buổi tới.',
    parentMessage: 'Rico Study sẽ cập nhật tình hình học tập sau buổi học.',
    behavior: 'Chưa đánh giá',
    homework: 'Chưa cập nhật',
    score: '',
  };
  return state.ledgerNotes[studentId] || fallback;
}

function saveLedgerModal() {
  const student = studentById(state.modal.studentId);
  if (!student) return;
  state.ledgerNotes[student.id] = {
    teacherNote: state.modal.teacherNote,
    lastSession: state.modal.lastSession,
    nextGoal: state.modal.nextGoal,
    parentMessage: state.modal.parentMessage,
    behavior: state.modal.behavior,
    homework: state.modal.homework,
    score: state.modal.score,
  };
  student.note = state.modal.teacherNote || student.note;
  closeModal();
  toast('Đã cập nhật Sổ liên lạc cho học sinh.');
}

function createParentReport(studentId, classId) {
  const student = studentById(studentId);
  const classItem = classById(classId);
  const data = createReportData(student, classItem);
  const existing = state.parentReports.find(item => item.studentId === studentId && item.classId === classId);
  if (existing) {
    existing.data = data;
    existing.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10);
    createShareArtifact('learning_report', student, classItem, data);
    return existing;
  }
  const report = {
    id: `report_${Date.now()}_${studentId}`,
    token: `rico-${studentId}-${Date.now()}`,
    studentId,
    classId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10),
    data,
  };
  state.parentReports.unshift(report);
  createShareArtifact('learning_report', student, classItem, data);
  return report;
}

function createShareArtifact(type, student, classItem, extra = {}) {
  if (!student || !classItem) return null;
  const labels = {
    arrival: 'Đã đến lớp',
    payment: 'Xác nhận học phí',
    invoice: 'Phiếu học phí',
    remind_fee: 'Nhắc học phí',
    learning_report: 'Sổ liên lạc',
    absence_followup: 'Thông tin vắng học',
  };
  const artifact = {
    id: `share_${Date.now()}_${student.id}`,
    type,
    title: labels[type] || 'Thông báo Rico Study',
    studentId: student.id,
    classId: classItem.id,
    createdAt: new Date().toISOString(),
    message: type === 'learning_report' ? buildLedgerMessage(student, classItem) : buildTemplate(type, classItem, student),
    amount: extra.amount || debtOf(student),
    period: extra.period || 'Tháng 07/2026',
  };
  state.shareArtifacts.unshift(artifact);
  return artifact;
}

function buildLedgerMessage(student, classItem) {
  const report = createReportData(student, classItem);
  const ledger = ledgerByStudent(student.id);
  return `Sổ liên lạc ${student.name}: chuyên cần ${report.attendanceRate}%, buổi vắng ${report.absentCount}, điểm gần nhất ${ledger.score || 'chưa cập nhật'}, thái độ ${ledger.behavior}. Buổi gần nhất: ${ledger.lastSession}. Mục tiêu tới: ${ledger.nextGoal}. Công nợ: ${formatCurrency(debtOf(student))}.`;
}

async function shareArtifact(artifact) {
  const file = await makeShareImage(artifact);
  const text = `${artifact.title}\n${artifact.message}`;
  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: artifact.title, text, files: [file] });
      toast('Đã mở bảng chia sẻ trên thiết bị.');
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: artifact.title, text });
      toast('Đã mở bảng chia sẻ nội dung.');
      return;
    }
  } catch {
    // User cancellation or unsupported targets fall through to download.
  }
  downloadFile(file);
  await copyText(text, false);
  toast('Thiết bị chưa hỗ trợ share file, Rico Study đã tải ảnh và sao chép nội dung.');
}

function makeShareImage(artifact) {
  const student = studentById(artifact.studentId);
  const classItem = classById(artifact.classId);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#fff8fb');
  gradient.addColorStop(1, '#fff4ea');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#c93470';
  roundRect(ctx, 70, 70, 940, 160, 42);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 44px Arial';
  ctx.fillText('Rico Study', 110, 145);
  ctx.font = '500 27px Arial';
  ctx.fillText(artifact.title, 110, 188);
  ctx.fillStyle = '#2a203b';
  ctx.font = '700 58px Arial';
  wrapText(ctx, student.name, 90, 340, 900, 70);
  ctx.font = '500 34px Arial';
  ctx.fillStyle = '#776b85';
  wrapText(ctx, `${classItem.name} · ${classItem.time}`, 90, 430, 900, 48);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#f3d7e2';
  ctx.lineWidth = 2;
  roundRect(ctx, 90, 540, 900, 420, 34);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2a203b';
  ctx.font = '500 34px Arial';
  wrapText(ctx, artifact.message, 135, 625, 810, 52);
  ctx.fillStyle = '#c93470';
  ctx.font = '700 36px Arial';
  ctx.fillText(new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }), 135, 1050);
  ctx.fillStyle = '#776b85';
  ctx.font = '500 28px Arial';
  ctx.fillText(`Phụ huynh: ${student.parentName} · ${student.parentPhone}`, 135, 1108);
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob], `${artifact.title.toLowerCase().replaceAll(' ', '-')}-${student.id}.png`, { type: 'image/png' }));
    }, 'image/png');
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(' ');
  let line = '';
  words.forEach(word => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = `${word} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, x, y);
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function copyText(text, showToast = true) {
  try {
    await navigator.clipboard.writeText(text);
    if (showToast) toast('Đã sao chép nội dung.');
  } catch {
    if (showToast) toast('Không thể sao chép tự động, vui lòng chọn nội dung để sao chép.');
  }
}

function methodLabel(method) {
  return { cash: 'Tiền mặt', bank: 'Chuyển khoản', other: 'Khác' }[method] || method;
}

function apiHint() {
  return appScriptUrl ? 'Đã cấu hình Apps Script API' : 'Đang chạy chế độ demo local';
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch {
    state.pushStatus = 'Trình duyệt chưa đăng ký được service worker';
  }
}

async function enablePushNotifications() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    state.pushStatus = 'Trình duyệt chưa hỗ trợ thông báo nền';
    toast(state.pushStatus);
    return;
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    state.pushStatus = 'Chưa cấp quyền';
    toast('Bạn chưa cấp quyền thông báo.');
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  try {
    let subscriptionPayload = {};
    if (vapidPublicKey && registration.pushManager) {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      subscriptionPayload = subscription.toJSON();
    }
    const response = await fetch('/api/push/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: state.user.id, preferences: state.settings.notifications, userAgent: navigator.userAgent, ...subscriptionPayload }),
    });
    state.pushStatus = response.ok && vapidPublicKey ? 'Đã bật thông báo thiết bị' : 'Đã cấp quyền, đang chờ cấu hình VAPID để gửi khi app đóng';
  } catch {
    state.pushStatus = 'Đã cấp quyền, dùng nhắc trong app khi chưa có API push';
  }
  registration.showNotification('Rico Study đã bật thông báo', {
    body: 'Bạn sẽ nhận nhắc trước giờ dạy, học phí và cảnh báo nghỉ nhiều buổi.',
    icon: '/rivex-solutions-favicon.png',
    badge: '/rivex-solutions-favicon.png',
  });
  toast(state.pushStatus);
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function runDemoReminder() {
  if (state.settings.notifications.classReminder) {
    toast(`Nhắc thử: ${activeClass.value.name} bắt đầu lúc ${activeClass.value.time}.`);
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => registration.showNotification('Sắp đến giờ dạy', {
        body: `${activeClass.value.name} · ${activeClass.value.time}`,
        icon: '/rivex-solutions-favicon.png',
      }));
    }
  }
}

function addExpense() {
  const amount = Number(state.modal.amount || 0);
  if (!state.modal.name || amount <= 0) {
    toast('Vui lòng nhập tên khoản chi và số tiền hợp lệ.');
    return;
  }
  state.expenses.unshift({ id: `exp_${Date.now()}`, name: state.modal.name, amount, date: state.modal.date || todayIso });
  closeModal();
  toast('Đã thêm khoản chi vào thống kê lời lãi.');
}

function toast(message) {
  state.toast = message;
  window.setTimeout(() => {
    state.toast = '';
  }, 2600);
}
</script>

<template>
  <section v-if="!state.isAuthenticated" class="login-screen">
    <form class="login-card" @submit.prevent="login">
      <img class="login-logo" src="/rivex-solutions-favicon.png" alt="Rico Study" />
      <div class="brandmark">Rico Study<span>.</span></div>
      <p class="login-sub">Quản lý lớp học, điểm danh ảnh, học phí và chia sẻ tình hình học tập với phụ huynh thật gọn.</p>
      <label class="field">
        <span>Email hoặc tên đăng nhập</span>
        <input v-model="state.login.email" name="email" type="text" autocomplete="username" />
      </label>
      <label class="field">
        <span>Mật khẩu</span>
        <input v-model="state.login.password" name="password" type="password" autocomplete="current-password" />
      </label>
      <button type="submit" class="btn btn-primary btn-block">
        <LogIn :size="17" />
        Đăng nhập
      </button>
      <div class="login-demo">Bản demo Rico Study. Nhấn Đăng nhập để xem dữ liệu mẫu và các workflow mới.</div>
    </form>
  </section>

  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img class="app-logo" src="/rivex-solutions-favicon.png" alt="Rico Study" />
        <div class="brandmark">Rico Study<span>.</span></div>
      </div>
      <nav class="nav-sections" aria-label="Điều hướng chính">
        <section v-for="section in navSections" :key="section.label" class="nav-section">
          <p>{{ section.label }}</p>
          <button
            v-for="item in section.items"
            :key="item.id"
            type="button"
            class="nav-item"
            :class="{ active: state.activeView === item.id }"
            @click="setView(item.id)"
          >
            <component :is="item.icon" :size="18" />
            <span>{{ item.label }}</span>
          </button>
        </section>
      </nav>
      <div class="sidebar-footer">
        <button type="button" class="collapse-btn" @click="toast('Thu gọn sidebar sẽ bật khi nối layout đa người dùng.')">
          <PanelLeftClose :size="16" /> Thu gọn
        </button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <label class="global-search">
          <Search :size="17" />
          <input v-model="state.studentSearch" name="globalSearch" type="search" placeholder="Tìm trang, lớp, học sinh..." />
          <kbd>⌘K</kbd>
        </label>
        <div class="top-actions">
          <button type="button" class="icon-btn" title="Nhắc thử" @click="runDemoReminder"><Moon :size="17" /></button>
          <button type="button" class="icon-btn" title="Thông báo" @click="setView('notify')"><Bell :size="17" /></button>
          <span class="sync-pill"><span></span>{{ appScriptUrl ? 'Đã đồng bộ' : 'Demo local' }}</span>
          <button type="button" class="month-pill"><ChevronLeft :size="16" /> Tháng 07 / 2026 <ChevronRight :size="16" /></button>
          <button type="button" class="user-pill" @click="logout"><span>{{ state.user.initials }}</span>{{ state.user.name }}<ChevronDown :size="16" /></button>
        </div>
      </header>

      <section v-if="state.activeView === 'dashboard'" class="content">
        <div class="page-head">
          <p>Hôm nay</p>
          <h1>Việc cần xử lý trong lớp học</h1>
          <span>Rico Study tự gom lịch dạy, điểm danh, công nợ và tin cần gửi phụ huynh.</span>
        </div>
        <div class="metric-grid">
          <article class="metric-card"><div class="metric-icon pink"><School :size="21" /></div><strong>{{ dashboard.classesToday }}</strong><span>Lớp dạy hôm nay</span></article>
          <article class="metric-card"><div class="metric-icon green"><WalletCards :size="21" /></div><strong>{{ formatCurrency(dashboard.totalPaid) }}</strong><span>Đã thu</span></article>
          <article class="metric-card"><div class="metric-icon amber"><CircleDollarSign :size="21" /></div><strong>{{ formatCurrency(dashboard.totalDebt) }}</strong><span>Công nợ</span></article>
          <article class="metric-card"><div class="metric-icon blue"><UserX :size="21" /></div><strong>{{ dashboard.riskStudents.length }}</strong><span>Cần theo sát</span></article>
        </div>
        <div class="task-grid">
          <article v-for="task in tasks" :key="task.id" class="task-card">
            <div :class="['metric-icon', task.tone]"><component :is="task.icon" :size="20" /></div>
            <h3>{{ task.title }}</h3>
            <p>{{ task.sub }}</p>
            <button type="button" class="text-link" @click="setView(task.view)">{{ task.action }} <ArrowRight :size="15" /></button>
          </article>
        </div>
        <div class="split-grid">
          <section class="panel">
            <div class="panel-title">
              <h2>Lịch dạy tiếp theo</h2>
              <button type="button" class="text-link" @click="setView('schedule')">Xem lịch</button>
            </div>
            <article v-for="classItem in state.classes" :key="classItem.id" class="schedule-row">
              <strong>{{ classItem.schedule[0] }}</strong>
              <span class="class-dot" :style="{ background: classColor(classItem.colorKey).value }"></span>
              <div><b>{{ classItem.name }}</b><small>{{ classItem.time }} · {{ teacherById(classItem.teacherId).name }}</small></div>
            </article>
          </section>
          <section class="panel">
            <div class="panel-title">
              <h2>Phụ huynh cần nhắn</h2>
              <button type="button" class="text-link" @click="setView('notify')">Gửi ngay</button>
            </div>
            <article v-for="item in state.notificationQueue.slice(0, 4)" :key="item.id" class="mini-row">
              <div class="avatar">{{ initials(studentById(item.studentId)?.name) }}</div>
              <div><b>{{ studentById(item.studentId)?.name }}</b><small>{{ item.reason }} · {{ classById(item.classId).name }}</small></div>
            </article>
            <div v-if="!state.notificationQueue.length" class="empty-state small">Không có tin nhắn nào đang chờ.</div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'classes'" class="content">
        <div class="page-head compact">
          <p>Dạy & học</p>
          <h1>Lớp học</h1>
          <span>Tạo lớp theo màu nhận diện, kiểu học phí và lịch học hàng tuần.</span>
        </div>
        <div class="toolbar">
          <button type="button" class="chip active">Tất cả</button>
          <button v-for="type in ['Theo buổi', 'Theo tháng', 'Theo gói', 'Trọn khóa']" :key="type" type="button" class="chip">{{ type }}</button>
          <span class="spacer"></span>
          <button type="button" class="btn btn-primary btn-sm" @click="openCreateClassModal"><Plus :size="16" /> Tạo lớp mới</button>
        </div>
        <div class="class-grid">
          <article v-for="classItem in state.classes" :key="classItem.id" class="class-card" @click="openClassModal(classItem)">
            <div class="class-banner" :style="{ background: classColor(classItem.colorKey).value }"></div>
            <div class="class-top">
              <div class="class-icon"><component :is="classItem.icon" :size="22" /></div>
              <div>
                <h3>{{ classItem.name }}</h3>
                <p>{{ classItem.schedule.join(', ') }} · {{ classItem.time }}</p>
              </div>
            </div>
            <span>{{ feeTypeLabel(classItem.feeType) }} · {{ formatCurrency(classItem.feeAmount) }}</span>
            <footer><span>{{ classItem.studentIds.length }} học sinh</span><span>{{ teacherById(classItem.teacherId).name }}</span></footer>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'schedule'" class="content">
        <div class="page-head compact">
          <p>Lịch tuần</p>
          <h1>Lịch dạy</h1>
          <span>Rico Study dùng lịch này để nhắc trước giờ dạy và xuất sang lịch ngoài.</span>
        </div>
        <div class="toolbar">
          <div class="view-toggle" aria-label="Đổi kiểu hiển thị lịch dạy">
            <button type="button" :class="{ active: state.layouts.schedule === 'list' }" @click="state.layouts.schedule = 'list'">List</button>
            <button type="button" :class="{ active: state.layouts.schedule === 'grid' }" @click="state.layouts.schedule = 'grid'">Grid</button>
          </div>
        </div>
        <section class="panel">
          <div :class="state.layouts.schedule === 'grid' ? 'card-grid schedule-grid' : 'stack-list'">
          <article v-for="classItem in state.classes" :key="classItem.id" class="schedule-card">
            <div class="class-dot large" :style="{ background: classColor(classItem.colorKey).value }"></div>
            <div>
              <h3>{{ classItem.name }}</h3>
              <p>{{ classItem.weeklySchedule.map(item => `${item.day} ${item.start}-${item.end}`).join(' · ') }}</p>
            </div>
            <button type="button" class="btn btn-soft btn-sm" @click="toast('Xuất Google/Apple Calendar đang ở chế độ demo.')"><CalendarDays :size="16" /> Xuất lịch</button>
          </article>
          </div>
        </section>
      </section>

      <section v-if="state.activeView === 'students'" class="content">
        <div class="page-head compact">
          <p>Học sinh</p>
          <h1>Danh sách học sinh</h1>
          <span>Quản lý thông tin phụ huynh, ảnh đại diện, consent và công nợ.</span>
        </div>
        <div class="toolbar">
          <label class="local-search"><Search :size="17" /><input v-model="state.studentSearch" name="studentSearch" type="search" placeholder="Tìm học sinh, phụ huynh, số điện thoại..." /></label>
          <div class="view-toggle" aria-label="Đổi kiểu hiển thị học sinh">
            <button type="button" :class="{ active: state.layouts.students === 'list' }" @click="state.layouts.students = 'list'">List</button>
            <button type="button" :class="{ active: state.layouts.students === 'grid' }" @click="state.layouts.students = 'grid'">Grid</button>
          </div>
          <button type="button" class="btn btn-soft btn-sm" @click="toast('Import Excel/CSV đang ở chế độ demo.')"><FileUp :size="16" /> Import</button>
          <button type="button" class="btn btn-primary btn-sm" @click="toast('Thêm học sinh sẽ nối Google Sheet ở bước backend.')"><Plus :size="16" /> Thêm học sinh</button>
        </div>
        <div :class="state.layouts.students === 'grid' ? 'card-grid student-grid' : 'list'">
          <article v-for="student in filteredStudents" :key="student.id" :class="state.layouts.students === 'grid' ? 'student-card' : 'list-row'" @click="openStudentModal(student)">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="list-main">
              <b>{{ student.name }}</b>
              <span>{{ studentClasses(student.id).map(item => item.name).join(', ') || 'Chưa xếp lớp' }} · PH: {{ student.parentName }}</span>
            </div>
            <span :class="['tag', student.photoConsentStatus === 'granted' ? 'tag-green' : 'tag-amber']">{{ student.photoConsentStatus === 'granted' ? 'Đã đồng ý ảnh' : 'Cần consent' }}</span>
            <span :class="['tag', debtOf(student) > 0 ? 'tag-pink' : 'tag-green']">{{ debtOf(student) > 0 ? `Nợ ${formatCurrency(debtOf(student))}` : 'Đã đóng đủ' }}</span>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'attendance'" class="content">
        <div class="page-head compact">
          <p>Điểm danh nhanh</p>
          <h1>Điểm danh bằng ảnh hoặc một chạm</h1>
          <span>Ảnh chỉ tự nhận diện học sinh đã có consent; hồ sơ thiếu consent được đưa vào hàng chờ xác nhận.</span>
        </div>
        <div class="toolbar sticky-toolbar">
          <select v-model="state.selectedClassId" name="attendanceClass" class="select-chip">
            <option v-for="classItem in state.classes" :key="classItem.id" :value="classItem.id">{{ classItem.name }}</option>
          </select>
          <input v-model="state.attendanceDate" name="attendanceDate" type="date" class="select-chip" />
          <div class="view-toggle" aria-label="Đổi kiểu hiển thị điểm danh">
            <button type="button" :class="{ active: state.layouts.attendance === 'list' }" @click="state.layouts.attendance = 'list'">List</button>
            <button type="button" :class="{ active: state.layouts.attendance === 'grid' }" @click="state.layouts.attendance = 'grid'">Grid</button>
          </div>
          <span class="spacer"></span>
          <input ref="photoInput" class="visually-hidden" name="attendancePhoto" type="file" accept="image/*" capture="environment" @change="handlePhotoUpload" />
          <button type="button" class="btn btn-soft btn-sm" @click="triggerPhotoInput"><Camera :size="16" /> Chụp / tải ảnh</button>
          <button type="button" class="btn btn-primary btn-sm" @click="state.shareArtifacts[0] ? shareArtifact(state.shareArtifacts[0]) : toast('Chưa có thẻ chia sẻ nào.')"><Share2 :size="16" /> Share gần nhất</button>
          <span class="hint">Đã điểm danh {{ Object.keys(activeAttendance).length }}/{{ classStudents.length }}</span>
        </div>
        <div v-if="state.attendanceMedia.length" class="media-strip">
          <article v-for="media in state.attendanceMedia.slice(0, 3)" :key="media.id" class="media-card">
            <img :src="media.previewUrl" alt="Ảnh điểm danh đã tải lên" />
            <div>
              <b>{{ media.matchedStudentIds.length }} học sinh đã tự điểm danh</b>
              <span>{{ media.reviewStudentIds.length }} cần xác nhận</span>
              <div class="tag-row">
                <button v-for="studentId in media.reviewStudentIds" :key="studentId" type="button" class="tag tag-amber" @click="confirmPhotoReview(media, studentId)">
                  Xác nhận {{ studentById(studentId)?.name }}
                </button>
              </div>
            </div>
          </article>
        </div>
        <div :class="state.layouts.attendance === 'grid' ? 'card-grid attendance-grid' : 'attendance-list'">
          <article v-for="student in classStudents" :key="student.id" :class="state.layouts.attendance === 'grid' ? 'att-card' : 'att-row'">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="att-name">
              <b>{{ student.name }}</b>
              <span>{{ attendanceLabel(activeAttendance[student.id]?.status) }} · {{ activeAttendance[student.id]?.source === 'photo' ? `Ảnh ${Math.round((activeAttendance[student.id]?.confidence || 0) * 100)}%` : 'Một chạm' }}</span>
            </div>
            <div class="att-buttons">
              <button v-for="status in attendanceStatuses" :key="status.id" type="button" class="att-btn" :class="[status.id, { on: activeAttendance[student.id]?.status === status.id }]" @click="markAttendance(student.id, status.id)">
                <component :is="status.icon" :size="14" /> {{ status.label }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'ledger'" class="content">
        <div class="page-head compact">
          <p>Sổ liên lạc</p>
          <h1>Trang theo dõi học tập cho phụ huynh</h1>
          <span>Mỗi học sinh có chuyên cần, lịch học, nhật ký buổi, học phí và link chia sẻ riêng.</span>
        </div>
        <div class="toolbar">
          <div class="view-toggle" aria-label="Đổi kiểu hiển thị sổ liên lạc">
            <button type="button" :class="{ active: state.layouts.ledger === 'list' }" @click="state.layouts.ledger = 'list'">List</button>
            <button type="button" :class="{ active: state.layouts.ledger === 'grid' }" @click="state.layouts.ledger = 'grid'">Grid</button>
          </div>
        </div>
        <div :class="state.layouts.ledger === 'grid' ? 'ledger-grid' : 'ledger-list'">
          <article v-for="student in state.students.slice(0, 6)" :key="student.id" class="ledger-card">
            <div class="ledger-head">
              <div class="avatar large">{{ initials(student.name) }}</div>
              <div>
                <h3>{{ student.name }}</h3>
                <p>{{ studentClasses(student.id).map(item => item.name).join(', ') || 'Chưa xếp lớp' }}</p>
              </div>
            </div>
            <div class="ledger-parent">
              <b>{{ student.parentName }}</b>
              <span>{{ student.parentPhone }} · {{ student.parentEmail }}</span>
            </div>
            <div class="ledger-stats">
              <span><b>{{ createReportData(student, studentClasses(student.id)[0] || state.classes[0]).attendanceRate }}%</b> chuyên cần</span>
              <span><b>{{ formatCurrency(debtOf(student)) }}</b> công nợ</span>
              <span><b>{{ ledgerByStudent(student.id).score || '—' }}</b> điểm gần nhất</span>
              <span><b>{{ ledgerByStudent(student.id).behavior }}</b> thái độ</span>
            </div>
            <p class="ledger-note">{{ ledgerByStudent(student.id).lastSession }}</p>
            <p class="ledger-goal">{{ ledgerByStudent(student.id).nextGoal }}</p>
            <div class="ledger-actions">
              <button type="button" class="btn btn-soft btn-sm" @click="openLedgerModal(student)">Chi tiết / sửa</button>
              <button type="button" class="btn btn-primary btn-sm" @click="openReportModal(student)"><Share2 :size="16" /> Tạo ảnh share</button>
            </div>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'invoices'" class="content">
        <div class="page-head compact">
          <p>Học phí</p>
          <h1>Phiếu học phí</h1>
          <span>Tạo phiếu một học sinh hoặc hàng loạt, tự điền khoản còn nợ và gửi phụ huynh.</span>
        </div>
        <div class="toolbar">
          <button type="button" class="btn btn-primary btn-sm" @click="openInvoiceDrawer('single')"><Plus :size="16" /> Tạo hóa đơn</button>
          <button type="button" class="btn btn-soft btn-sm" @click="openInvoiceDrawer('bulk')"><Users :size="16" /> Tạo hàng loạt</button>
          <span class="spacer"></span>
          <div class="view-toggle" aria-label="Đổi kiểu hiển thị phiếu học phí">
            <button type="button" :class="{ active: state.layouts.invoices === 'list' }" @click="state.layouts.invoices = 'list'">List</button>
            <button type="button" :class="{ active: state.layouts.invoices === 'grid' }" @click="state.layouts.invoices = 'grid'">Grid</button>
          </div>
        </div>
        <div :class="state.layouts.invoices === 'grid' ? 'card-grid invoice-grid' : 'list'">
          <article v-for="invoice in state.invoices" :key="invoice.id" :class="state.layouts.invoices === 'grid' ? 'invoice-card' : 'list-row no-hover'">
            <div class="metric-icon pink"><ReceiptText :size="18" /></div>
            <div class="list-main">
              <b>{{ studentById(invoice.studentId)?.name }} · {{ invoice.period }}</b>
              <span>{{ classById(invoice.classId).name }} · tạo ngày {{ invoice.createdAt }}</span>
            </div>
            <strong>{{ formatCurrency(invoice.amount) }}</strong>
            <span :class="['tag', invoice.status === 'paid' ? 'tag-green' : invoice.status === 'partial' ? 'tag-amber' : 'tag-pink']">{{ statusLabel(invoice.status) }}</span>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'autoFee'" class="content">
        <div class="auto-fee-hero">
          <div>
            <p>Học phí tự động</p>
            <h1>Tự động thu học phí ngay khi tiền về.</h1>
            <span>Rico Study nhắc phụ huynh đóng học phí, tạo phiếu, ghi nhận chuyển khoản và cảnh báo thu thiếu hoặc thu dư.</span>
            <div class="hero-actions">
              <button type="button" class="btn btn-primary" @click="state.modal = { type: 'trial' }">Đăng ký dùng thử <ArrowRight :size="17" /></button>
              <button type="button" class="btn btn-soft" @click="setView('guide')">Xem cách hoạt động</button>
            </div>
          </div>
          <section class="today-fees">
            <h3>Học phí về hôm nay</h3>
            <article v-for="student in state.students.filter(item => debtOf(item) <= 0).slice(0, 3)" :key="student.id">
              <span class="metric-icon green"><BadgeCheck :size="17" /></span>
              <div><b>{{ student.name }}</b><small>{{ studentClasses(student.id)[0]?.name }} · học phí tháng 7</small></div>
              <strong>{{ formatCurrency(student.paid) }}</strong>
              <em>Đã thu</em>
            </article>
          </section>
        </div>
        <div class="trust-strip">
          <span><ShieldCheck :size="17" /> Tiền chuyển thẳng vào tài khoản của bạn.</span>
          <span><Lock :size="17" /> Không chia sẻ mật khẩu ngân hàng.</span>
          <span><Bell :size="17" /> Nhắc học phí qua Zalo khi đủ cấu hình.</span>
        </div>
        <div class="step-grid">
          <article><Smartphone :size="22" /><b>Rico cài đặt giúp bạn</b><span>Kết nối Zalo, mẫu phiếu và tài khoản nhận tiền.</span></article>
          <article><QrCode :size="22" /><b>Phụ huynh quét QR</b><span>Nội dung chuyển khoản điền sẵn theo từng phiếu.</span></article>
          <article><BadgeCheck :size="22" /><b>Phiếu tự ghi Đã thu</b><span>Đối soát, cập nhật công nợ và gửi xác nhận.</span></article>
        </div>
      </section>

      <section v-if="state.activeView === 'stats'" class="content">
        <div class="page-head compact">
          <p>Thống kê</p>
          <h1>Thống kê</h1>
          <span>Chuyên cần, doanh thu và cảnh báo nguy cơ nghỉ học.</span>
        </div>
        <div class="tabbar">
          <button v-for="tab in ['attendance', 'revenue', 'profit', 'alerts', 'debt']" :key="tab" type="button" :class="{ active: state.reportTab === tab }" @click="state.reportTab = tab">
            {{ { attendance: 'Chuyên cần', revenue: 'Doanh thu', profit: 'Lời lãi', alerts: 'Cảnh báo', debt: 'Công nợ' }[tab] }}
          </button>
        </div>
        <div class="metric-grid">
          <article class="metric-card"><span>Đã thu</span><strong>{{ formatCurrency(revenue) }}</strong><small>đã thu đủ</small></article>
          <article class="metric-card"><span>Chi phí</span><strong>{{ formatCurrency(expenseTotal) }}</strong><small>{{ state.expenses.length }} khoản</small></article>
          <article class="metric-card"><span>Lợi nhuận</span><strong>{{ formatCurrency(profit) }}</strong><small>đã thu - chi phí</small></article>
          <article class="metric-card"><span>Biên lợi nhuận</span><strong>{{ revenue ? `${Math.round((profit / revenue) * 100)}%` : '—' }}</strong><small>trên tiền đã thu</small></article>
        </div>
        <section class="panel empty-profit" v-if="state.reportTab === 'profit'">
          <ChartNoAxesColumnIncreasing :size="42" />
          <h3>{{ state.expenses.length ? 'Đã có dữ liệu lời lãi' : 'Chưa có dữ liệu lời lãi' }}</h3>
          <p>Tạo phiếu học phí để có doanh thu và ghi các khoản chi để xem lãi/lỗ vận hành.</p>
          <button type="button" class="btn btn-primary" @click="state.modal = { type: 'expense', name: '', amount: 0, date: todayIso }"><Plus :size="17" /> Thêm chi phí</button>
        </section>
        <section v-else class="panel">
          <article v-for="student in state.students.filter(item => state.reportTab !== 'debt' || debtOf(item) > 0).slice(0, 6)" :key="student.id" class="list-row no-hover">
            <div class="avatar">{{ initials(student.name) }}</div>
            <div class="list-main"><b>{{ student.name }}</b><span>{{ student.note }}</span></div>
            <span class="tag tag-pink" v-if="riskScore(student) >= 2">Cần theo sát</span>
            <strong>{{ state.reportTab === 'debt' ? formatCurrency(debtOf(student)) : `${student.stars} sao` }}</strong>
          </article>
        </section>
      </section>

      <section v-if="state.activeView === 'pricing'" class="content pricing-page">
        <div class="pricing-head">
          <p>Bảng giá</p>
          <h1>Chọn gói <em>phù hợp</em></h1>
          <span>Bắt đầu miễn phí, nâng cấp khi cần thêm học sinh hoặc tính năng. Không ràng buộc, huỷ bất kỳ lúc nào.</span>
        </div>
        <div class="promo-bar"><Gift :size="24" /> <b>Ưu đãi mua lần đầu giảm 15%</b><span>03 ngày : 11 giờ : 16 phút : 50 giây</span><button type="button"><X :size="16" /></button></div>
        <div class="tabbar center"><button class="active">Thẻ</button><button>Bảng so sánh</button></div>
        <div class="pricing-grid">
          <article v-for="plan in pricingPlans" :key="plan.name" class="pricing-card" :class="{ popular: plan.popular, active: plan.active }">
            <span v-if="plan.popular" class="popular-badge">Phổ biến</span>
            <small v-if="plan.active">Đang dùng</small>
            <h3>{{ plan.name }}</h3>
            <p>{{ plan.limit }}</p>
            <strong>{{ plan.price ? `${formatCurrency(plan.price)} / năm` : 'Miễn phí' }}</strong>
            <ul><li v-for="feature in plan.features" :key="feature">✓ {{ feature }}</li></ul>
            <button type="button" class="btn btn-primary btn-sm" @click="state.modal = { type: 'trial' }">{{ plan.active ? 'Đang dùng' : 'Nâng cấp' }}</button>
          </article>
        </div>
      </section>

      <section v-if="state.activeView === 'guide'" class="content">
        <div class="page-head compact">
          <p>Hướng dẫn</p>
          <h1>Thiết lập nhanh Rico Study</h1>
          <span>Bật thông báo, thêm ảnh học sinh, tạo phiếu học phí và chia sẻ với phụ huynh.</span>
        </div>
        <div class="step-grid">
          <article><Bell :size="22" /><b>Bật thông báo thiết bị</b><span>Cấp quyền trong Cài đặt để nhận nhắc khi app đã đóng nếu trình duyệt hỗ trợ.</span></article>
          <article><Camera :size="22" /><b>Thêm ảnh học sinh</b><span>Chỉ dùng khi phụ huynh/học sinh đã đồng ý sử dụng ảnh nhận diện.</span></article>
          <article><Share2 :size="22" /><b>Share nhanh phụ huynh</b><span>Dùng Web Share API; nếu không hỗ trợ thì tải ảnh và copy nội dung.</span></article>
        </div>
      </section>

      <section v-if="state.activeView === 'notify'" class="content">
        <div class="page-head compact">
          <p>Thông báo</p>
          <h1>Trung tâm thông báo</h1>
          <span>Bật nhắc thiết bị, soạn Zalo/email và tạo thẻ chia sẻ cho phụ huynh.</span>
        </div>
        <section class="notice-info">
          <h3>Bật thông báo để nhận nhắc ngay trên thiết bị</h3>
          <p>Nhắc trước mỗi buổi dạy, khi đến kỳ thu học phí và khi học sinh có dấu hiệu nghỉ nhiều buổi. Bạn bật hoặc tắt từng loại trong phần Cài đặt.</p>
          <ul>
            <li>Nhắc trước giờ dạy theo lịch tuần, hoạt động cả khi đã đóng ứng dụng nếu trình duyệt hỗ trợ Web Push.</li>
            <li>Tổng hợp học sinh chưa đóng học phí vào đầu mỗi tháng.</li>
            <li>Cảnh báo sớm học sinh có nguy cơ nghỉ để kịp thời liên hệ phụ huynh.</li>
          </ul>
          <button type="button" class="btn btn-primary btn-sm" @click="enablePushNotifications"><Bell :size="16" /> Bật thông báo thiết bị</button>
          <span>{{ state.pushStatus }}</span>
        </section>
        <div class="split-grid">
          <section class="panel">
            <div class="panel-title"><h2>Soạn thông báo</h2></div>
            <label class="field"><span>Loại thông báo</span><select v-model="state.notifyType"><option v-for="item in notificationTypes" :key="item.id" :value="item.id">{{ item.label }}</option></select></label>
            <label class="field"><span>Gửi đến</span><select v-model="state.notifyAudience"><option value="class">Phụ huynh trong lớp</option><option value="debt">Học sinh còn công nợ</option><option value="absence">Hàng đợi vắng / nghỉ phép</option></select></label>
            <label class="field"><span>Lớp học</span><select v-model="state.notifyClassId"><option v-for="classItem in state.classes" :key="classItem.id" :value="classItem.id">{{ classItem.name }}</option></select></label>
            <div class="check-grid">
              <label><input v-model="state.notifyChannels.zalo" type="checkbox" /> Zalo OA / ZNS</label>
              <label><input v-model="state.notifyChannels.email" type="checkbox" /> Email</label>
              <label><input v-model="state.notifyChannels.share" type="checkbox" /> Thẻ share</label>
            </div>
            <button type="button" class="btn btn-primary btn-block" @click="sendNotification"><Send :size="17" /> Tạo và gửi thông báo</button>
          </section>
          <section class="panel preview-card">
            <div class="panel-title"><h2>Xem trước</h2></div>
            <p>{{ notificationPreview }}</p>
            <button type="button" class="btn btn-soft btn-sm" @click="copyText(notificationPreview)">Sao chép nội dung</button>
          </section>
        </div>
        <div class="split-grid">
          <section class="panel">
            <div class="panel-title"><h2>Hàng đợi tự động</h2></div>
            <article v-for="item in state.notificationQueue" :key="item.id" class="list-row no-hover">
              <div class="avatar"><MessageCircle :size="17" /></div>
              <div class="list-main"><b>{{ studentById(item.studentId)?.name }}</b><span>{{ item.reason }} · {{ classById(item.classId).name }}</span></div>
              <button type="button" class="btn btn-primary btn-sm" @click="sendQueued(item)">Xử lý</button>
            </article>
            <div v-if="!state.notificationQueue.length" class="empty-state small">Không có thông báo nào trong hàng đợi.</div>
          </section>
          <section class="panel">
            <div class="panel-title"><h2>Thẻ chia sẻ gần đây</h2></div>
            <div class="view-toggle compact" aria-label="Đổi kiểu hiển thị thẻ chia sẻ">
              <button type="button" :class="{ active: state.layouts.notifications === 'list' }" @click="state.layouts.notifications = 'list'">List</button>
              <button type="button" :class="{ active: state.layouts.notifications === 'grid' }" @click="state.layouts.notifications = 'grid'">Grid</button>
            </div>
            <div :class="state.layouts.notifications === 'grid' ? 'card-grid share-grid' : 'list'">
              <article v-for="artifact in state.shareArtifacts.slice(0, 5)" :key="artifact.id" :class="state.layouts.notifications === 'grid' ? 'share-card' : 'list-row no-hover'">
                <div class="metric-icon pink"><Image :size="17" /></div>
                <div class="list-main"><b>{{ artifact.title }}</b><span>{{ studentById(artifact.studentId)?.name }} · {{ classById(artifact.classId).name }} · PNG</span></div>
                <button type="button" class="btn btn-primary btn-sm" @click="shareArtifact(artifact)"><Share2 :size="16" /> Share ảnh</button>
              </article>
            </div>
            <div v-if="!state.shareArtifacts.length" class="empty-state small">Chưa có thẻ chia sẻ nào.</div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'settings'" class="content">
        <div class="page-head compact">
          <p>Cài đặt</p>
          <h1>Cài đặt Rico Study</h1>
          <span>Kết nối dữ liệu, Zalo và bật từng loại thông báo thiết bị.</span>
        </div>
        <div class="split-grid">
          <section class="panel">
            <div class="panel-title"><h2>Thông báo</h2><button type="button" class="btn btn-primary btn-sm" @click="enablePushNotifications">Bật trên thiết bị</button></div>
            <label class="switch-row"><span><b>Nhắc trước giờ dạy</b><small>Dựa theo lịch học hàng tuần của từng lớp.</small></span><input v-model="state.settings.notifications.classReminder" type="checkbox" /></label>
            <label class="switch-row"><span><b>Tổng hợp công nợ đầu tháng</b><small>Gửi danh sách học sinh chưa đóng học phí.</small></span><input v-model="state.settings.notifications.monthlyDebt" type="checkbox" /></label>
            <label class="switch-row"><span><b>Cảnh báo nguy cơ nghỉ học</b><small>Gợi ý liên hệ phụ huynh khi học sinh nghỉ nhiều buổi.</small></span><input v-model="state.settings.notifications.absenceRisk" type="checkbox" /></label>
            <label class="field inline"><span>Nhắc trước</span><input v-model.number="state.settings.notifications.reminderMinutes" type="number" min="5" step="5" /><em>phút</em></label>
            <p class="hint">{{ state.pushStatus }}</p>
          </section>
          <section class="panel">
            <div class="panel-title"><h2>Kết nối dữ liệu</h2></div>
            <label class="switch-row"><span><b>Google Sheet</b><small>Dữ liệu lưu trên Sheet của chính bạn.</small></span><input v-model="state.settings.sheetConnected" type="checkbox" /></label>
            <label class="field"><span>Google Sheet ID</span><input v-model="state.settings.sheetId" /></label>
            <label class="switch-row"><span><b>Zalo OA</b><small>Gửi tin cho phụ huynh đã quan tâm OA.</small></span><input v-model="state.settings.zaloConnected" type="checkbox" /></label>
            <label class="switch-row"><span><b>ZNS Template</b><small>Gửi thông báo theo số điện thoại khi mẫu đã duyệt.</small></span><input v-model="state.settings.znsConnected" type="checkbox" /></label>
            <label class="switch-row"><span><b>Email</b><small>Kênh dự phòng và gửi xác nhận.</small></span><input v-model="state.settings.emailConnected" type="checkbox" /></label>
          </section>
        </div>
        <div class="template-grid">
          <label v-for="item in notificationTypes" :key="item.id" class="template-card">
            <b>{{ item.label }}</b>
            <textarea v-model="state.templates[item.id]"></textarea>
            <span>{ten_hoc_sinh} · {ten_lop} · {gio_hoc} · {so_tien} · {ngay}</span>
          </label>
        </div>
      </section>
    </main>

    <button type="button" class="float-zalo" @click="setView('notify')">Zalo</button>
    <button type="button" class="float-gift" @click="state.modal = { type: 'trial' }"><Gift :size="22" /></button>

    <nav class="bottom-nav">
      <button v-for="id in bottomNav" :key="id" type="button" :class="{ active: state.activeView === id }" @click="setView(id)">
        <component :is="navItems.find(item => item.id === id)?.icon" :size="19" />
        {{ navItems.find(item => item.id === id)?.short }}
      </button>
    </nav>
  </div>

  <div v-if="state.modal" class="modal-overlay" @click.self="closeModal">
    <section v-if="state.modal.type === 'student'" class="modal">
      <header class="modal-head">
        <h3>Hồ sơ học sinh</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <template v-if="studentById(state.modal.studentId)">
        <div class="profile-head">
          <div class="avatar large">{{ initials(studentById(state.modal.studentId).name) }}</div>
          <div>
            <h3>{{ studentById(state.modal.studentId).name }}</h3>
            <p>Phụ huynh: {{ studentById(state.modal.studentId).parentName }} · {{ studentById(state.modal.studentId).parentPhone }}</p>
          </div>
        </div>
        <div class="metric-grid two">
          <div class="mini-stat"><span>Đã đóng</span><b>{{ formatCurrency(studentById(state.modal.studentId).paid) }}</b></div>
          <div class="mini-stat"><span>Còn nợ</span><b>{{ formatCurrency(debtOf(studentById(state.modal.studentId))) }}</b></div>
        </div>
        <div class="ledger-detail-grid compact">
          <div class="mini-stat"><span>Email phụ huynh</span><b>{{ studentById(state.modal.studentId).parentEmail }}</b></div>
          <div class="mini-stat"><span>Zalo</span><b>{{ studentById(state.modal.studentId).zaloFollowStatus === 'followed' ? 'Đã quan tâm OA' : 'Chưa đủ cấu hình' }}</b></div>
          <div class="mini-stat"><span>Điểm gần nhất</span><b>{{ ledgerByStudent(state.modal.studentId).score || 'Chưa có' }}</b></div>
          <div class="mini-stat"><span>Thái độ</span><b>{{ ledgerByStudent(state.modal.studentId).behavior }}</b></div>
        </div>
        <p class="hint">Consent ảnh: {{ studentById(state.modal.studentId).photoConsentStatus === 'granted' ? 'Đã đồng ý' : 'Chưa đủ điều kiện tự nhận diện' }}</p>
        <div class="tag-row"><span v-for="classItem in studentClasses(state.modal.studentId)" :key="classItem.id" class="tag tag-pink">{{ classItem.name }}</span></div>
        <p>{{ studentById(state.modal.studentId).note }}</p>
        <p class="ledger-goal">{{ ledgerByStudent(state.modal.studentId).nextGoal }}</p>
        <footer class="modal-foot">
          <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
          <button type="button" class="btn btn-soft" @click="openLedgerModal(studentById(state.modal.studentId))">Sửa sổ liên lạc</button>
          <button type="button" class="btn btn-soft" @click="openReportModal(studentById(state.modal.studentId))">Tạo ảnh share</button>
          <button type="button" class="btn btn-primary" @click="openPaymentModal(studentById(state.modal.studentId))">Thu học phí</button>
        </footer>
      </template>
    </section>

    <section v-if="state.modal.type === 'class'" class="modal">
      <header class="modal-head">
        <h3>{{ classById(state.modal.classId).name }}</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <p>{{ classById(state.modal.classId).description }}</p>
      <p class="hint">{{ classById(state.modal.classId).weeklySchedule.map(item => `${item.day} ${item.start}-${item.end}`).join(' · ') }}</p>
      <div class="mini-stat"><span>Học phí</span><b>{{ feeTypeLabel(classById(state.modal.classId).feeType) }} · {{ formatCurrency(classById(state.modal.classId).feeAmount) }}</b></div>
      <div class="list compact">
        <article v-for="studentId in classById(state.modal.classId).studentIds" :key="studentId" class="mini-row" @click="openStudentModal(studentById(studentId))">
          <div class="avatar">{{ initials(studentById(studentId).name) }}</div>
          <div><b>{{ studentById(studentId).name }}</b><small>{{ studentById(studentId).parentName }}</small></div>
        </article>
      </div>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
        <button type="button" class="btn btn-primary" @click="state.selectedClassId = state.modal.classId; closeModal(); setView('attendance')">Điểm danh lớp này</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'createClass'" class="modal modal-wide">
      <header class="modal-head">
        <h3>Thêm lớp mới</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <label class="field"><span>Tên lớp</span><input v-model="state.modal.name" placeholder="VD: Toán 9A" /></label>
      <div class="field">
        <span>Màu nhận diện</span>
        <div class="color-grid">
          <button v-for="color in classColors" :key="color.id" type="button" :class="{ active: state.modal.colorKey === color.id }" @click="state.modal.colorKey = color.id">
            <i :style="{ background: color.value }"></i>{{ color.label }}
          </button>
        </div>
      </div>
      <div class="field">
        <span>Kiểu tính học phí</span>
        <div class="segment">
          <button type="button" :class="{ active: state.modal.feeType === 'per_session' }" @click="state.modal.feeType = 'per_session'">Theo buổi</button>
          <button type="button" :class="{ active: state.modal.feeType === 'monthly' }" @click="state.modal.feeType = 'monthly'">Theo tháng</button>
          <button type="button" :class="{ active: state.modal.feeType === 'package' }" @click="state.modal.feeType = 'package'">Theo gói</button>
        </div>
        <small class="hint">Tính theo số buổi học thực tế trong tháng.</small>
      </div>
      <label class="field"><span>Phí mỗi buổi / tháng / gói</span><input v-model.number="state.modal.feeAmount" type="number" min="0" step="50000" /></label>
      <label class="field"><span>Mô tả</span><textarea v-model="state.modal.description" placeholder="Ghi chú thêm về lớp"></textarea></label>
      <div class="field">
        <div class="modal-line-title"><span>Lịch học hàng tuần</span><button type="button" class="btn btn-soft btn-sm" @click="addScheduleRow"><Plus :size="15" /> Thêm buổi</button></div>
        <article v-for="(row, index) in state.modal.weeklySchedule" :key="index" class="schedule-editor">
          <select v-model="row.day"><option v-for="day in ['T2','T3','T4','T5','T6','T7','CN']" :key="day">{{ day }}</option></select>
          <input v-model="row.start" type="time" />
          <span>→</span>
          <input v-model="row.end" type="time" />
          <button type="button" class="icon-btn" @click="removeScheduleRow(index)"><Trash2 :size="16" /></button>
        </article>
      </div>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Hủy</button>
        <button type="button" class="btn btn-primary" @click="createClass">Tạo lớp</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'payment'" class="modal">
      <header class="modal-head">
        <h3>Thu học phí</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <p class="hint">Học sinh: <b>{{ studentById(state.modal.studentId).name }}</b> · Còn nợ: <b>{{ formatCurrency(debtOf(studentById(state.modal.studentId))) }}</b></p>
      <label class="field"><span>Số tiền thu</span><input v-model.number="state.modal.amount" type="number" min="0" step="50000" /></label>
      <div class="row2">
        <label class="field"><span>Hình thức</span><select v-model="state.modal.method"><option value="cash">Tiền mặt</option><option value="bank">Chuyển khoản</option><option value="other">Khác</option></select></label>
        <label class="field"><span>Ngày thu</span><input v-model="state.modal.paidAt" type="date" /></label>
      </div>
      <label class="field"><span>Ghi chú</span><input v-model="state.modal.note" placeholder="Không bắt buộc" /></label>
      <label class="check-line"><input v-model="state.modal.notifyParent" type="checkbox" /> Gửi xác nhận đã thu tiền cho phụ huynh</label>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Hủy</button>
        <button type="button" class="btn btn-primary" @click="collectPayment">Xác nhận thu tiền</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'report'" class="modal">
      <header class="modal-head">
        <h3>Tóm tắt học tập</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <template v-if="state.parentReports.find(item => item.id === state.modal.reportId)">
        <p class="hint">Link phụ huynh có hiệu lực đến {{ state.parentReports.find(item => item.id === state.modal.reportId).expiresAt }}</p>
        <div class="report-box">
          <b>{{ studentById(state.parentReports.find(item => item.id === state.modal.reportId).studentId).name }}</b>
          <span>Chuyên cần: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.attendanceRate }}%</span>
          <span>Buổi vắng: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.absentCount }}</span>
          <span>Công nợ: {{ formatCurrency(state.parentReports.find(item => item.id === state.modal.reportId).data.debt) }}</span>
          <span>Lịch tiếp theo: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.nextClass }}</span>
          <span>Điểm gần nhất: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.score || 'Chưa cập nhật' }}</span>
          <span>Thái độ: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.behavior }}</span>
          <span>Bài tập: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.homework }}</span>
          <span>Buổi gần nhất: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.lastSession }}</span>
          <span>Mục tiêu tới: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.nextGoal }}</span>
          <span>Lời nhắn: {{ state.parentReports.find(item => item.id === state.modal.reportId).data.parentMessage }}</span>
        </div>
        <footer class="modal-foot">
          <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
          <button type="button" class="btn btn-soft" @click="copyText(`https://rico.study/phu-huynh/${state.parentReports.find(item => item.id === state.modal.reportId).token}`)">Sao chép link</button>
          <button type="button" class="btn btn-primary" @click="shareArtifact(state.shareArtifacts[0])">Share thẻ</button>
        </footer>
      </template>
    </section>

    <section v-if="state.modal.type === 'ledger'" class="modal modal-wide">
      <header class="modal-head">
        <h3>Sổ liên lạc học sinh</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <template v-if="studentById(state.modal.studentId)">
        <div class="profile-head">
          <div class="avatar large">{{ initials(studentById(state.modal.studentId).name) }}</div>
          <div>
            <h3>{{ studentById(state.modal.studentId).name }}</h3>
            <p>PH: {{ studentById(state.modal.studentId).parentName }} · {{ studentById(state.modal.studentId).parentPhone }}</p>
          </div>
        </div>
        <div class="ledger-detail-grid">
          <div class="mini-stat"><span>Lớp đang học</span><b>{{ studentClasses(state.modal.studentId).map(item => item.name).join(', ') || 'Chưa xếp lớp' }}</b></div>
          <div class="mini-stat"><span>Công nợ</span><b>{{ formatCurrency(debtOf(studentById(state.modal.studentId))) }}</b></div>
          <div class="mini-stat"><span>Email phụ huynh</span><b>{{ studentById(state.modal.studentId).parentEmail }}</b></div>
          <div class="mini-stat"><span>Zalo</span><b>{{ studentById(state.modal.studentId).zaloFollowStatus === 'followed' ? 'Đã quan tâm OA' : 'Chưa đủ cấu hình' }}</b></div>
        </div>
        <div class="row2">
          <label class="field"><span>Điểm gần nhất</span><input v-model="state.modal.score" type="number" min="0" max="10" step="0.1" /></label>
          <label class="field"><span>Thái độ học tập</span><input v-model="state.modal.behavior" placeholder="VD: Tích cực, cần theo sát..." /></label>
        </div>
        <label class="field"><span>Bài tập / chuẩn bị</span><input v-model="state.modal.homework" placeholder="Tình trạng bài tập về nhà" /></label>
        <label class="field"><span>Nhật ký buổi gần nhất</span><textarea v-model="state.modal.lastSession" placeholder="Hôm nay học gì, làm được gì, còn vướng gì..."></textarea></label>
        <label class="field"><span>Mục tiêu buổi tới</span><textarea v-model="state.modal.nextGoal" placeholder="Phần cần ôn, bài cần làm, mục tiêu điểm số..."></textarea></label>
        <label class="field"><span>Ghi chú giáo viên</span><textarea v-model="state.modal.teacherNote" placeholder="Ghi chú nội bộ hoặc nhận xét tổng quan"></textarea></label>
        <label class="field"><span>Lời nhắn phụ huynh</span><textarea v-model="state.modal.parentMessage" placeholder="Nội dung ngắn gọn để phụ huynh theo dõi và hỗ trợ"></textarea></label>
        <footer class="modal-foot">
          <button type="button" class="btn btn-soft" @click="closeModal">Đóng</button>
          <button type="button" class="btn btn-soft" @click="copyText(state.modal.parentMessage)">Copy lời nhắn</button>
          <button type="button" class="btn btn-primary" @click="saveLedgerModal">Lưu sổ liên lạc</button>
        </footer>
      </template>
    </section>

    <section v-if="state.modal.type === 'expense'" class="modal">
      <header class="modal-head">
        <h3>Thêm chi phí</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <label class="field"><span>Tên khoản chi</span><input v-model="state.modal.name" placeholder="VD: Thuê phòng, trợ giảng..." /></label>
      <label class="field"><span>Số tiền</span><input v-model.number="state.modal.amount" type="number" min="0" /></label>
      <label class="field"><span>Ngày chi</span><input v-model="state.modal.date" type="date" /></label>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Hủy</button>
        <button type="button" class="btn btn-primary" @click="addExpense">Thêm chi phí</button>
      </footer>
    </section>

    <section v-if="state.modal.type === 'trial'" class="modal trial-modal">
      <header class="modal-head">
        <h3>Dùng thử miễn phí</h3>
        <button type="button" class="icon-btn" @click="closeModal"><X :size="17" /></button>
      </header>
      <div class="trial-box"><Gift :size="26" /><div><b>14 ngày gói Pro</b><span>Mở đầy đủ tính năng trả phí trong thời gian dùng thử. Hết hạn, tài khoản tự chuyển về gói Miễn phí.</span></div></div>
      <p class="trial-title">Quyền lợi khi dùng thử</p>
      <ul class="trial-list">
        <li>Quản lý đến 75 học sinh và 75 lớp.</li>
        <li>Phiếu học phí kèm link chia sẻ cho phụ huynh.</li>
        <li>Tăng sao khen thưởng và bảng xếp hạng cho học sinh.</li>
        <li>Xem lại lịch sử 3 tháng.</li>
      </ul>
      <footer class="modal-foot">
        <button type="button" class="btn btn-soft" @click="closeModal">Để sau</button>
        <button type="button" class="btn btn-primary" @click="closeModal(); toast('Đã kích hoạt dùng thử 14 ngày trong demo.')">Kích hoạt 14 ngày</button>
      </footer>
    </section>
  </div>

  <aside v-if="state.drawer?.type === 'invoice'" class="drawer-overlay" @click.self="closeDrawer">
    <section class="invoice-drawer">
      <header class="drawer-head">
        <h3>Tạo hóa đơn</h3>
        <button type="button" class="icon-btn" @click="closeDrawer"><X :size="17" /></button>
      </header>
      <div class="invoice-steps">
        <button v-for="(step, index) in invoiceSteps" :key="step.id" type="button" :class="{ active: state.drawer.step === index, done: state.drawer.step > index }" @click="state.drawer.step = index">
          <component :is="step.icon" :size="17" /><span>{{ step.label }}</span>
        </button>
      </div>
      <p class="step-count">Bước {{ state.drawer.step + 1 }}/6 · {{ invoiceSteps[state.drawer.step].label }}</p>
      <div class="wizard-tip">Muốn tạo hóa đơn nhanh cho cả lớp cùng lúc? <button type="button" @click="state.drawer.mode = 'bulk'">Chuyển sang tạo hàng loạt</button></div>
      <section class="wizard-card">
        <template v-if="state.drawer.step === 0">
          <h4>Chọn học sinh</h4>
          <div class="choice-grid">
            <button type="button" :class="{ active: state.drawer.mode === 'single' }" @click="state.drawer.mode = 'single'"><b>Một học sinh</b><span>Ra đúng một hóa đơn</span></button>
            <button type="button" :class="{ active: state.drawer.mode === 'bulk' }" @click="state.drawer.mode = 'bulk'"><b>Nhiều học sinh</b><span>Cả lớp / nhiều lớp một lượt</span></button>
          </div>
          <label class="field"><span>Học sinh</span><select v-model="state.drawer.studentId"><option v-for="student in state.students" :key="student.id" :value="student.id">{{ student.name }} · {{ student.parentPhone }}</option></select></label>
        </template>
        <template v-else-if="state.drawer.step === 1">
          <h4>Loại học phí</h4>
          <div class="segment vertical">
            <button type="button" :class="{ active: state.drawer.feeType === 'per_session' }" @click="state.drawer.feeType = 'per_session'">Theo buổi</button>
            <button type="button" :class="{ active: state.drawer.feeType === 'monthly' }" @click="state.drawer.feeType = 'monthly'">Theo tháng</button>
            <button type="button" :class="{ active: state.drawer.feeType === 'package' }" @click="state.drawer.feeType = 'package'">Theo gói</button>
          </div>
        </template>
        <template v-else-if="state.drawer.step === 2">
          <label class="field"><span>Kỳ thu phí</span><input v-model="state.drawer.period" /></label>
          <label class="field"><span>Lớp</span><select v-model="state.drawer.classId"><option v-for="classItem in state.classes" :key="classItem.id" :value="classItem.id">{{ classItem.name }}</option></select></label>
        </template>
        <template v-else-if="state.drawer.step === 3">
          <label class="field"><span>Số tiền</span><input v-model.number="state.drawer.amount" type="number" min="0" step="50000" /></label>
        </template>
        <template v-else-if="state.drawer.step === 4">
          <label class="field"><span>Giảm trừ</span><input v-model.number="state.drawer.discount" type="number" min="0" step="50000" /></label>
        </template>
        <template v-else>
          <label class="field"><span>Mẫu phiếu</span><select v-model="state.drawer.template"><option>Rico hồng</option><option>Tối giản</option><option>Phiếu có QR</option></select></label>
          <label class="check-line"><input v-model="state.drawer.sendParent" type="checkbox" /> Tạo thẻ share và gửi phụ huynh</label>
        </template>
      </section>
      <footer class="drawer-foot">
        <span>Sẽ tạo <b>{{ state.drawer.mode === 'bulk' ? classById(state.drawer.classId).studentIds.length : 1 }}</b> hóa đơn</span>
        <div>
          <button type="button" class="btn btn-soft" @click="closeDrawer">Hủy</button>
          <button type="button" class="btn btn-primary" @click="nextInvoiceStep">{{ state.drawer.step === 5 ? 'Tạo phiếu' : 'Tiếp tục' }} <ArrowRight :size="16" /></button>
        </div>
      </footer>
    </section>
  </aside>

  <div v-if="state.toast" class="toast">
    <CheckCircle2 :size="17" />
    {{ state.toast }}
  </div>
</template>
