# Phân Ca Sân Bay

**Tác giả và bản quyền:** © 2026 ThienNV · thiennv@vnpt-technology.vn · 0888.99.33.00

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
| `lib/` (thư mục) | Bản sao thư viện (Excel, Firebase) để trang không phụ thuộc máy chủ ngoài. Tải bằng nút trong trang, xem mục *Cập nhật bản mới* | Nên có |
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

## Nhập dữ liệu từ ảnh, văn bản, CSV

Nút **⇪ Nhập dữ liệu** (thanh trên cùng, chỉ người làm lịch thấy) nhận 4 loại dữ liệu: Phân ca, OFF/NP, Chấm công OVER/BÙ, Lịch bay. Mỗi loại lấy được từ nhiều nguồn:

| Nguồn | Cách đọc | Cần gì |
|---|---|---|
| Ảnh chụp giấy viết tay, bảng in, ảnh màn hình, PDF | AI Google Gemini đọc | Khoá API Gemini miễn phí (xem dưới) |
| Dán bảng từ Excel / Google Sheets | Máy tự đọc theo cột | Không cần gì |
| Văn bản tự do (tin nhắn Zalo, email) | AI đọc | Khoá Gemini |
| File CSV / TSV / TXT | Máy tự đọc theo cột | Không cần gì |
| File Excel mẫu cũ | Trình nhập Excel | Không cần gì |

**Quy trình an toàn:**
1. Đọc xong, trang hiện **bảng kiểm tra**: ảnh gốc để đối chiếu, mỗi dòng ghi rõ nội dung đọc được và nội dung hiện có trong lịch. Dòng chưa chắc được tô vàng (tên chưa khớp, chữ không đọc được, AI không chắc).
2. Bạn sửa ngay trong bảng: chọn lại nhân viên, ngày, trạng thái, chuyến, hoặc bỏ chọn dòng không muốn nhập.
3. Bấm **Kiểm tra xong, nhập vào lịch…**. Trang hỏi lại *"Dữ liệu đã chuẩn chưa?"*.
4. Khi bạn xác nhận, trang **tự tạo bản sao lưu** của tuần rồi mới ghi. Có thể chọn tải thêm một file sao lưu về máy.
5. Nhập xong vẫn sửa tay như thường. Muốn bỏ thì bấm **Hoàn tác lần nhập này**, hoặc vào **Cài đặt & dữ liệu → Nhập / xuất dữ liệu → Bản sao lưu tự động** (giữ 30 bản gần nhất).

**Cách nhanh nhất trên điện thoại:** bấm **📷 Nhập từ ảnh** trên thanh trên cùng, chụp hoặc chọn ảnh có sẵn (kể cả ảnh nhận qua Zalo). AI tự nhận biết đó là phân ca, OFF/NP, chấm công hay lịch bay, đọc xong là hiện ngay bảng kiểm tra. Người dùng không cần cài đặt gì.

**Bật AI đọc ảnh — người quản lý làm MỘT lần cho cả nhóm:**
1. Mở https://aistudio.google.com/apikey, đăng nhập Google, bấm **Create API key**, rồi chép khoá. Khoá mới có dạng `AQ.Ab…` (Google đã bỏ dạng `AIza…` cũ cho Gemini).
2. Trong trang lịch, vào **Cài đặt & dữ liệu → Nhập / xuất dữ liệu → Đọc ảnh bằng AI**, dán khoá, bấm **Bật cho cả nhóm**.
3. Xong. Mọi người làm lịch trên mọi máy dùng được ngay.
   - Khoá được lưu trên Firebase, chỉ người làm lịch đọc được; người xem và người ngoài không thấy.
   - Ở gói miễn phí, Google có thể dùng nội dung gửi lên để cải thiện sản phẩm. Nếu ngại, hãy dùng cách dán văn bản.

**Mẹo chụp ảnh:** chụp thẳng, đủ sáng, cả bảng nằm trong khung. Bảng dài thì chụp nhiều ảnh, chọn cùng lúc. Ảnh nghiêng thì bấm **⟳ Xoay**.

**Nếu bạn đã cài từ bản trước:** dán lại file `firestore.rules` mới vào Firebase rồi bấm **Publish**. Bản mới có thêm quyền cho mục bản sao lưu và khoá AI dùng chung; nếu chưa dán, nút **Bật cho cả nhóm** sẽ báo không có quyền.

## Chốt tuần

Khi tuần đã chạy xong và chấm công xong, bấm **🔒 Chốt tuần** ở đầu tab Lịch tuần.

- Tuần đã chốt **không sửa được** (kể cả nhập dữ liệu, tự động chia). Ai cũng thấy dải báo "Tuần đã chốt" ở đầu trang.
- Trang lưu kèm **danh sách nhân viên, chuyến, mã ca lúc chốt**. Sau này có xoá người nghỉ việc hay đổi giờ chuyến thì tuần cũ vẫn hiện đúng như lúc đó.
- Cần sửa lại: bấm **Mở khoá để sửa** trên dải báo (chỉ người làm lịch).

**Người nghỉ việc / chuyến bỏ:** khi bấm xoá, trang gợi ý **Chuyển sang tạm nghỉ** (với người) hoặc **Tắt slot** (với chuyến) thay vì xoá hẳn, để lịch các tuần cũ không mất tên.

## Cập nhật bản mới (khi nhận index.html mới)

