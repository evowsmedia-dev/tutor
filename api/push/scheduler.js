import webpush from 'web-push';
import { listSubscriptions } from './_store.js';

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@ricostudy.vn';
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export default async function handler(request, response) {
  const now = new Date();
  const day = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][now.getDay()];
  const isFirstWeek = now.getDate() <= 7;

  const jobs = [
    {
      key: 'classReminder',
      title: 'Sắp đến giờ dạy',
      body: `Rico Study nhắc lịch dạy hôm nay (${day}). Mở app để điểm danh nhanh.`,
      url: '/?view=schedule',
    },
    {
      key: 'monthlyDebt',
      title: 'Tổng hợp học phí đầu tháng',
      body: 'Mở Rico Study để xem học sinh chưa đóng học phí và tạo phiếu gửi phụ huynh.',
      url: '/?view=invoices',
      enabled: isFirstWeek,
    },
    {
      key: 'absenceRisk',
      title: 'Cảnh báo nguy cơ nghỉ học',
      body: 'Có học sinh cần theo sát chuyên cần. Mở thống kê để xem danh sách.',
      url: '/?view=stats',
    },
  ].filter(job => job.enabled !== false);

  if (!configureWebPush()) {
    response.status(200).json({
      success: false,
      data: { jobs },
      error: 'Thiếu VAPID keys. Scheduler đã trả danh sách job demo nhưng chưa gửi Web Push thật.',
    });
    return;
  }

  const subscriptions = listSubscriptions();
  const sends = jobs.flatMap(job => {
    return subscriptions
      .filter(subscription => subscription.preferences?.[job.key] !== false)
      .filter(subscription => subscription.endpoint)
      .map(subscription => webpush.sendNotification({ endpoint: subscription.endpoint, keys: subscription.keys }, JSON.stringify(job)));
  });
  const results = await Promise.allSettled(sends);

  response.status(200).json({
    success: true,
    data: {
      jobs: jobs.map(item => item.key),
      sent: results.filter(item => item.status === 'fulfilled').length,
      failed: results.filter(item => item.status === 'rejected').length,
    },
  });
}
