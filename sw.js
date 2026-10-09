/* Phân Ca Sân Bay · Bản quyền © 2026 ThienNV · thiennv@vnpt-technology.vn · 0888.99.33.00
   Bộ nhớ đệm để mở nhanh và cài như app. Không đụng tới dữ liệu Firebase (luôn lấy trực tiếp). */
const CACHE = 'pcsb-v1';
const LIB_HOSTS = ['www.gstatic.com', 'cdn.sheetjs.com', 'cdnjs.cloudflare.com'];
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // trang chính: luôn lấy bản mới nhất, mất mạng mới dùng bản đã lưu
  if (req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; }).catch(() => caches.match(req).then(r => r || caches.match('./'))));
    return;
  }
  // thư viện có số phiên bản trong đường dẫn: lấy từ bộ nhớ đệm trước
  if (LIB_HOSTS.includes(url.hostname) && /\/\d+\.\d+\.\d+\//.test(url.pathname) || (url.origin === location.origin && /\/lib\/|icon-|manifest/.test(url.pathname))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === 'opaque') { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
    return;
  }
  // firebase-config.js và mọi thứ khác (Firestore, đăng nhập): đi thẳng mạng
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => { for (const c of cs) { if ('focus' in c) return c.focus(); } return self.clients.openWindow('./'); }));
});
