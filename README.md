# Phân Ca Sân Bay

Công cụ chia lịch và chấm công cho nhân viên phục vụ chuyến bay.

- **Giao diện:** đăng trên GitHub Pages (miễn phí).
- **Dữ liệu và đăng nhập:** dùng Firebase (gói Spark miễn phí, không cần thẻ thanh toán).

## Bộ này giải quyết 3 vấn đề như sau

1. **Chỉ người được cấp quyền mới xem được.**
   - Trang web không chứa dữ liệu nào. Mở link chỉ thấy màn hình đăng nhập.
   - Dữ liệu nằm trên Firebase. Firebase chỉ trả dữ liệu cho email có trong danh sách quyền truy cập, và bạn quản lý danh sách này ngay trong ứng dụng.
2. **Nhiều người cùng sửa không bị mất dữ liệu.**
   - Mỗi thay đổi chỉ ghi đúng ô vừa sửa. Hai người sửa hai ô khác nhau cùng lúc thì cả hai đều được lưu.
   - Thay đổi hiện ngay trên máy người khác. Góc trên còn báo đang có bao nhiêu người cùng sửa.
3. **Chỉ còn một nơi lưu dữ liệu.** Firebase là bản chính duy nhất. Bản trên Claude chỉ để thử, không cần dùng nữa.

## Các file

| File | Vai trò | Đưa lên GitHub? |
|---|---|---|
| `index.html` | Toàn bộ ứng dụng | Có |
| `firebase-config.js` | Cấu hình kết nối Firebase (bạn sửa ở bước 3) | Có |
| `.nojekyll` | Để GitHub Pages phục vụ file nguyên trạng | Có |
| `firestore.rules` | Luật bảo mật, dán vào Firebase ở bước 4 | Không bắt buộc |
| `README.md` | Hướng dẫn này | Không bắt buộc |

File dữ liệu ban đầu (`du-lieu-ban-dau-KHONG-dua-len-github.json`) được gửi riêng. **Không đưa file này lên GitHub**, vì nó chứa tên nhân viên.

---

## Cài đặt lần đầu (khoảng 20 phút, làm một lần)

### Bước 1. Tạo dự án Firebase

1. Vào https://console.firebase.google.com và đăng nhập bằng tài khoản Google của bạn.
2. Bấm **Create a project** (hoặc **Add project**), đặt tên, ví dụ `phan-ca-san-bay`.
3. Tắt Google Analytics (không cần), rồi bấm **Create project**.

Gói mặc định là **Spark (miễn phí)**. Đừng nâng cấp lên Blaze.

### Bước 2. Bật đăng nhập

1. Ở menu trái, chọn **Build → Authentication**, bấm **Get started**.
2. Mở thẻ **Sign-in method** và bật hai cách đăng nhập:
   - **Google**: bấm Enable, chọn email hỗ trợ là email của bạn, rồi Save.
   - **Email/Password**: bật dòng đầu tiên (Email/Password), rồi Save. Cách này dành cho người không có tài khoản Google.

### Bước 3. Tạo cơ sở dữ liệu và lấy cấu hình

1. Chọn **Build → Firestore Database**, bấm **Create database**.
2. Chọn vị trí `asia-southeast1 (Singapore)`, gần Việt Nam nhất. Chọn **Start in production mode**, rồi bấm **Create**.
3. Bấm bánh răng ⚙ cạnh *Project Overview*, chọn **Project settings**.
4. Kéo xuống mục *Your apps*, bấm biểu tượng **</>** (Web). Đặt tên app tuỳ ý, **không** chọn Firebase Hosting, rồi bấm **Register app**.
5. Firebase hiện một đoạn `const firebaseConfig = { apiKey: "...", ... }`. Mở file `firebase-config.js` và thay các giá trị mẫu bằng giá trị của bạn: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.

Các giá trị cấu hình này **không phải mật khẩu**, đưa lên GitHub công khai vẫn an toàn. Dữ liệu được bảo vệ bằng đăng nhập và luật ở bước 4.

### Bước 4. Dán luật bảo mật (quan trọng nhất)

1. Mở file `firestore.rules`. Ở dòng `OWNERS`, sửa email thành **email Google bạn sẽ dùng để đăng nhập**. Đây là chủ dự án, luôn có toàn quyền.
2. Trong Firebase, vào **Firestore Database → Rules**. Xoá hết nội dung có sẵn, dán toàn bộ file `firestore.rules`, rồi bấm **Publish**.

### Bước 5. Đưa giao diện lên GitHub Pages

