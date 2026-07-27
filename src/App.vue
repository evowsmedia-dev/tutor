<script setup>
import { computed, reactive } from 'vue';

const appScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL || '';

const navItems = [
  { id: 'dashboard', label: 'Tong quan', icon: 'Home' },
  { id: 'classes', label: 'Lop hoc', icon: 'BookOpen' },
  { id: 'attendance', label: 'Diem danh', icon: 'ClipboardCheck' },
  { id: 'students', label: 'Hoc vien', icon: 'Users' },
  { id: 'payments', label: 'Hoc phi', icon: 'WalletCards' },
  { id: 'reports', label: 'Bao cao', icon: 'CircleDollarSign' },
  { id: 'settings', label: 'Cai dat', icon: 'Settings' },
];

const attendanceStatuses = [
  { id: 'present', label: 'Co mat' },
  { id: 'absent', label: 'Vang' },
  { id: 'late', label: 'Di muon' },
  { id: 'makeup', label: 'Hoc bu' },
  { id: 'excused', label: 'Co phep' },
];

const state = reactive({
  isAuthenticated: false,
  activeView: 'dashboard',
  selectedClassId: 'cls_001',
  studentSearch: '',
  paymentStudentId: 'stu_001',
  paymentAmount: 500000,
  paymentMethod: 'cash',
  toast: '',
  user: {
    name: 'Co Mai Anh',
    role: 'admin',
    email: 'admin@tutor.local',
  },
  students: [
    {
      id: 'stu_001',
      name: 'Nguyen Minh Quan',
      phone: '0901000001',
      parentName: 'Chi Linh',
      parentPhone: '0912000001',
      email: 'linh@example.com',
      classIds: ['cls_001'],
      status: 'active',
      note: 'Can nhac nop bai tap som.',
    },
    {
      id: 'stu_002',
      name: 'Tran Bao Ngoc',
      phone: '0901000002',
      parentName: 'Anh Hai',
      parentPhone: '0912000002',
      email: 'hai@example.com',
      classIds: ['cls_001', 'cls_002'],
      status: 'active',
      note: '',
    },
    {
      id: 'stu_003',
      name: 'Le Gia Huy',
      phone: '0901000003',
      parentName: 'Chi Trang',
      parentPhone: '0912000003',
      email: 'trang@example.com',
      classIds: ['cls_002'],
      status: 'active',
      note: 'Hoc combo 12 buoi.',
    },
    {
      id: 'stu_004',
      name: 'Pham Tue Nhi',
      phone: '0901000004',
      parentName: 'Anh Son',
      parentPhone: '0912000004',
      email: 'son@example.com',
      classIds: ['cls_003'],
      status: 'active',
      note: '',
    },
  ],
  classes: [
    {
      id: 'cls_001',
      name: 'Toan 8 nang cao',
      teacherId: 'tea_001',
      teacherName: 'Co Mai Anh',
      scheduleText: 'Thu 2, Thu 5 - 18:00',
      feeType: 'monthly',
      feeAmount: 1200000,
      status: 'active',
    },
    {
      id: 'cls_002',
      name: 'Tieng Anh 7',
      teacherId: 'tea_002',
      teacherName: 'Thay Hoang',
      scheduleText: 'Thu 3, Thu 6 - 19:30',
      feeType: 'combo',
      feeAmount: 1800000,
      status: 'active',
    },
    {
      id: 'cls_003',
      name: 'Ly 9 on thi',
      teacherId: 'tea_001',
      teacherName: 'Co Mai Anh',
      scheduleText: 'Chu nhat - 08:00',
      feeType: 'per_session',
      feeAmount: 180000,
      status: 'active',
    },
  ],
  schedules: [
    { id: 'ses_001', classId: 'cls_001', date: '2026-07-27', startTime: '18:00', endTime: '19:30', status: 'scheduled' },
    { id: 'ses_002', classId: 'cls_002', date: '2026-07-28', startTime: '19:30', endTime: '21:00', status: 'scheduled' },
    { id: 'ses_003', classId: 'cls_003', date: '2026-08-02', startTime: '08:00', endTime: '10:00', status: 'scheduled' },
  ],
  attendance: [
    { id: 'att_001', sessionId: 'ses_001', classId: 'cls_001', studentId: 'stu_001', status: 'present', checkedAt: '2026-07-27T11:00:00' },
    { id: 'att_002', sessionId: 'ses_001', classId: 'cls_001', studentId: 'stu_002', status: 'late', checkedAt: '2026-07-27T11:00:00' },
  ],
  payments: [
    { id: 'pay_001', studentId: 'stu_001', classId: 'cls_001', amount: 700000, method: 'bank', paidAt: '2026-07-12' },
    { id: 'pay_002', studentId: 'stu_003', classId: 'cls_002', amount: 1800000, method: 'cash', paidAt: '2026-07-15' },
  ],
  debts: [
    { id: 'debt_001', studentId: 'stu_001', classId: 'cls_001', expectedAmount: 1200000, paidAmount: 700000, remainingAmount: 500000, dueDate: '2026-07-31', status: 'partial' },
    { id: 'debt_002', studentId: 'stu_002', classId: 'cls_001', expectedAmount: 1200000, paidAmount: 0, remainingAmount: 1200000, dueDate: '2026-07-31', status: 'open' },
    { id: 'debt_003', studentId: 'stu_003', classId: 'cls_002', expectedAmount: 1800000, paidAmount: 1800000, remainingAmount: 0, dueDate: '2026-07-20', status: 'paid' },
  ],
});

