# Nhật ký cập nhật · Phân Ca Sân Bay

Bản quyền © 2026 ThienNV · thiennv@vnpt-technology.vn · 0888.99.33.00

Mã phiên bản hiện ở cuối trang (Cài đặt → Nhập / xuất → Nơi lưu dữ liệu) và trong `config/app` trên Firebase. Mỗi lần thay `index.html`, ghi thêm một mục ở đầu file này: ngày, ai cập nhật, thay đổi gì. Gặp lỗi sau khi cập nhật: lấy lại `index.html` bản trước trong lịch sử GitHub (bấm file → History → chọn bản cũ → … → View file → Raw → lưu lại, rồi tải lên).

## 2026-10-10 (2) · Lãnh đạo xem Năng lực, Nhật ký; ghi chú nhân viên lưu riêng

- Lãnh đạo xem được tab **Năng lực** (chỉ xem) và **Nhật ký thay đổi** (cuối tab Thống kê).
- **Ghi chú nhân viên** (Cài đặt → Nhân viên) chuyển sang `secrets/staffnotes`: chỉ người làm lịch và lãnh đạo đọc được. Ghi chú cũ tự chuyển khi người làm lịch mở trang; ghi chú trong các tuần đã chốt cũng được xoá khỏi bản chụp.
- Cần dán lại `firestore.rules`.

## 2026-10-10 · Phân quyền 3 nhóm

- Thêm nhóm **Lãnh đạo (trưởng / phó)**: xem Thống kê, Quân số, Chấm công (chỉ xem), Báo cáo tháng, cảnh báo; không sửa được.
- **Nhân viên** chỉ còn tab Lịch tuần; không thấy cảnh báo, thống kê, chấm công của người khác; Excel chỉ có sheet Lịch tuần + Lịch bay.
- OVER / BÙ (chấm công) lưu riêng ở `weeks/{tuần}/ot`, Firebase chặn hẳn với nhân viên. Tuần cũ được tự chuyển khi người làm lịch mở trang.
- Cần dán lại `firestore.rules`.

## 2026-10 · Bản vận hành lâu dài

- **Mã nhân viên** (Cài đặt → Nhân viên): báo trùng tên / trùng mã, dán mã hàng loạt từ Excel, có trong Chấm công và Báo cáo tháng; tìm nhân viên theo mã.
- **Nhật ký thay đổi**: ai sửa ô nào, lúc nào, trước / sau; xem ở Cài đặt → Nhật ký hoặc *Lịch sử ô này*. Cần dán `firestore.rules` mới.
- **Cảnh báo hai người làm lịch cùng mở một tuần.**
- **Báo cáo tháng** (Thống kê): gộp các tuần theo tháng, xuất Excel.
- **Nhắc sao lưu** mỗi 7 ngày; **tự sao lưu ra Google Drive** bằng Apps Script (`backup-drive.gs`).
- **Cài như app** trên điện thoại (`manifest.webmanifest`, `sw.js`, biểu tượng); báo trên máy khi lịch của mình đổi.
- **Nhiều đơn vị** dùng chung một dự án Firebase (`unit` trong `firebase-config.js`), luật bảo mật tách theo đơn vị.
- Thư viện Excel lên **SheetJS 0.20.3** (sửa lỗi bảo mật của 0.18.5); tự dùng bản mới từ cdn.sheetjs.com nếu thư mục `lib/` còn bản cũ.
- Đọc ô "TDS / FD1/S", "K D" (gõ thiếu dấu) đúng trạng thái + chuyến.
- Bộ kiểm thử tự động đi kèm mã nguồn (`python3 test/run_all.py`).

## 2026-10 (trước đó)

- Gợi ý tên khi gõ, ghim "lịch của tôi", link riêng cho từng người, thêm nhanh chuyến / người.
- Đọc bảng đếm cuối file Excel (định mức, CANX, ghi chú).
- Bảng năng lực nhân viên (chỉ người làm lịch).
- Gửi lịch qua Email, Telegram, Zalo, SMS; đề xuất sửa nhanh khi thiếu người; học cách chia từ các tuần trước; delay; ca làm chung G2/G3.
