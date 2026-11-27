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

### Cập nhật 26/11 — Công cụ cho chuyến Hà Nội · Ninh Bình

**Ảnh**
- **LUT .cube**: nhập LUT từ Lightroom, Resolve hay bộ LUT tải về (Công thức → LUT màu). LUT chạy sau preset, có thanh độ mạnh, ảnh xuất giống hệt bản xem trước. LUT lưu trong trình duyệt và dùng chung với Video.
- **Chép / dán chỉnh**: chép preset, mọi thông số và LUT của ảnh này rồi dán sang ảnh khác (Ctrl+Shift+C, Ctrl+Shift+V).
- **Áp cho nhiều ảnh**: chọn cả loạt ảnh, app áp màu đang chỉnh, giữ độ phân giải gốc, in ngày theo ngày chụp của từng file. Máy tính tải về một file ZIP, điện thoại mở bảng chia sẻ để lưu thẳng vào Ảnh.
- **Cỡ xuất Instagram**: 3:4 (1080×1440) hoặc 4:5 (1080×1350), cắt giữa, thu nhỏ kỹ và làm nét nhẹ.

**Video Pro**
- **Dò beat**: nhạc thêm vào được dò nhịp ngay trên máy, hiện vạch nhịp và số BPM trên track nhạc. Mép clip và đầu phát hít vào nhịp. Phím `M` đặt mốc tay, `B` / `Shift+B` nhảy tới nhịp sau / trước.
- **Tạo nhanh → Cắt theo nhịp**: mỗi nhịp, 2 nhịp, 4 nhịp hoặc để app tự chọn, điểm cắt rơi đúng beat.
- **LUT .cube** cho từng clip và cho lớp hiệu ứng.
- **Khung điện ảnh**: hai thanh đen 2.39, 2.0 hoặc 1.85, có kiểu mở từ đen, khép vào, mở ra, khép rồi mở, hoặc tự đặt keyframe.
- **Hiện lần lượt** cho bố cục nhiều ô: theo thứ tự, ngược lại, từ giữa ra, ngẫu nhiên; cách nhau theo giây hoặc theo nhịp nhạc; hiện dần, trượt lên hoặc phóng ra; tuỳ chọn ô mới sáng, ô trước tối dần. Thêm mẫu **Nền + khung nổi** (nền mờ tối, ba ô nổi xếp dọc).
- **Chữ theo từng từ**: hiện dần, bật lên hoặc tô sáng kiểu karaoke; tự chia đều, sửa giờ từng từ, hoặc khớp theo nhịp. Mẫu **nhật ký** chữ thường, serif mảnh nghiêng. Thêm nút viết thường và hai font mảnh.
- **Instagram**: mẫu xuất Reel 1080×1920, Carousel 3:4, Feed 4:5 (30 fps, H.264 + AAC, bitrate cao); nút **vùng an toàn** trên khung xem trước (vùng chữ Reels, khung lưới 3:4, khung feed 4:5, chỉ là ước lượng) và báo khi chữ lọt ra ngoài; **Ảnh bìa** chọn khung hình, thêm tiêu đề, lưu JPG 1080×1920 hoặc 1080×1440; xuất thêm **bản không nhạc** kèm file mốc cắt để ghép nhạc trong Instagram.
- **Làm sạch tiếng** cho đoạn nhạc, lồng tiếng: lọc ồn và chuẩn hoá về khoảng −14 LUFS, tạo file mới nên vẫn hoàn tác được.

### Cập nhật 26/11 (tối) — Carousel liền mạch

