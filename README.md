# IOHK Film Lab

App chỉnh ảnh kiểu film chạy trên trình duyệt, có 346 preset: Nhật Bản, Hong Kong, kiểu Fujifilm, Nikon, Leica, toàn bộ bộ màu kiểu VSCO (Cổ điển, Film X, Đặc biệt), film màu cổ điển, điện ảnh, Retro / Y2K, vintage, đen trắng và đặc biệt. Có hạt film, halation, bloom, light leak, in ngày giờ, duotone và hiệu ứng máy số đời đầu. Ảnh được xử lý ngay trên máy (WebGL), không upload đi đâu.

- **Desktop:** giao diện kính kiểu Liquid Glass, thư viện có tìm kiếm và lọc theo cảm xúc, rê chuột để xem trước, so sánh chia đôi, phóng to, histogram.
- **Mobile:** dải preset ngang, chỉnh bằng một thanh lớn, vuốt ngang để đổi preset, chụm để phóng to, lưu thẳng vào thư viện Ảnh. Có thể “Thêm vào màn hình chính” để dùng như app.
- **Font:** Inter cho giao diện, Cormorant Garamond cho tiêu đề — cả hai hỗ trợ đầy đủ tiếng Việt.

- **Công cụ chỉnh ảnh:** cắt theo tỉ lệ, xoay, lật, chỉnh nghiêng; cọ làm đẹp (mịn da, xoá mụn, trắng răng, son môi); nắn dáng (đẩy, phóng to, thu nhỏ); mosaic và làm mờ; vẽ (bút, neon, dạ quang); chữ 5 font; sticker; 5 kiểu khung; ghép 2–9 ảnh.
- **Làm đẹp một chạm:** tự xoá mụn (dò nốt mụn tối, đỏ, đầu trắng; lấp bằng da xung quanh và giữ vân da), mịn da kiểu tách tần số, sáng da giữ độ tương phản; có AI nhận diện khuôn mặt để bảo vệ mắt, mày, môi.
- **Giữ chất lượng ảnh:** mọi bộ lọc chạy trên GPU với Gaussian chuẩn, nắn dáng chỉ nội suy một lần (Catmull-Rom), xem trước nét theo màn hình và khi phóng to, xuất ảnh đúng độ phân giải gốc.
- **AI chạy trên máy (MediaPipe):** xoá, làm mờ hoặc đổi màu nền với mép theo đường viền ảnh; mô hình khuôn mặt nằm sẵn trong thư mục `models/` (Apache 2.0, xem `models/NOTICE.md`).

## Ba chế độ

- **Ảnh** (`index.html`): preset film, chỉnh màu, làm đẹp. Ảnh luôn chiếm phần lớn màn hình: trên máy tính chỉ còn một bảng bên phải (Preset · Chỉnh màu · Công cụ), phím `F` để chỉ xem ảnh; trên điện thoại ảnh tràn viền, thanh dưới cố định chiều cao, bảng công cụ nổi và tự thu gọn khi chạm vào ảnh.
- **Video Pro** (`video.html`): trình dựng nhiều track theo kiểu CapCut Pro — track chính + không giới hạn track lớp phủ, chữ, lớp hiệu ứng, âm thanh; **bố cục ghép nhiều video trong một khung** (2/3/4/6/9 ô, 1+2, hình trong hình, tròn, chéo, dải film, polaroid; chỉnh khoảng cách, bo góc, màu nền; mỗi ô căn khung riêng); **keyframe** vị trí / cỡ / xoay / độ mờ với nội suy mượt; kéo, phóng, xoay trực tiếp trên khung xem trước có hít tâm; **mask** (thẳng, gương, tròn, chữ nhật, tim, sao; làm mềm, đảo); **chroma key** và **xoá phông AI**; crop, lật, chế độ hoà trộn; **đường cong tốc độ** (Montage, Anh hùng, Viên đạn…) và tốc độ 0.25–8x; hoạt ảnh vào / ra / lặp; 13 chuyển cảnh; 12 hiệu ứng; 346 preset film; 12 mẫu chữ động, phụ đề nhanh, nhập / xuất SRT; đóng băng khung hình, tách âm thanh, ghi âm lồng tiếng; hít mép, Q/W cắt nhanh, phím tắt đầy đủ; **tự lưu dự án** trong trình duyệt (cả file gốc), danh sách dự án gần đây; xuất MP4 H.264 + AAC từ 480p đến 4K, 24–60 fps, hoặc lưu khung hình PNG. Phát xem trước dùng đồng hồ điều tốc (không seek giật), tự giảm độ phân giải xem trước khi máy yếu.

  - **Giải mã bằng WebCodecs**: video MP4/MOV (H.264, HEVC) được tách mẫu bằng mp4box.js và giải mã bằng `VideoDecoder` — tua đúng từng khung, phát mượt theo đồng hồ âm thanh (`AudioContext`), xuất nhanh hơn vì không phải chờ thẻ `<video>`. WebM hoặc trình duyệt không hỗ trợ tự chuyển về đường phát cũ.
  - **Dễ dùng**: màn hình trống có 3 bước hướng dẫn; **Tạo nhanh** (chọn ảnh/video + nhạc → tự xếp, áp màu, chuyển cảnh, Ken Burns, khớp độ dài nhạc); thanh công cụ có chữ; làn “Thêm chữ / Thêm nhạc” ngay trên dòng thời gian; **Vừa khung** (Shift+Z); xoá có nút **Hoàn tác** ngay tại chỗ; chạm khung xem trước để phát/dừng; bấm `?` xem phím tắt.