const newStudent = reactive({
  name: '',
  parentName: '',
  parentPhone: '',
  classId: 'cls_001',
});

const loginForm = reactive({
  email: 'admin@tutor.local',
  password: '123456',
});

const activeClass = computed(() => state.classes.find(item => item.id === state.selectedClassId) || state.classes[0]);
const activeSession = computed(() => state.schedules.find(item => item.classId === activeClass.value.id) || state.schedules[0]);
const classStudents = computed(() => state.students.filter(student => student.classIds.includes(activeClass.value.id)));
const activeStudent = computed(() => state.students.find(student => student.id === state.paymentStudentId) || state.students[0]);
const filteredStudents = computed(() => {
  const query = state.studentSearch.trim().toLowerCase();
  if (!query) return state.students;
  return state.students.filter(student => {
    const haystack = `${student.name} ${student.parentName} ${student.parentPhone}`.toLowerCase();
    return haystack.includes(query);
  });
});

const dashboard = computed(() => {
  const revenue = state.payments.reduce((sum, item) => sum + item.amount, 0);
  const debt = state.debts.reduce((sum, item) => sum + item.remainingAmount, 0);
  const absentToday = state.attendance.filter(item => ['absent', 'excused'].includes(item.status)).length;
  return {
    classesToday: state.schedules.filter(item => item.date === '2026-07-27').length,
    revenue,
    debt,
    absentToday,
    nextSession: state.schedules[0],
  };
});

const attendanceSummary = computed(() => {
  const total = state.attendance.length || 1;
  const present = state.attendance.filter(item => item.status === 'present' || item.status === 'late').length;
  return Math.round((present / total) * 100);
});

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);
}

function className(classId) {
  return state.classes.find(item => item.id === classId)?.name || 'Chua gan lop';
}

function studentName(studentId) {
  return state.students.find(item => item.id === studentId)?.name || 'Hoc vien';
}

function attendanceFor(studentId) {
  return state.attendance.find(item => item.sessionId === activeSession.value.id && item.studentId === studentId)?.status || '';
}

function setAttendance(studentId, status) {
  const existing = state.attendance.find(item => item.sessionId === activeSession.value.id && item.studentId === studentId);
  if (existing) {
    existing.status = status;
    existing.checkedAt = new Date().toISOString();
  } else {
    state.attendance.push({
      id: `att_${Date.now()}_${studentId}`,
      sessionId: activeSession.value.id,
      classId: activeClass.value.id,
      studentId,
      status,
      checkedAt: new Date().toISOString(),
    });
  }
  notify('Da cap nhat diem danh.');
}

function addStudent() {
  if (!newStudent.name.trim()) {
    notify('Vui long nhap ten hoc vien.');
    return;
  }
  state.students.unshift({
    id: `stu_${Date.now()}`,
    name: newStudent.name.trim(),
    phone: '',
    parentName: newStudent.parentName.trim(),
    parentPhone: newStudent.parentPhone.trim(),
    email: '',
    classIds: [newStudent.classId],
    status: 'active',
    note: '',
  });
  newStudent.name = '';
  newStudent.parentName = '';
  newStudent.parentPhone = '';
  notify('Da them hoc vien moi.');
}