Trong chế độ Ảnh, công cụ mới **Carousel liền mạch**: một khổ dài trải qua 2–10 slide, ảnh đặt vắt qua mép slide nên lúc vuốt trên Instagram trông liền một dải.
- Khổ 3:4 (1080×1440) hoặc 4:5 (1080×1350); nền trắng, kem, đen hoặc tự chọn màu, có tuỳ chọn vân giấy. Mép slide hiện bằng nét đứt có đánh số, phóng to thu nhỏ và cuộn ngang thoải mái.
- Thêm nhiều ảnh một lúc hoặc kéo thả. Mỗi ảnh kéo, đổi cỡ (giữ tỉ lệ), kéo ảnh trong khung (chạm đúp), xoay nhẹ, viền trắng hoặc Polaroid, bóng đổ, đổi lớp, xoá. Hít vào mép slide, đường giữa, ảnh khác và lề 24px (giữ Alt để tắt).
- Mẫu bố cục cho từng slide (1, 2 dọc, 2 ngang, 3, 4, 1 + 2) và mẫu **Vắt** đặt một ảnh lớn đè lên mép hai slide. Nút **Tự xếp** chia ảnh cho các slide, khoảng 2 slide có 1 ảnh vắt.
- Chữ dùng các font sẵn có, thêm kiểu nhật ký serif mảnh nghiêng viết thường; chữ cũng vắt qua mép được.
- Tuỳ chọn áp màu đang chỉnh (preset, LUT, thông số) cho mọi ảnh, chỉnh từ file gốc.
- **Xem thử** trong khung điện thoại kiểu Instagram, vuốt từng slide, kèm ô lưới 3:4 của slide 1.
- Xuất N ảnh JPG rộng đúng 1080, tên 01.jpg, 02.jpg…, vẽ từ ảnh gốc nên đường nối giữa hai slide khớp từng pixel. Máy tính tải về ZIP, điện thoại mở bảng chia sẻ. Dự án tự lưu trong trình duyệt.

### Cập nhật 26/11 (khuya) — Ảnh: bộ mẫu, sticker giấy, thẻ công thức, ngược sáng

**Carousel liền mạch**
- **Bộ mẫu một chạm**: Sổ còng (hai trang giấy kẻ, gáy lò xo kim loại ở mép giữa hai slide), Scrapbook (polaroid nghiêng, băng keo, chú thích viết tay), Tạp chí (tiêu đề đỏ đứng đậm chồng chữ script, chú thích nhỏ ở góc), Thư tình (giấy kem, tiêu đề serif đỏ, tem), Photo dump file (ảnh nền tràn khung, ảnh nhỏ kèm tên 01.jpg…, bong bóng tin nhắn), Bậc thang (3 ảnh xếp chéo qua các slide, bóng nắng lá), Chữ lặp (nền đỏ gạch có chữ lặp), Thẻ công thức 9:16 (ảnh giữa khung trên nền chính nó làm mờ, nhãn hook, thẻ Máy ảnh / Ống kính / Film), 3 ô một câu (9:16 hoặc 3:4, ba ảnh xếp dọc, mỗi ô một chữ nhỏ nối thành câu). Ảnh đã thêm tự lấp vào ô theo thứ tự; ô trống chạm đúp để chọn ảnh.
- **Sticker vẽ bằng nét** (phóng to vẫn nét, không dùng ảnh có bản quyền): băng keo nhiều màu mép xé, kẹp giấy, gáy lò xo, tem bưu điện (sửa được chữ), sao, lấp lánh, đá quý, trang giấy kẻ, thẻ công thức kính mờ.
- **Kiểu chữ mới**: nhãn hook (chữ đen đậm trên nền trắng bo tròn), tin nhắn xanh / xám, chú thích viết tay, tên file, tiêu đề đỏ đứng đậm, chữ script. Thêm font Oswald và Patrick Hand (đều có tiếng Việt).
- **Nền**: giấy kem, giấy kraft, denim, đỏ gạch; chữ lặp làm nền; **bóng nắng lá** phủ lên cả dải.
- Khổ **9:16 (1080×1920)** và carousel 1 slide.
- **Mockup**: xuất ảnh PNG 1080×1350 có điện thoại hiển thị slide 1 đang vuốt sang slide 2, để khoe carousel.

**Ảnh**
- **Thẻ công thức** (công cụ mới): chọn Máy ảnh (Compact film, Máy dùng một lần, Máy số CCD, Rangefinder, Half-frame — đổi tông, hạt, tối góc, in ngày), Ống kính 24 / 28 / 35 / 50 / 85mm (cắt góc nhìn theo tiêu cự, điện thoại tính là 26mm, kèm tối góc hoặc độ mềm), Film (bộ màu). Thêm thẻ công thức kính mờ và nhãn hook lên ảnh. Lưu ảnh **9:16 nền mờ** (ảnh giữa khung, phần trống lấp bằng chính ảnh làm mờ), cũng có trong Cỡ ảnh xuất.
- **Sticker giấy** và **bóng nắng lá** trong công cụ Sticker; chữ có thêm kiểu Nhãn hook và Tin nhắn; khung mới Giấy kem, Giấy kraft, Denim, Đỏ gạch.
- **Ngược sáng AI** (Hiệu ứng AI → Công cụ AI): quầng sáng sau đầu và vai, viền sáng theo mép người, màu Ấm / Trắng / Hồng, chỉnh độ mạnh và độ lan.
- **Trước / Sau** (công cụ mới): ảnh ghép cạnh nhau, trên dưới 9:16 có chữ Trước / Sau, hoặc video 4 giây có đường gạt chạy qua lại (MP4 hoặc WebM tuỳ trình duyệt).
- **Bộ màu Chuyến đi** (nhóm đầu trong thư viện preset): Khôi & Thư (ấm cam hồng đều cả ba vùng, vùng giữa ấm nhất, giảm bão hoà khoảng 20%, đen nâng lên khoảng 11/255, trắng nén về khoảng 230), Nước ngọc, Nắng phố, Okinawa, Alps moody. Mỗi màu là một LUT 33³ trong thư mục `luts/`, tự lưu vào danh sách LUT (dùng được cả bên Video) và mở được bằng Lightroom, Resolve.