- **Studio Pro** (`studio.html`): chỉnh ảnh nhiều lớp kiểu Photoshop. Layer với 16 chế độ hoà trộn, độ mờ, mask; 14 loại layer điều chỉnh (Levels, Curves, Hue/Saturation, Color Balance, Black & White, Photo Filter, Gradient Map, preset film…); vùng chọn khung / elip / tự do / đũa thần / chọn người bằng AI, làm mềm, mở rộng, đảo; cọ, tẩy, nhân bản, xoá khuyết điểm, làm sáng/tối, làm mờ/nét, chuyển màu, đổ màu, chữ, hình khối; biến đổi tự do (Ctrl+T); xoá vật thể bằng tô theo nội dung (Shift+Delete); bộ lọc Gaussian, chuyển động, Unsharp Mask, nhiễu, mosaic, tối góc, High Pass; lịch sử 50 bước; mở và lưu PSD giữ layer (thư viện ag-psd), xuất PNG/JPG/WEBP.

Ảnh `demo/facade.jpg` do chủ dự án cung cấp và được dùng làm ảnh nền cho toàn bộ thumbnail preset.

Mở `index.html` hoặc bật GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

## Flash & bộ màu mới (bản 1.0)

- **Công cụ Flash** (mục Công cụ → Flash): 10 kiểu đèn (Flash thẳng, Sứ, Flash đêm, Tiệc, Paparazzi, Hồng sương, Selfie gương, Flash film, Giờ xanh, Studio đen). Đèn tự rọi vào khuôn mặt AI tìm thấy, ánh sáng giảm dần ra rìa, vùng sáng được nén mềm nên không cháy trắng; thanh **Quầng mềm** tạo hào quang mềm; **Làm tối nền** dùng AI tách người để đẩy nền về đen; có tuỳ chọn in ngày.
- **4 nhóm preset mới** (công thức riêng, lấy cảm hứng từ xu hướng ảnh trên điện thoại): Flash, Digi & CCD, Chân dung Á Đông, Hằng ngày. Hai thông số mới `flash` và `glow` có cả trong Chỉnh màu và Video Pro.

### Cập nhật Flash AI

