# Zustand Todo App

Một ứng dụng Todo được xây dựng với **Next.js 16** và **Zustand**, tập trung vào việc áp dụng kiến trúc **Clean Architecture** để đảm bảo khả năng mở rộng, dễ bảo trì, Đồng thời triển khai **Unit Test (Vitest)** cùng **E2E Test (Playwright)**.

## Tech Stack:

- **Next.js 16**: Sử dụng App Router.
- **Zustand**: Quản lý state tập trung.

## Project Structure:

- `src/domain`: Chứa logic nghiệp vụ cốt lõi và các định nghĩa dữ liệu (Domain Models, Interfaces).
- `src/store`: Quản lý trạng thái ứng dụng phía client qua các Zustand stores.
- `src/components`: Hệ thống UI component được thiết kế theo nguyên lý Atomic Design.

## 🚀 Hướng dẫn cài đặt (Usage):

1. **Cài đặt dependencies:**

   ```bash
   npm install
   # Quan trọng: Biên dịch lại thư viện native đúng bản Node
   npm rebuild better-sqlite3
   ```

2. **Setup Database (Drizzle + SQLite):**

   ```bash
   cp .env.example .env
   # Ghi chú: Nếu chạy local (không Docker), hãy sửa SQLITE_DB_PATH=./data/sqlite.db trong file .env
   ```

3. **Khởi tạo Database (Drizzle + SQLite):**

   ```bash
   # Chạy migration để tạo các bảng dữ liệu
   npm run db:migrate

   # Hoặc `npm run db:push` để đồng bộ nhanh Schema
   ```

4. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

Dữ liệu sẽ được lưu trữ trực tiếp trong file `./data/sqlite.db` tại thư mục gốc.