### Cập nhật 26/11 (khuya) — Video Pro: chữ sau người, chuyển cảnh dải, mẫu dựng sẵn, chuyển động máy

**Người trong khung (AI tách người theo từng khung, có trong video xuất)**
- **Chữ sau người**: bật trong bảng Chữ, chữ nằm giữa nền và người, người đi ngang sẽ che chữ. Mask người được tính theo từng khung và lưu đệm; nút **Chuẩn bị mask** (tab Nâng cao) tính trước cho cả clip để xem trước mượt hơn.
- **Bóng trắng** (Hiệu ứng → Người): tô kín người bằng màu phẳng trong 1–12 khung ở mỗi nhịp nhạc, hoặc suốt cả lớp.
- **Nhân bản người**: chụp người ở các thời điểm khác của clip thành bản sao đứng yên, cho hiện lần lượt theo nhịp; có kiểu bóng trắng rồi thành người thật.

**Chữ động**
- **Chữ trộn font**: mỗi từ một kiểu (serif mảnh nghiêng, chữ đứng đậm, chữ hoa dãn rộng, chữ viền), xếp chồng từng dòng, hiện theo nhịp hoặc chia đều; từ viết HOA được làm to và đổi màu.
- Hoạt ảnh chữ mới: **Xáo chữ**, **Hiện từng ký tự** (giữ nguyên vị trí chữ), cùng Gõ chữ và Mờ sang rõ có sẵn.
- **Chữ xếp dọc**: mỗi ký tự một hàng, hiện dần từ trên xuống.

**Chuyển cảnh mới** (khớp nhịp, có trong video xuất): **Dải** (2–12 dải, ngang, chéo 45° hoặc dọc, so le, xen kẽ hai hướng, kiểu chuyển động), **Rèm dọc**, **Quét tối** (theo độ sáng của cảnh mới hoặc cảnh cũ), **Khung màu thu vào** (tuỳ chọn người hiện trước trên nền màu), **Dải dọc nở** (nhiều clip thành dải dọc rồi nở ra, hợp làm đoạn mở). Chọn độ dài chuyển cảnh theo ½, 1, 2, 4 nhịp.

**Bố cục theo vùng**
- **Dải mở dần**: thanh khung điện ảnh bắt đầu từ một vạch mảnh rồi cao dần, chữ luôn nằm trên thanh. Nút **Dải mở dần + tiêu đề** trong Hiệu ứng.
- **Lưới trong dải**: chia dải 2.39 thành 2–4 ô dọc trên khung 9:16, các ô lần lượt đổi cảnh ở mỗi nhịp.

**Mẫu dựng sẵn** (mục Mẫu)
- **Lưu làm mẫu**: video và ảnh trong dự án thành ô trống, giữ nhịp cắt, chuyển cảnh, chữ, lớp hiệu ứng và màu.
- **Dùng mẫu**: thả video, ảnh (và nhạc nếu muốn), app tự xếp vào từng ô theo thứ tự, lấy đoạn giữa cho vừa ô, video ngắn được làm chậm cho đủ.
- 4 mẫu có sẵn: **Moving postcards**, **Một câu, năm nơi**, **Hà Nội đứng yên** (tự khoá khung cho shot cầm tay), **Nhật ký Thạch Trang**.