function collectPayment() {
  const amount = Number(state.paymentAmount || 0);
  if (!activeStudent.value || amount <= 0) {
    notify('So tien thu chua hop le.');
    return;
  }

  const classId = activeStudent.value.classIds[0];
  state.payments.unshift({
    id: `pay_${Date.now()}`,
    studentId: activeStudent.value.id,
    classId,
    amount,
    method: state.paymentMethod,
    paidAt: new Date().toISOString().slice(0, 10),
  });

  const debt = state.debts.find(item => item.studentId === activeStudent.value.id && item.classId === classId);
  if (debt) {
    debt.paidAmount += amount;
    debt.remainingAmount = Math.max(0, debt.expectedAmount - debt.paidAmount);
    debt.status = debt.remainingAmount === 0 ? 'paid' : 'partial';
  }

  notify('Da ghi nhan thanh toan.');
}

function notify(message) {
  state.toast = message;
  window.setTimeout(() => {
    state.toast = '';
  }, 2200);
}

function login() {
  if (!loginForm.email.trim() || !loginForm.password.trim()) {
    notify('Vui long nhap email va mat khau.');
    return;
  }
  state.isAuthenticated = true;
  notify('Dang nhap thanh cong.');
}

function logout() {
  state.isAuthenticated = false;
  state.activeView = 'dashboard';
}

const apiHint = computed(() => appScriptUrl ? 'Dang cau hinh Apps Script API' : 'Dang chay che do demo local');
</script>

