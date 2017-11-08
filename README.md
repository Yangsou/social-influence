ArXiv Simple Metadata Crawler

ArXiv Simple Metadata Crawler được viết nhằm mục đích lấy metadata của các bài báo khoa học được lưu trữ tại website arXiv.org, phục vụ cho học tập và nghiên cứu.
Mã nguồn được viết bằng ngôn ngữ PHP, dựa trên arXiv API được cung cấp sẵn.

Input:

- File danh sách các chủ đề (từ khóa) cần crawl có tên là input_subject.txt đặt cùng thư mục với file mã nguồn arxiv.php. Trong đó, mỗi chủ đề được viết trên một dòng.
- Trong file arxiv.php có các tham số cần điều chỉnh như:
  + File chủ đề (từ khóa) cần crawl - Mặc định: input_subject.txt.
  + Dấu slash sử dụng trong đường dẫn thư mục - Mặc định: \.
  + Thời gian giãn cách giữa các request - Mặc định: 5 giây.
  + Thư mục chứa các file crawl được - Mặc định: ..\output.
  + Số lượng tối đa các kết quả trả về (không nên điều chỉnh quá lớn - API cho phép tối đa 30000, được chia thành 2000 kết quả một lần trả về, nếu lớn hon 30000 sẽ nhận được lỗi 404) - Mặc định: 100.

Output: chứa trong thư mục đã chỉ định, với mỗi tập tin là kết quả trả về tương ứng với chủ đề đã đưa ra.


Usage:
Run on terminal:
  1.    php arixiv.php
  2.    php index.php
  3.    view on browser: localhost:3000