**Máy quay và xuất**
- **Chuyển động máy** (tab Máy quay của mỗi clip hoặc ảnh): tiến vào, lùi ra, zoom giật, zoom bật, dolly zoom, trượt ngang, trượt 2.5D, lia, ngước, lia quất (có tiếng vút khi xuất), nghiêng khung, xoay máy, đung đưa, cầm tay, rung theo nhịp, hé nét, chuyển nét, xoá phông giả, tilt shift, vệt anamorphic, loé sáng quét, dừng hình, tua ngược, zoom vô tận. Mỗi kiểu có tên tiếng Anh, chỉnh cường độ, thời lượng, kiểu chuyển động, chồng được lên keyframe.
- **Gợi ý prompt AI**: ghép câu tiếng Anh gồm mô tả cảnh, tối đa hai chuyển động máy, tốc độ và ánh sáng để dán vào Google Flow, Kling hay Wan; có 5 combo gợi ý.
- **Nhoè chuyển động** (trộn khung như màn trập chậm), **Khoá khung** (đo rung ngang dọc rồi bù lại, cắt mép nhẹ), hiệu ứng **Loé ống kính** động.
- Xuất **Xoay ngang trong 9:16**: khung ngang 16:9 xoay 90° vào video dọc 1080×1920.

### Cập nhật 27/11 — Carousel & Ảnh: hệ tạp chí, lookbook

Bộ mẫu cũ (sổ còng, scrapbook, băng keo, lấp lánh, denim, kraft) vẫn còn nhưng đã gom vào mục **Vui nhộn** (đóng sẵn). Mặc định giờ là hệ tạp chí: lề rộng, ít chữ, một điểm nhấn.

**Phông tự host** (`fonts/`, OFL, đủ dấu tiếng Việt, khoảng 900 KB, chỉ tải phần cần dùng)
- Cormorant Garamond (Light, Light nghiêng, Medium), EB Garamond (thường, nghiêng), Fraunces Light (thường, nghiêng), Noto Serif Display Light (thường, nghiêng), Playfair Display nghiêng, Be Vietnam Pro (300, 400, 500), Manrope (400, 500), Josefin Sans Light, Montserrat Light, IBM Plex Mono.
- Mỗi phông có ba phần latin, latin-ext, vietnamese. Đã soát từng glyph tiếng Việt (ằ ẩ ặ ế ộ ữ ỵ đ Ơ Ư và đủ bảng chữ hoa, thường). Bodoni Moda bị loại vì thiếu dấu tiếng Việt.
- Video Pro dùng chung bằng `<link rel="stylesheet" href="fonts/fonts.css">`. Giấy phép ở `fonts/LICENSES.txt`.

**5 cặp chữ** (một chạm, đổi cả series)
- *Tạp chí cổ điển*: tiêu đề Cormorant Garamond Light / nghiêng, nhãn Be Vietnam Pro chữ hoa giãn +300.
- *Tối giản hiện đại*: Fraunces Light, nhãn Manrope chữ hoa giãn +320.
- *Nhật ký Nhật/Hàn*: EB Garamond nghiêng, ngày tháng và số trang bằng Plex Mono viết thường, rất nhỏ.
- *Lookbook*: Noto Serif Display Light chữ hoa giãn +200, nhãn Josefin Sans Light giãn +420.
- *Điện ảnh*: Montserrat Light chữ hoa giãn +500 như title phim, tên và lời bằng Cormorant nghiêng.
- Mỗi cặp quy định phông, độ đậm, giãn chữ, chữ hoa hay thường, giãn dòng và cỡ cho 9 vai trò: tên tạp chí, tiêu đề, nhãn chữ hoa, ngày và toạ độ, đoạn văn, trích dẫn, chú thích, số trang, số lớn. Chọn chữ rồi chạm một vai trò là xong. Có thêm giãn chữ, giãn dòng, căn trái/giữa/phải, CHỮ HOA và bề ngang tự xuống dòng.

**16 mẫu tạp chí & lookbook** (lưới 12 cột, lề 88px ≈ 8%, đường kẻ 1px, số trang, N°, toạ độ, địa danh song ngữ; chữ mẫu là chuyến Hà Nội · Ninh Bình 18–22.11.2026 của Khôi & Thư, sửa được hết)
- 4:5: Bìa tạp chí, Lookbook lưới (2 slide), Passe-partout gallery (3 slide), Contact sheet 35mm (rìa phim, lỗ răng cưa, số khung 11, 11A… vẽ bằng code, khung chọn màu rượu vang), Chương (2 slide), Trích dẫn, Hành trình tối giản (đường mảnh, toạ độ, tên địa danh hai thứ tiếng), Toàn khung + chú thích, Ảnh nhỏ giữa khoảng trắng.
- 3:4: Trang đôi editorial (ảnh vắt qua mép sang trang chữ), Diptych và Triptych liền mạch, Photo dump tinh tế (lưới lệch, không băng keo), Trọn một số (7 slide ghép từ bìa, chương, trang đôi, trích dẫn, ảnh nhỏ).
- 9:16: Bìa Reel (chữ nằm trong vùng 3:4 để lưới trang cá nhân không cắt mất), Khép lại (credits như cuối phim).
- Ảnh tự vào ô hợp hướng dọc ngang. Chữ và lớp tối nằm trên ảnh **tự chọn mực**: đo độ sáng thật của ảnh bên dưới, chọn chữ kem trên lớp tối hoặc chữ mực trên lớp sáng, tự tăng độ đậm lớp tối khi ảnh có vùng quá sáng.

