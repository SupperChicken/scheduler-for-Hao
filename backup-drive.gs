/**
 * Phân Ca Sân Bay · Sao lưu tự động ra Google Drive
 * Bản quyền © 2026 ThienNV · thiennv@vnpt-technology.vn · 0888.99.33.00
 *
 * Cách cài (làm 1 lần, bằng chính tài khoản Google là chủ dự án Firebase):
 *  1. Mở https://script.google.com → Dự án mới → xoá hết chữ có sẵn → dán toàn bộ mã này.
 *  2. Bánh răng "Cài đặt dự án" → tick "Hiển thị tệp kê khai appsscript.json". Quay lại Trình chỉnh sửa,
 *     mở appsscript.json, thay bằng nội dung tệp appsscript.json đi kèm.
 *  3. Sửa PROJECT_ID bên dưới (Firebase → Project settings → Project ID). Có nhiều đơn vị thì điền UNIT.
 *  4. Chọn hàm saoLuuNgay → Chạy → cấp quyền. Mở Google Drive, thấy thư mục "Phan Ca San Bay - Sao luu" là được.
 *  5. Chọn hàm datLich → Chạy: từ nay tự sao lưu lúc 22 giờ mỗi tối Chủ nhật (và giữ 60 bản gần nhất).
 * Khôi phục: tải file .json trong thư mục về máy → trang Phân Ca → Cài đặt → Nhập / xuất → Khôi phục từ file JSON.
 */
const PROJECT_ID = 'ten-du-an';   // ← sửa
const UNIT = '';                   // để trống nếu chỉ có 1 đơn vị; ví dụ 'tram2'
const FOLDER = 'Phan Ca San Bay - Sao luu';
const KEEP = 60;

function base_() { return 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID + '/databases/(default)/documents/' + (UNIT ? 'units/' + UNIT + '/' : ''); }
function get_(path) {
  const r = UrlFetchApp.fetch(base_() + path, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Goog-User-Project': PROJECT_ID }, muteHttpExceptions: true });
  if (r.getResponseCode() === 404) return null;
  if (r.getResponseCode() !== 200) throw new Error('Đọc ' + path + ' lỗi ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText());
}
function list_(path) {
  let out = [], tok = '';
  do { const j = get_(path + '?pageSize=300' + (tok ? '&pageToken=' + encodeURIComponent(tok) : '')); if (!j) break; out = out.concat(j.documents || []); tok = j.nextPageToken || ''; } while (tok);
  return out;
}
function val_(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return obj_(v.mapValue.fields || {});
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(val_);
  return null;
}
function obj_(f) { const o = {}; for (const k in f) o[k] = val_(f[k]); return o; }
function expandCell_(c) {
  const o = { status: c.status || '', note: c.note || '', items: (c.items || []).map(function (i) { return Object.assign({ role: '' }, i); }) };
  if (c.autoOff) o.autoOff = true; return o;
}
function docId_(d) { return d.name.split('/').pop(); }
// đọc toàn bộ dữ liệu, trả về đúng định dạng file "Tải bản sao lưu" của trang
function docBanSaoLuu_() {
  const main = get_('config/main'); if (!main) throw new Error('Không thấy config/main. Kiểm tra PROJECT_ID / UNIT.');
  const cfg = obj_(main.fields || {}).cfg;
  const weeks = {};
  list_('weeks').forEach(function (d) {
    const id = docId_(d), x = obj_(d.fields || {});
    if (x.week) { weeks[id] = x.week; return; }
    const w = JSON.parse(JSON.stringify(x.meta || {})); w.cells = {}; w.over = {};
    list_('weeks/' + id + '/days').forEach(function (dd) {
      const day = Number(docId_(dd)), y = obj_(dd.fields || {});
      for (const sid in (y.cells || {})) (w.cells[sid] = w.cells[sid] || {})[day] = expandCell_(y.cells[sid]);
      for (const sid in (y.over || {})) (w.over[sid] = w.over[sid] || {})[day] = y.over[sid];
    });
    // OVER / BÙ (chấm công) lưu riêng từ 10/2026
    list_('weeks/' + id + '/ot').forEach(function (dd) {
      const day = Number(docId_(dd)), y = obj_(dd.fields || {});
      for (const sid in (y.over || {})) (w.over[sid] = w.over[sid] || {})[day] = y.over[sid];
    });
    weeks[id] = w;
  });
  // ghi chú nhân viên lưu riêng từ 10/2026
  const sn = get_('secrets/staffnotes'); const nm = sn ? (obj_(sn.fields || {}).map || {}) : {};
  (cfg.staff || []).forEach(function (sf) { if (nm[sf.id]) sf.note = nm[sf.id]; });
  return { app: 'phan-ca-san-bay', version: 1, source: 'google-drive', unit: UNIT, publishedAt: new Date().toISOString(), cfg: cfg, weeks: weeks };
}
function saoLuuNgay() {
  const data = docBanSaoLuu_();
  const it = DriveApp.getFoldersByName(FOLDER); const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER);
  const name = 'phan-ca-sao-luu-' + (UNIT ? UNIT + '-' : '') + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd-HHmm') + '.json';
  folder.createFile(name, JSON.stringify(data), 'application/json');
  // giữ KEEP bản mới nhất
  const files = []; const fi = folder.getFiles(); while (fi.hasNext()) { const f = fi.next(); if (/^phan-ca-sao-luu-/.test(f.getName())) files.push(f); }
  files.sort(function (a, b) { return b.getDateCreated() - a.getDateCreated(); });
  files.slice(KEEP).forEach(function (f) { f.setTrashed(true); });
  Logger.log('Đã lưu ' + name + ' (' + Object.keys(data.weeks).length + ' tuần)');
}
function datLich() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'saoLuuNgay') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('saoLuuNgay').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(22).create();
  Logger.log('Đã đặt lịch: 22 giờ mỗi tối Chủ nhật');
}
