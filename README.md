Donate: https://hatd.github.io/

# Tool: 

Giải captcha aws turnstile

# Môi trường: 
    - nodejs 20.17.0
        - cài đặt nvm: https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows
        - cài đặt nodejs(mở cmd):
            - nvm install 20.17.0
            - nvm use 20.17.0

# Chuẩn bị:
    - tạo file .env: copy nội dung từ file `.example.env`
    - cài đặt: lần đầu lấy tool về hoặc có thử viện mới, cần chạy: npm install

# Chạy:
    - node src/index.js

# 14-1
    - update

# 14-2
(có thư viện mới)
    - chạy lệnh: node index.js

# 19-4
(có env mới)
    - thêm logic, để chạy ở nhiều port, mỗi port cho 1 tool riêng
        - set SERVER_LIST theo mẫu
        - mở nhiều cmd, mỗi cmd chọn 1 port khác nhau
        - ở các tool thì cũng sửa port ở env tương ứng