- **Flash AI** làm theo cách đèn flash của Meitu: rọi sáng người (mạnh nhất ở da), khử ám màu trên mặt, đưa da về tông trắng hồng, giữ đen sâu ở tóc và quần áo, nền gần như giữ nguyên. Bốn màu đèn: Hồng, Trắng (khử ám cả khung hình), Ấm, Đỏ. Mở công cụ Flash là tự bật ở mức 80.
- Các kiểu cũ chuyển thành **Flash Pro · phong cách**.
- Giao diện dùng font **Be Vietnam Pro**, nhãn tối thiểu 11px, tương phản đạt chuẩn; kiểm tra bằng [Impeccable](https://github.com/pbakaus/impeccable) không còn cảnh báo. Xem `PRODUCT.md`.
- **Kiểu đèn IOHK**: lấy màu da trên khuôn mặt làm chuẩn để cân bằng trắng cả ảnh (khử được ám cam/vàng của đèn quán, kể cả khi kênh xanh gần như mất), đưa da về trắng sứ má hồng, thêm quầng sáng lấp lánh và nền tối. Kiểu Trắng cũng dùng cách cân bằng trắng theo da này.

### Cập nhật 2/11

- **Làm đẹp không còn nhoè viền**: mịn da giữ khối (chỉ làm phẳng vết thâm, lỗ chân lông), xoá mụn không lan ra đường hàm, son môi và trắng răng chỉ tô đúng môi, răng.
- **Video – Sửa đồng bộ**: trong bố cục nhiều ô, bật "Sửa đồng bộ cả N ô" để preset, màu, hiệu ứng, hoạt ảnh, mask, tách nền áp cho mọi ô.
- **Kho nhạc miễn phí**: mục Âm thanh có kho nhạc Creative Commons (Openverse, không cần đăng ký) chỉ gồm bài được dùng thương mại; dán Client ID Jamendo miễn phí để có bảng thịnh hành theo tuần. App tự lưu dòng ghi công tác giả để dán khi đăng.

### Cập nhật 3/11

- **Tạo nhanh làm lại**: chọn bao nhiêu ảnh/video cũng được, chọn nhiều lần để cộng dồn hoặc kéo thả; xem trước từng file, đổi thứ tự, bỏ file, sắp theo ngày chụp; chọn nhạc ngay từ kho nhạc miễn phí; tự khớp độ dài với bài nhạc và tự lặp nhạc khi video dài hơn; báo tiến độ và bỏ qua file lỗi.
- **Kho nhạc nhiều nguồn**: Openverse, Wikimedia Commons, Internet Archive (không cần đăng ký) và Jamendo (Client ID miễn phí) tìm song song; chỉ hiện bài được dùng thương mại và được ghép vào video (loại NC, ND).

### Cập nhật 9/11 — Hiệu ứng AI (tham khảo Prequel và Instagram Restyle)

- **Công cụ mới “Hiệu ứng AI”** trong chế độ Ảnh, chạy ngay trên máy, không gửi ảnh đi đâu.
- **Phong cách AI** (giống các phong cách có sẵn của Instagram Restyle): Anime, Manga, Màu nước, Sơn dầu, Phác chì, 8-bit, Truyện tranh, Pop art, Neon, Mộng mơ; có thanh độ đậm.
- **Hiệu ứng trend** (kiểu Prequel): Bling, Kim cương, Disco, Lăng kính, VHS, Glitch, 3D, Tim bokeh, Lóa film, Tia nắng, Lens flare, Witch light, Bụi film, Tuyết; có độ mạnh và nút Ngẫu nhiên. Ảnh xuất ra giống hệt bản xem trước.
- **Bộ màu Trend** (16 màu): Teal, Miami, Y2K, Vintage burn, Retro 70s, Indie kid, Fairycore, Cyberpunk, Witch light, Disco, Dreamcore, VHS, Bling, Hoàng hôn, Matcha, Neo noir.
- Phong cách, hiệu ứng và bộ màu kết hợp được với nhau, và có trong lịch sử hoàn tác.

### Cập nhật 9/11 (tối) — Công cụ AI kiểu Prequel

Trong “Hiệu ứng AI”, thẻ **Công cụ AI**:
- **Làm nét AI**: tự cân sáng, khử ám màu, tăng chi tiết và độ nét (hợp ảnh tối, ảnh mờ, ảnh tải từ mạng xã hội).
- **Đèn rọi AI** (giống Spotlight của Prequel): rọi đèn màu Trắng/Ấm/Hồng/Tím/Xanh hoặc Hai màu vào người trong ảnh, chọn hướng đèn, chỉnh độ sáng và độ tối nền.
- **Thay trời AI**: tự tìm vùng trời, thay bằng Trời xanh, Hoàng hôn, Đêm sao hoặc Mộng mơ, chỉnh màu cảnh cho hợp; nút Đổi mây.
- **Ảnh động 3D**: tách người khỏi nền, xuất video 4 giây có chiều sâu (MP4 hoặc WebM tuỳ trình duyệt).
- Bảng Hiệu ứng AI chia 4 thẻ: Phong cách AI, Hiệu ứng, Công cụ AI, Màu Trend.
- Thêm 20 màu Trend: Polaroid, 90s, Film 35mm, Blogger, Dreamy lens, Lo-fi, Grunge, Sepia, Golden, Ice, Cherry, Peach, Lavender, Moody, Cinema, Digicam, Slide film, Summer, Soft pink, Forest (tổng 36).
- Nút “✦ Hiệu ứng AI” ngay trong tab Hiệu ứng để dễ tìm.
- App tự lấy bản mới mỗi lần mở (không dùng bản cũ trong bộ nhớ đệm trình duyệt).

### Cập nhật 9/11 — AI miễn phí chạy ngay trên máy

- **Xoá vật thể** (công cụ mới): tô lên người qua đường, vật thừa, chữ… rồi bấm Xoá, AI tự vẽ lại nền phía sau. Dùng mô hình MI-GAN (giấy phép MIT).
- **Phóng to nét AI x2 / x4** (Hiệu ứng AI → Công cụ AI): AI vẽ lại chi tiết khi phóng to, cứu ảnh mờ, ảnh nhỏ tải từ mạng xã hội. Dùng Real-ESRGAN (giấy phép BSD 3-Clause). Chạy bằng GPU, máy không có WebGL thì tự chuyển sang WASM.
- Mô hình nằm trong thư mục `models/`, tải về trình duyệt ở lần dùng đầu (khoảng 28 MB cho Xoá vật thể, 2,5 MB cho Phóng to), sau đó lưu lại để dùng ngay. Ảnh không gửi đi đâu, không tốn phí.
- Xoá và phóng to đều hoàn tác được.
- “Làm nét AI” cũ đổi tên thành **Tự chỉnh AI** (cân sáng, khử ám màu, tăng chi tiết).
