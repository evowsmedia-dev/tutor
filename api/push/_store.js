const subscriptions = globalThis.__ricoPushSubscriptions || new Map();
globalThis.__ricoPushSubscriptions = subscriptions;

export function saveSubscription(userId, payload) {
  const key = userId || payload.endpoint || `anon_${Date.now()}`;
  subscriptions.set(key, {
    ...payload,
    userId,
    active: true,
    updatedAt: new Date().toISOString(),
  });
  return subscriptions.get(key);
}

export function listSubscriptions() {
  return Array.from(subscriptions.values()).filter(item => item.active);
}