<template>
  <section v-if="!state.isAuthenticated" class="login-screen">
    <div class="login-panel">
      <div class="brand login-brand">
        <span class="brand-mark">T</span>
        <div>
          <strong>Tutor</strong>
          <small>{{ apiHint }}</small>
        </div>
      </div>
      <div>
        <p class="eyebrow">WebApp quan ly lop hoc</p>
        <h1>Dang nhap</h1>
      </div>
      <label>
        Email
        <input v-model="loginForm.email" type="email" autocomplete="email" />
      </label>
      <label>
        Mat khau
        <input v-model="loginForm.password" type="password" autocomplete="current-password" @keydown.enter="login" />
      </label>
      <button type="button" class="primary-button full-button" @click="login">
        <Check :size="16" />
        Vao he thong
      </button>
      <small class="login-hint">Demo: admin@tutor.local / 123456</small>
    </div>
    <div v-if="state.toast" class="toast">{{ state.toast }}</div>
  </section>

  <div v-else class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">T</span>
        <div>
          <strong>Tutor</strong>
          <small>{{ apiHint }}</small>
        </div>
      </div>

      <nav class="nav-list" aria-label="Dieu huong chinh">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: state.activeView === item.id }"
          type="button"
          @click="state.activeView = item.id"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </button>
      </nav>
    </aside>

    <main class="main-panel">
      <header class="topbar">
        <div>
          <p class="eyebrow">Quan ly lop hoc</p>
          <h1>{{ navItems.find(item => item.id === state.activeView)?.label }}</h1>
        </div>
        <div class="user-card">
          <span>{{ state.user.name }}</span>
          <small>{{ state.user.role }}</small>
          <button type="button" @click="logout">Thoat</button>
        </div>
      </header>

      <section v-if="state.activeView === 'dashboard'" class="view-stack">
        <div class="metric-grid">
          <article class="metric">
            <span>Lop hom nay</span>
            <strong>{{ dashboard.classesToday }}</strong>
            <small>{{ dashboard.nextSession.startTime }} - {{ className(dashboard.nextSession.classId) }}</small>
          </article>
          <article class="metric">
            <span>Doanh thu</span>
            <strong>{{ formatCurrency(dashboard.revenue) }}</strong>
            <small>Da ghi nhan trong ky demo</small>
          </article>
          <article class="metric danger">
            <span>Cong no</span>
            <strong>{{ formatCurrency(dashboard.debt) }}</strong>
            <small>{{ state.debts.filter(item => item.remainingAmount > 0).length }} hoc vien can nhac</small>
          </article>
          <article class="metric">
            <span>Ty le di hoc</span>
            <strong>{{ attendanceSummary }}%</strong>
            <small>Dua tren lich su diem danh</small>
          </article>
        </div>

        <div class="two-column">
          <section class="panel">
            <div class="panel-title">
              <h2>Lich day sap toi</h2>
              <CalendarDays :size="18" />
            </div>
            <div class="timeline">
              <article v-for="session in state.schedules" :key="session.id" class="timeline-row">
                <div>
                  <strong>{{ className(session.classId) }}</strong>
                  <span>{{ session.date }} - {{ session.startTime }} den {{ session.endTime }}</span>
                </div>
                <small>{{ session.status }}</small>
              </article>
            </div>
          </section>

          <section class="panel">
            <div class="panel-title">
              <h2>Cong no can xu ly</h2>
              <WalletCards :size="18" />
            </div>
            <div class="debt-list">
              <article v-for="debt in state.debts.filter(item => item.remainingAmount > 0)" :key="debt.id" class="debt-row">
                <div>
                  <strong>{{ studentName(debt.studentId) }}</strong>
                  <span>{{ className(debt.classId) }}</span>
                </div>
                <b>{{ formatCurrency(debt.remainingAmount) }}</b>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'classes'" class="view-stack">
        <div class="class-grid">
          <article
            v-for="item in state.classes"
            :key="item.id"
            class="class-card"
            :class="{ selected: item.id === state.selectedClassId }"
            @click="state.selectedClassId = item.id"
          >
            <div>
              <h2>{{ item.name }}</h2>
              <p>{{ item.scheduleText }}</p>
            </div>
            <span>{{ formatCurrency(item.feeAmount) }}</span>
            <small>{{ item.teacherName }} - {{ state.students.filter(student => student.classIds.includes(item.id)).length }} hoc vien</small>
          </article>
        </div>

        <section class="panel">
          <div class="panel-title">
            <h2>{{ activeClass.name }}</h2>
            <BookOpen :size="18" />
          </div>
          <div class="student-table">
            <div v-for="student in classStudents" :key="student.id" class="student-row">
              <div>
                <strong>{{ student.name }}</strong>
                <span>Phu huynh: {{ student.parentName }} - {{ student.parentPhone }}</span>
              </div>
              <small>{{ student.status }}</small>
            </div>
          </div>
        </section>
      </section>

      <section v-if="state.activeView === 'attendance'" class="view-stack">
        <div class="toolbar">
          <label>
            Lop diem danh
            <select v-model="state.selectedClassId">
              <option v-for="item in state.classes" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </label>
          <div class="toolbar-note">
            <strong>{{ activeSession.date }}</strong>
            <span>{{ activeSession.startTime }} - {{ activeSession.endTime }}</span>
          </div>
        </div>

        <section class="attendance-list">
          <article v-for="student in classStudents" :key="student.id" class="attendance-card">
            <div class="attendance-person">
              <strong>{{ student.name }}</strong>
              <span>{{ student.parentName }} - {{ student.parentPhone }}</span>
            </div>
            <div class="status-buttons">
              <button
                v-for="status in attendanceStatuses"
                :key="status.id"
                type="button"
                :class="{ active: attendanceFor(student.id) === status.id }"
                @click="setAttendance(student.id, status.id)"
              >
                {{ status.label }}
              </button>
            </div>
          </article>
        </section>
      </section>

      <section v-if="state.activeView === 'students'" class="view-stack">
        <div class="toolbar">
          <label class="search-field">
            <Search :size="16" />
            <input v-model="state.studentSearch" type="search" placeholder="Tim hoc vien, phu huynh, so dien thoai" />
          </label>
        </div>

        <section class="panel form-panel">
          <div class="panel-title">
            <h2>Them hoc vien nhanh</h2>
            <Plus :size="18" />
          </div>
          <div class="inline-form">
            <input v-model="newStudent.name" placeholder="Ten hoc vien" />
            <input v-model="newStudent.parentName" placeholder="Ten phu huynh" />
            <input v-model="newStudent.parentPhone" placeholder="So dien thoai phu huynh" />
            <select v-model="newStudent.classId">
              <option v-for="item in state.classes" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
            <button type="button" class="primary-button" @click="addStudent">
              <Plus :size="16" />
              Them
            </button>
          </div>
        </section>

        <section class="student-table">
          <article v-for="student in filteredStudents" :key="student.id" class="student-card">
            <div>
              <h2>{{ student.name }}</h2>
              <p>{{ student.parentName }} - {{ student.parentPhone }}</p>
              <span>{{ student.classIds.map(className).join(', ') }}</span>
            </div>
            <small>{{ student.status }}</small>
          </article>
        </section>
      </section>

      <section v-if="state.activeView === 'payments'" class="view-stack">
        <section class="panel form-panel">
          <div class="panel-title">
            <h2>Ghi nhan thu hoc phi</h2>
            <Check :size="18" />
          </div>
          <div class="inline-form">
            <select v-model="state.paymentStudentId">
              <option v-for="student in state.students" :key="student.id" :value="student.id">{{ student.name }}</option>
            </select>
            <input v-model.number="state.paymentAmount" type="number" min="0" step="50000" />
            <select v-model="state.paymentMethod">
              <option value="cash">Tien mat</option>
              <option value="bank">Chuyen khoan</option>
              <option value="other">Khac</option>
            </select>
            <button type="button" class="primary-button" @click="collectPayment">
              <WalletCards :size="16" />
              Thu tien
            </button>
          </div>
        </section>

        <div class="two-column">
          <section class="panel">
            <div class="panel-title">
              <h2>Cong no</h2>
              <CircleDollarSign :size="18" />
            </div>
            <div class="debt-list">
              <article v-for="debt in state.debts" :key="debt.id" class="debt-row">
                <div>
                  <strong>{{ studentName(debt.studentId) }}</strong>
                  <span>{{ className(debt.classId) }} - han {{ debt.dueDate }}</span>
                </div>
                <b>{{ formatCurrency(debt.remainingAmount) }}</b>
              </article>
            </div>
          </section>

          <section class="panel">
            <div class="panel-title">
              <h2>Lich su thu</h2>
              <WalletCards :size="18" />
            </div>
            <div class="debt-list">
              <article v-for="payment in state.payments" :key="payment.id" class="debt-row">
                <div>
                  <strong>{{ studentName(payment.studentId) }}</strong>
                  <span>{{ payment.paidAt }} - {{ payment.method }}</span>
                </div>
                <b>{{ formatCurrency(payment.amount) }}</b>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section v-if="state.activeView === 'reports'" class="view-stack">
        <div class="metric-grid compact">
          <article class="metric">
            <span>Tong doanh thu</span>
            <strong>{{ formatCurrency(dashboard.revenue) }}</strong>
          </article>
          <article class="metric danger">
            <span>Con phai thu</span>
            <strong>{{ formatCurrency(dashboard.debt) }}</strong>
          </article>
          <article class="metric">
            <span>Hoc vien dang hoc</span>
            <strong>{{ state.students.filter(item => item.status === 'active').length }}</strong>
          </article>
          <article class="metric">
            <span>Ty le di hoc</span>
            <strong>{{ attendanceSummary }}%</strong>
          </article>
        </div>

        <section class="panel">
          <div class="panel-title">
            <h2>Doanh thu theo lop</h2>
            <CircleDollarSign :size="18" />
          </div>
          <div class="report-bars">
            <article v-for="item in state.classes" :key="item.id">
              <div>
                <strong>{{ item.name }}</strong>
                <span>{{ formatCurrency(state.payments.filter(payment => payment.classId === item.id).reduce((sum, payment) => sum + payment.amount, 0)) }}</span>
              </div>
              <progress :value="state.payments.filter(payment => payment.classId === item.id).reduce((sum, payment) => sum + payment.amount, 0)" max="2500000" />
            </article>
          </div>
        </section>
      </section>

      <section v-if="state.activeView === 'settings'" class="view-stack">
        <section class="panel">
          <div class="panel-title">
            <h2>Ket noi Google Apps Script</h2>
            <Settings :size="18" />
          </div>
          <div class="settings-grid">
            <label>
              Apps Script URL
              <input :value="appScriptUrl || 'Chua cau hinh VITE_APPS_SCRIPT_URL'" readonly />
            </label>
            <label>
              Sheet template
              <input value="HocVien, LopHoc, LichHoc, DiemDanh, ThuHocPhi, CongNo..." readonly />
            </label>
            <label>
              Kenh email
              <input value="Google Apps Script MailApp" readonly />
            </label>
            <label>
              Zalo OA
              <input value="Sau MVP" readonly />
            </label>
          </div>
        </section>

        <section class="panel">
          <div class="panel-title">
            <h2>Mau thong bao</h2>
            <Mail :size="18" />
          </div>
          <textarea readonly>Phu huynh than men, hoc phi thang nay cua {student_name} con {remaining_amount}. Han thanh toan: {due_date}.</textarea>
        </section>
      </section>
    </main>

    <div v-if="state.toast" class="toast">{{ state.toast }}</div>
  </div>
</template>
