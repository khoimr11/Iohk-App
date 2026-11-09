# Mô hình AI chạy trên máy

- `migan_pipeline_v2.onnx`: MI-GAN (Picsart AI Research, giấy phép MIT), dùng cho **Xoá vật thể**. Lấy từ gói npm `migan-onnx`.
- `realesrgan/general_fast-64`: Real-ESRGAN general x4v3 (Xintao Wang, giấy phép BSD 3-Clause, xem `realesrgan/LICENSE`), dạng TensorFlow.js do gói npm `@plotdb/upscaler` chuyển đổi. Dùng cho **Phóng to nét AI x2/x4**.

Mô hình tải về trình duyệt khi dùng lần đầu, lưu trong bộ nhớ đệm, ảnh không gửi đi đâu.