1. Trên GitHub, mở kho → bấm vào `index.html` → biểu tượng bút ✏️ hoặc *Add file → Upload files*, kéo `index.html` mới vào, bấm **Commit changes**.
2. **Dán lại `firestore.rules`** vào Firebase (Firestore Database → Rules → dán → **Publish**). Bản này lưu mỗi tuần thành 7 phần nhỏ theo ngày; nếu chưa dán luật mới, khi lưu sẽ báo *"Không có quyền ghi… hãy dán lại firestore.rules"*.
3. Lần đầu dùng bản này, người làm lịch mở trang một lần: tuần đang mở tự chuyển sang dạng mới khi lưu, không cần làm gì.
4. **Thư viện tự lưu (làm một lần):** vào **Cài đặt & dữ liệu → Nhập / xuất dữ liệu**, mục *Thư viện của trang*, bấm **Tải bộ thư viện (lib.zip)**, giải nén ra được thư mục `lib`, rồi tải cả thư mục lên GitHub (*Add file → Upload files*, kéo thư mục `lib` vào). Từ đó trang dùng bản trong kho; nếu thiếu thì tự lấy từ mạng như cũ.

## Gửi lịch qua Email, Telegram, Zalo (miễn phí)

- **Cách đơn giản nhất:** nhập SĐT / email từng người ở **Cài đặt & dữ liệu → Gửi tin → Danh bạ** (dán cả danh sách được). Bấm **📣 Gửi lịch** → mỗi người có nút **Zalo** (mở chat, dán là gửi), **SMS**, **Email**. Nhân viên không phải đăng ký.
- Tuỳ chọn gửi tự động: người quản lý cài một lần ở **Cài đặt & dữ liệu → Gửi tin**: Email qua Google Apps Script (Gmail của bạn, khoảng 100 thư/ngày), Telegram qua bot tạo bằng @BotFather. Trang hướng dẫn từng bước.
- Nhân viên bấm **🔔 Nhận lịch**, chọn tên, bật Email hoặc kết nối Telegram.
- Mỗi tuần bấm **📣 Gửi lịch** ở tab Lịch tuần: gửi cả tuần hoặc chỉ người có thay đổi. Zalo: bấm Chép rồi dán vào nhóm.
- **Bắt buộc:** dán lại `firestore.rules` mới (có thêm mục `subs` và `sendlog`), nếu không nhân viên sẽ không lưu được đăng ký.

## Dùng hằng ngày

- **Hướng dẫn trong trang:** nút **📖 Hướng dẫn** trên thanh trên cùng (và link *Xem hướng dẫn* ở màn hình đăng nhập). Người xem thấy bản cho nhân viên; người làm lịch thấy thêm bản đầy đủ. Mỗi bản đọc trực tiếp, tải Word, hoặc in / lưu PDF.

- **Nhân viên:** mở link, đăng nhập bằng Google, hoặc bấm *Tạo tài khoản* bằng email rồi xác minh qua thư. Họ chỉ xem được Lịch tuần, Quân số, Thống kê. Gõ tên vào ô tìm kiếm để xem lịch của mình. Lịch tự cập nhật khi người làm lịch sửa.
- **Người làm lịch:** chia lịch, sửa và tạo tuần mới ngay trên trang. Mọi thứ tự lưu lên Firebase, không cần tải file hay đăng lại.
- **Thêm hoặc bớt người:** sửa danh sách ở *Quyền truy cập*. Người bị xoá mất quyền ngay lập tức.
- **Sao lưu:** thỉnh thoảng bấm *Tải bản sao lưu* để giữ một bản trên máy, phòng khi xoá nhầm.

## Tốc độ và bộ nhớ đệm

- Trang lưu một bản dữ liệu trong trình duyệt (bộ nhớ đệm của Firebase). Người xem mở lại trang gần như tức thì, bản mới nhất từ máy chủ tự cập nhật sau đó vài giây. Người làm lịch luôn đọc bản mới nhất từ máy chủ trước khi sửa.
- Trên **máy dùng chung**, nhớ bấm **Đăng xuất**: trang sẽ xoá bộ nhớ đệm trên máy đó.

## Hạn mức miễn phí

Gói Spark của Firestore cho khoảng 50.000 lượt đọc, 20.000 lượt ghi mỗi ngày và 1 GB lưu trữ. Với khoảng 80 người xem vài lần mỗi ngày, mức dùng chỉ khoảng vài nghìn lượt, còn rất xa giới hạn. Nếu một ngày bị vượt, trang chỉ tạm không lưu được đến hôm sau và không mất tiền, vì gói Spark không có thẻ thanh toán.

Mỗi tuần lịch chiếm khoảng 150 KB, nên 1 GB đủ cho hàng nghìn tuần (khoảng 20 năm vẫn dưới 20% dung lượng), không cần xoá bớt.

Để tiết kiệm lượt đọc:
- Mỗi lần sửa một ô, máy chỉ gửi phần ngày bị sửa (khoảng 4 KB thay vì cả tuần 150 KB).
- Trang để ở tab nền quá 1 phút sẽ tạm ngừng nhận cập nhật, mở lại thì tự đồng bộ ngay.
- Bản sao lưu tự động chỉ giữ 30 bản mới nhất, bản cũ tự xoá.

## Gặp lỗi?

| Thông báo | Cách xử lý |
|---|---|
| "Chưa kết nối Firebase" | `firebase-config.js` chưa được sửa, hoặc chưa tải lên GitHub |
| "Tên miền … chưa được phép" | Làm lại bước 6 |
| "Cách đăng nhập này chưa được bật" | Làm lại bước 2 |
| "Chưa được cấp quyền" | Email chưa có trong *Quyền truy cập*. Với chủ dự án: kiểm tra email ở dòng `OWNERS` và đã bấm *Publish* luật chưa |
| "Bạn không có quyền sửa" | Tài khoản này là *Người xem* |
| Sửa xong GitHub mà trang chưa đổi | Đợi 1–2 phút rồi tải lại trang (Ctrl+F5) |

---

© 2026 ThienNV · thiennv@vnpt-technology.vn · 0888.99.33.00. Mọi quyền được bảo lưu.
