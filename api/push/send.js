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
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  if (!configureWebPush()) {
    response.status(200).json({
      success: false,
      error: 'Thiếu VAPID_PUBLIC_KEY hoặc VAPID_PRIVATE_KEY. Endpoint đã sẵn sàng nhưng chưa thể gửi Web Push thật.',
    });
    return;
  }

  const payload = JSON.stringify({
    title: request.body?.title || 'Rico Study',
    body: request.body?.body || 'Bạn có một thông báo mới.',
    url: request.body?.url || '/',
  });

  const results = await Promise.allSettled(
    listSubscriptions()
      .filter(item => item.endpoint)
      .map(item => webpush.sendNotification({ endpoint: item.endpoint, keys: item.keys }, payload)),
  );

  response.status(200).json({
    success: true,
    data: {
      sent: results.filter(item => item.status === 'fulfilled').length,
      failed: results.filter(item => item.status === 'rejected').length,
    },
  });
}
