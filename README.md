# Zustand Todo App

Một ứng dụng Todo được xây dựng với **Next.js 16** và **Zustand**, tập trung vào việc áp dụng kiến trúc **Clean Architecture** để đảm bảo khả năng mở rộng, dễ bảo trì, Đồng thời triển khai **Unit Test (Vitest)** cùng **E2E Test (Playwright)**.

## Tech Stack:

- **Next.js 16**: Sử dụng App Router.
- **Zustand**: Quản lý state tập trung.

## Project Structure:

- `src/domain`: Chứa logic nghiệp vụ cốt lõi và các định nghĩa dữ liệu (Domain Models, Interfaces).
- `src/store`: Quản lý trạng thái ứng dụng phía client qua các Zustand stores.
- `src/components`: Hệ thống UI component được thiết kế theo nguyên lý Atomic Design.

## Usage:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup Database (Drizzle + SQLite):**

   ```bash
   npm run db:generate
   npm run db:migrate
   # Hoặc dùng: npm run db:push
   ```

3. **Run Development:**
   ```bash
   npm run dev
   ```

Dữ liệu sẽ được lưu trữ trực tiếp trong file `sqlite.db` tại thư mục gốc.