1. Trên https://github.com, bấm **New repository**, đặt tên (vd. `phan-ca`) và để **Public**, vì GitHub Pages miễn phí chỉ chạy với kho công khai. Bấm **Create repository**.
2. Bấm **uploading an existing file**. Kéo thả `index.html`, `firebase-config.js` (đã sửa ở bước 3) và `README.md`, rồi bấm **Commit changes**.
3. Tạo file `.nojekyll`: bấm **Add file → Create new file**, đặt tên `.nojekyll`, để trống nội dung, rồi bấm **Commit changes**.
4. Vào **Settings → Pages**. Ở mục *Source* chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi bấm **Save**.
5. Đợi 1–2 phút. Địa chỉ trang có dạng `https://<tên-tài-khoản>.github.io/phan-ca/`.

### Bước 6. Cho phép tên miền GitHub đăng nhập

Trong Firebase, vào **Authentication → Settings → Authorized domains**, bấm **Add domain**, nhập `<tên-tài-khoản>.github.io` (không có `https://`, không có đường dẫn), rồi bấm **Add**.

### Bước 7. Đăng nhập lần đầu và nạp dữ liệu

1. Mở trang GitHub và **Đăng nhập bằng Google** bằng đúng email đã ghi ở `OWNERS`. Bạn sẽ thành *Người làm lịch*.
2. Vào **Cài đặt & dữ liệu → Nhập / xuất dữ liệu → Khôi phục từ bản sao lưu**, chọn file `du-lieu-ban-dau-KHONG-dua-len-github.json`. Lịch tuần 5–11/10 cùng 78 nhân viên sẽ được nạp lên Firebase. (Hoặc dùng **Nhập file Excel** với file lịch .xlsx.)
3. Vào **Cài đặt & dữ liệu → Quyền truy cập**:
   - **Người làm lịch**: những ai được chia và sửa lịch.
   - **Người xem**: email của nhân viên, mỗi dòng một email.

   Bấm **Lưu danh sách**, rồi bấm **Chép link trang** để gửi cho mọi người.

---

## Quy trình mỗi tuần (người làm lịch)

1. **+ Tuần mới**: chép lịch bay từ tuần trước làm khung.
2. **Lịch bay**: sửa chuyến đổi giờ, bấm BAY/CANX cho chuyến huỷ, đặt định mức riêng nếu cần. Hoặc **Nhập file Excel → Chỉ lịch bay**.
3. **Order nghỉ**: chọn OFF, NP, ốm… cho từng người từng ngày. Hoặc **Nhập file Excel → Chỉ OFF / NP**.
4. **Tự động chia**. Nếu sửa OFF/NP sau khi đã chia, bấm lại **Tự động chia → Chỉ lấp chỗ trống**: người mới nghỉ sẽ được gỡ khỏi chuyến (trừ ô đã khoá) và xếp người thay.
5. Kiểm tra **bảng đếm quân số cuối tab Lịch tuần** (giống hàm COUNT cuối bảng Excel) hoặc tab **Quân số**: ô đỏ là chuyến còn thiếu người.

## Dùng hằng ngày

- **Nhân viên:** mở link, đăng nhập bằng Google, hoặc bấm *Tạo tài khoản* bằng email rồi xác minh qua thư. Họ chỉ xem được Lịch tuần, Quân số, Thống kê. Gõ tên vào ô tìm kiếm để xem lịch của mình. Lịch tự cập nhật khi người làm lịch sửa.
- **Người làm lịch:** chia lịch, sửa và tạo tuần mới ngay trên trang. Mọi thứ tự lưu lên Firebase, không cần tải file hay đăng lại.
- **Thêm hoặc bớt người:** sửa danh sách ở *Quyền truy cập*. Người bị xoá mất quyền ngay lập tức.
- **Sao lưu:** thỉnh thoảng bấm *Tải bản sao lưu* để giữ một bản trên máy, phòng khi xoá nhầm.

## Hạn mức miễn phí

Gói Spark của Firestore cho khoảng 50.000 lượt đọc, 20.000 lượt ghi mỗi ngày và 1 GB lưu trữ. Với khoảng 80 người xem vài lần mỗi ngày, mức dùng chỉ khoảng vài nghìn lượt, còn rất xa giới hạn. Nếu một ngày bị vượt, trang chỉ tạm không lưu được đến hôm sau và không mất tiền, vì gói Spark không có thẻ thanh toán.

Mỗi tuần lịch chiếm khoảng 150 KB, nên 1 GB đủ cho hàng nghìn tuần.

## Gặp lỗi?

| Thông báo | Cách xử lý |
|---|---|
| "Chưa kết nối Firebase" | `firebase-config.js` chưa được sửa, hoặc chưa tải lên GitHub |
| "Tên miền … chưa được phép" | Làm lại bước 6 |
| "Cách đăng nhập này chưa được bật" | Làm lại bước 2 |
| "Chưa được cấp quyền" | Email chưa có trong *Quyền truy cập*. Với chủ dự án: kiểm tra email ở dòng `OWNERS` và đã bấm *Publish* luật chưa |
| "Bạn không có quyền sửa" | Tài khoản này là *Người xem* |
| Sửa xong GitHub mà trang chưa đổi | Đợi 1–2 phút rồi tải lại trang (Ctrl+F5) |
