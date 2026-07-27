import { saveSubscription } from './_store.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = request.body || {};
  const subscription = saveSubscription(body.userId, {
    endpoint: body.endpoint || '',
    keys: body.keys || {},
    preferences: body.preferences || {},
    userAgent: body.userAgent || request.headers['user-agent'] || '',
  });

  response.status(200).json({
    success: true,
    data: {
      subscription,
      configured: Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
      message: process.env.VAPID_PUBLIC_KEY ? 'Đã nhận đăng ký push.' : 'Đã lưu cấu hình demo, thiếu VAPID keys để gửi Web Push thật.',
    },
  });
}
