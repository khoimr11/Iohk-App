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
- **Video** (`video.html`): dựng clip kiểu CapCut. Timeline nhiều clip với đầu phát cố định ở giữa; cắt mép, tách (S), nhân đôi, đổi thứ tự; tốc độ 0.25–4x; 346 preset film và chỉnh màu cho từng clip; 10 hiệu ứng (rung máy, nháy sáng, lệch RGB, VHS, glitch, nhịp zoom, cháy film, mơ màng, đen trắng, in ngày); 8 kiểu chuyển cảnh; chữ 6 font với 5 hoạt ảnh; sticker; nhạc nền có hiện/tắt dần; tỉ lệ 9:16, 16:9, 1:1, 4:5, 3:4, 21:9; nền mờ ảo. Xuất MP4 (H.264 + AAC/Opus) 720p đến 4K bằng WebCodecs, tự chuyển sang ghi thời gian thực nếu trình duyệt không hỗ trợ.
- **Studio Pro** (`studio.html`): chỉnh ảnh nhiều lớp kiểu Photoshop. Layer với 16 chế độ hoà trộn, độ mờ, mask; 14 loại layer điều chỉnh (Levels, Curves, Hue/Saturation, Color Balance, Black & White, Photo Filter, Gradient Map, preset film…); vùng chọn khung / elip / tự do / đũa thần / chọn người bằng AI, làm mềm, mở rộng, đảo; cọ, tẩy, nhân bản, xoá khuyết điểm, làm sáng/tối, làm mờ/nét, chuyển màu, đổ màu, chữ, hình khối; biến đổi tự do (Ctrl+T); xoá vật thể bằng tô theo nội dung (Shift+Delete); bộ lọc Gaussian, chuyển động, Unsharp Mask, nhiễu, mosaic, tối góc, High Pass; lịch sử 50 bước; mở và lưu PSD giữ layer (thư viện ag-psd), xuất PNG/JPG/WEBP.

Ảnh mẫu trong `demo/` lấy từ Unsplash (giấy phép Unsplash, dùng tự do), qua bộ sưu tập ServiceStack/images.

Mở `index.html` hoặc bật GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.