**Nền & màu**
- Chất liệu vẽ bằng code, rất nhẹ: giấy kem mịn, giấy cotton, vải lanh, vữa thạch cao, trắng gallery, đá xám, đen ấm, giấy ảnh bóng. Thêm thanh **Ánh sáng cửa sổ** (sáng ấm từ góc trên trái, bóng khung cửa mờ).
- 6 bảng màu: Kem & mực, Trắng gallery, Rượu vang, Rêu, Đá xám, Đen ấm (#1C1A17, #F3EEE6, #6E1F1F, #3F4A3C…). Chữ phụ luôn đạt tương phản ≥ 4.5:1.
- **Lấy màu từ ảnh**: chọn giấy, mực và một màu nhấn từ ảnh đang chọn, rồi tự chỉnh cho đủ tương phản.

**Kiểm tra sang** (nút trên thanh Carousel): soát từng slide, khoanh đỏ chỗ cần sửa và hiện lề an toàn 6%. Báo khi có hơn 2 họ chữ, chữ ra ngoài lề, quá 2 sticker, chữ trắng tinh hoặc đen tuyền, tương phản thấp (đo trên ảnh thật bên dưới chữ), slide chật.

**Chi tiết khác**
- Mockup trung tính: nền vữa sáng, máy viền titan, bóng tiếp xúc mềm, giao diện xám không màu mè.
- Thẻ công thức mặc định là bản mảnh: hai đường kẻ, nhãn chữ hoa nhỏ, giá trị serif nghiêng, không nền. Bản kính mờ vẫn chọn được.
- **Dải chữ mảnh**: serif mảnh trên một dải màu trơn, thay cho nhãn hook bo tròn chữ đậm (nhãn hook cũ vẫn còn).
- Công cụ Chữ bên Ảnh có mục **Kiểu chữ sang**: chọn cặp chữ rồi chạm Tên tạp chí, Tiêu đề, Nhãn chữ hoa, Chú thích, Trích dẫn hoặc Toạ độ & ngày. Sticker và emoji gom vào mục Vui nhộn; trên cùng là Thẻ công thức mảnh, Đường kẻ mảnh, Dải chữ mảnh.
- Ảnh trong carousel có thêm viền Passe-partout (gờ cắt bìa) và Đường viền mảnh.

### Cập nhật 27/11 — Video Pro 3: hậu kỳ cho phim 6–7 phút

**Màu (tab Chấm màu của mỗi clip và lớp hiệu ứng)**
- **Bánh xe màu** Lift / Gamma / Gain / Offset: kéo chấm để đẩy màu, thanh dưới để sáng tối, bấm đúp để đặt lại. **Tương phản có pivot** (giữ điểm giữa, không cháy trắng), bão hoà riêng.
- **Đường cong**: Tổng, Đỏ, Xanh lá, Xanh dương, Hue → Sat, Hue → Hue, Sáng → Sat (đường cong mượt, không vọt quá điểm).
- **Chọn vùng màu (HSL qualifier)** có sẵn Da người, Nước sâu, Lá cây, Trời; xoay màu, bão hoà, độ sáng riêng cho vùng chọn; nút Xem vùng chọn.
- **Khớp màu với clip khác**: đo điểm đen, trung tính, trắng từng kênh của hai shot rồi tự đặt bánh xe; tuỳ chọn dùng chung preset, LUT, film của clip mẫu.
- **Scope**: waveform, RGB parade, vectorscope có đường màu da, histogram có báo % đen chết / trắng cháy. **Trước / Sau** chia đôi khung xem trước, kéo được đường chia.
- **Phim nhựa** cho từng clip: 35mm mịn, Kodak 2383, Portra 400, Eterna, 16mm; hạt, cỡ hạt, halation, gate weave.
- **Chép / dán màu** (Ctrl+Shift+C / V), áp cho các clip đang chọn hoặc mọi clip. Xử lý trung gian 16-bit float khi GPU hỗ trợ (đỡ banding trời).

**Dựng**
- **Roll (N), Slip (Y), Slide (U)**, Chọn (V); phím `,` / `.` dịch 1 khung theo công cụ đang chọn.
- **Chọn nhiều**: Shift / Ctrl + bấm, Ctrl+A chọn mọi clip chính; xoá, áp màu cho cả nhóm.
- **Sync lock**: chữ, lớp phủ, lớp hiệu ứng, lồng tiếng bám theo clip chính khi dồn, cắt, đổi chỗ. Nhạc và lớp môi trường đứng yên. Shift+Delete xoá và dồn track.
- **J-cut / L-cut** trong tab Âm thanh của clip: tiếng vào sớm hoặc ra muộn so với hình, có vạch xanh trên dòng thời gian.
- **Marker có ghi chú** (Shift+M) và **chương**: nhãn chương trên thước thời gian, danh sách trong bảng Dự án, xuất file marker.

**Chữ điện ảnh** (thư viện Chữ)
- **Title card chương**: số lớn, tên chương nghiêng, đường kẻ mảnh, ngày và toạ độ; chèn nền đen ấm, nền giấy kem hoặc đè lên hình làm tối.
- **Tên phim**, **lower-third địa danh** (tên, dòng phụ, ngày, toạ độ), **credits cuộn** như cuối phim (vai trò | tên, tiêu đề nhỏ), **phụ đề song ngữ**, **phụ đề điện ảnh** (chữ kem, bóng mềm, hiện 5 khung). Phụ đề tạo từ lời thoại / SRT dùng kiểu điện ảnh mặc định.
- Dùng 5 cặp chữ chung với chế độ Ảnh (phông tự host trong `fonts/`): Tạp chí cổ điển, Tối giản hiện đại, Nhật ký Nhật/Hàn, Lookbook, Điện ảnh. Chữ hiện dần 12–18 khung, không nảy.

**Âm thanh**
- Crossfade ngắn ở mọi điểm cắt (chống tiếng “bụp”), chỉnh trong bảng Dự án.
- **Ducking**: nhạc tự hạ khi có giọng nói (−6 đến −18 dB, nhìn trước 150 ms), tuỳ chọn hạ cả dưới thoại trong clip.
- **EQ** (cắt trầm 80 / 120 / 200 Hz, rõ giọng 3 kHz, sáng tiếng 8 kHz) và **reverb** (phòng nhỏ, phòng lớn, hang đá) cho từng đoạn âm thanh và clip.
- **Room tone** tự tìm đoạn yên nhất rồi lặp mượt suốt phim; **lớp môi trường** trải một đoạn tiếng thành nền dài cả phim.
- **Âm thanh hiệu ứng tự tổng hợp** (không bản quyền): vút nhẹ, màn trập, máy chiếu phim, gió, mặt nước, phố xa, lật trang.
- **Đồng hồ loudness** khi phát, **đo độ to cả phim** (BS.1770) và **chuẩn hoá khi xuất** −14 LUFS (Instagram, YouTube) hoặc −16 LUFS, giới hạn đỉnh −1 dBFS.

**Hiệu năng & file iPhone**
- **Proxy**: video 1080p trở lên, video quay dọc có xoay hoặc HEVC được tạo bản 960 px H.264 trong nền ngay khi nhập; xem trước trên proxy, xuất từ file gốc. Proxy lưu lại trong trình duyệt. Xem trước “Nét nhất” dùng file gốc.
- Đọc đúng hướng xoay của video iPhone (trước đây có thể hiện nằm ngang).
- Bộ giải mã ở xa đầu phát được giải phóng: timeline dài nhiều clip 4K không còn làm sập tab. Dòng thời gian chỉ vẽ dải hình quanh vùng đang xem.
- Trình duyệt không giải mã được HEVC thì app báo rõ cách khắc phục thay vì nhận clip đen.

**Giao phim** (hộp Xuất video)
- Mẫu **Phim 16:9 · 4K**, **Phim 16:9 · 1080p**, **YouTube 16:9 · 2K**, **Reel 9:16**; **khung 2.39** (thanh đen cả khi xem trước); **chương YouTube (.txt)**; **poster JPG** (đặt khung poster trong bảng Dự án).
