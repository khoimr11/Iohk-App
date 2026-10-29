# IOHK Film Lab

App chỉnh ảnh kiểu film chạy trên trình duyệt, có 346 preset: Nhật Bản, Hong Kong, kiểu Fujifilm, Nikon, Leica, toàn bộ bộ màu kiểu VSCO (Cổ điển, Film X, Đặc biệt), film màu cổ điển, điện ảnh, Retro / Y2K, vintage, đen trắng và đặc biệt. Có hạt film, halation, bloom, light leak, in ngày giờ, duotone và hiệu ứng máy số đời đầu. Ảnh được xử lý ngay trên máy (WebGL), không upload đi đâu.

- **Desktop:** giao diện kính kiểu Liquid Glass, thư viện có tìm kiếm và lọc theo cảm xúc, rê chuột để xem trước, so sánh chia đôi, phóng to, histogram.
- **Mobile:** dải preset ngang, chỉnh bằng một thanh lớn, vuốt ngang để đổi preset, chụm để phóng to, lưu thẳng vào thư viện Ảnh. Có thể “Thêm vào màn hình chính” để dùng như app.

- **Công cụ chỉnh ảnh:** cắt theo tỉ lệ, xoay, lật, chỉnh nghiêng; cọ làm đẹp (mịn da, xoá mụn, trắng răng, son môi); nắn dáng (đẩy, phóng to, thu nhỏ); mosaic và làm mờ; vẽ (bút, neon, dạ quang); chữ 5 font; sticker; 5 kiểu khung; ghép 2–9 ảnh.
- **Làm đẹp một chạm:** tự xoá mụn (dò nốt mụn tối, đỏ, đầu trắng; lấp bằng da xung quanh và giữ vân da), mịn da kiểu tách tần số, sáng da giữ độ tương phản; có AI nhận diện khuôn mặt để bảo vệ mắt, mày, môi.
- **Giữ chất lượng ảnh:** mọi bộ lọc chạy trên GPU với Gaussian chuẩn, nắn dáng chỉ nội suy một lần (Catmull-Rom), xem trước nét theo màn hình và khi phóng to, xuất ảnh đúng độ phân giải gốc.
- **AI chạy trên máy (MediaPipe):** xoá, làm mờ hoặc đổi màu nền với mép theo đường viền ảnh; mô hình khuôn mặt nằm sẵn trong thư mục `models/` (Apache 2.0, xem `models/NOTICE.md`).

Mở `index.html` hoặc bật GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.
