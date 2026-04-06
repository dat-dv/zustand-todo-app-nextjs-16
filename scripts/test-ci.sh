#!/bin/bash

# scripts/test-ci.sh
# Script giả lập GitHub CI với đường dẫn ./data/sqlite.db

echo "🚀 Bắt đầu giả lập GitHub CI..."

# 0. Thiết lập môi trường
export SQLITE_DB_PATH="./data/sqlite.db"
export NODE_ENV="test"
mkdir -p data # Đảm bảo thư mục data tồn tại

# 1. Cài đặt thư viện (npm ci)
echo "📦 [1/4] Đang cài đặt thư viện (npm ci)..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Lỗi: Cài đặt thư viện thất bại!"
    exit 1
fi

# 2. Khởi tạo Database (Push)
echo "🗄️ [2/4] Đang khởi tạo Database (db:push)..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "❌ Lỗi: Khởi tạo Database thất bại!"
    exit 1
fi

# 3. Chạy Test
echo "🧪 [3/4] Đang chạy bộ test (npm test)..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Lỗi: Bộ test thất bại!"
    exit 1
fi

# 4. Build Project
echo "🏗️ [4/4] Đang build dự án (npm run build)..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Lỗi: Build thất bại!"
    exit 1
fi

echo "✅ Chúc mừng! Giả lập CI hoàn tất thành công."
