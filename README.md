# SONG ROULETTE

Mở web → bấm **BỐC BÀI** → hát. Một web app tối giản, chọn ngẫu nhiên bài hát (trending, classic, nostalgia) để hát karaoke.

## Tính năng
- Trang chủ "luxury minimalism", bốc bài ngay tại chỗ với animation roulette (tôn trọng `prefers-reduced-motion`).
- Random không lặp: loại `MAX_RECENT_SONGS` (mặc định 10) bài gần nhất, đổi trong `lib/randomSong.ts`.
- Lọc theo Category (All / Trending / Classics / Nostalgia) và Language (All / Vietnamese / English).
- `/songs` thư viện + tìm kiếm (không dấu cũng tìm được), `/trending`, `/classics` (lọc theo thập niên), `/history` (localStorage, có CLEAR HISTORY).
- Trending thật từ YouTube Data API nếu có key; không có key hoặc API lỗi thì tự dùng danh sách local, và trang `/trending` nói rõ điều đó (không giả "realtime").
- Dark mode tự động theo hệ thống.

## Tech stack
Next.js 14 (App Router) · TypeScript strict · Tailwind CSS 3 · Framer Motion · Lucide Icons.

## Cài đặt & chạy local
```bash
npm install
cp .env.example .env.local   # tuỳ chọn, điền YOUTUBE_API_KEY nếu muốn trending thật
npm run dev                  # http://localhost:3000
```
Build production:
```bash
npm run build
npm run start
```

## Biến môi trường
| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `YOUTUBE_API_KEY` | Không | Key YouTube Data API v3. Chỉ dùng phía server. |
| `YOUTUBE_REGION_CODE` | Không | Vùng lấy "most popular" (mặc định `VN`). |
| `NEXT_PUBLIC_SITE_URL` | Không | URL site, dùng cho metadata Open Graph. |

## Thiết lập YouTube API
1. Vào Google Cloud Console → tạo project.
2. APIs & Services → bật **YouTube Data API v3**.
3. Credentials → Create credentials → API key (nên giới hạn key chỉ cho YouTube Data API).
4. Dán vào `.env.local`: `YOUTUBE_API_KEY=...`

Server gọi `videos?chart=mostPopular&videoCategoryId=10` (Music), cache 1 giờ (`revalidate = 3600`). Mỗi lần revalidate tốn khoảng 1 quota unit. Lưu ý: tiêu đề video được tách "Artist - Song" theo heuristic nên đôi khi không hoàn hảo.

Frontend không bao giờ gọi YouTube trực tiếp. Các trang server gọi `lib/youtube.ts`, và route `/api/trending` trả cùng dữ liệu cho client/bên ngoài.

## Chỉnh sửa kho bài
Sửa `data/songs.ts`: mỗi dòng là `[title, artist, year | null, category, language]`. Bài local không có `youtubeId` nên nút YouTube mở kết quả tìm kiếm "tên bài + ca sĩ + karaoke".

## Deploy (GitHub + Vercel)
1. Push lên GitHub:
   ```bash
   git init && git add . && git commit -m "Song Roulette"
   git branch -M main
   git remote add origin <repo-url> && git push -u origin main
   ```
2. Vercel → Add New Project → import repo.
3. Environment Variables: thêm `YOUTUBE_API_KEY` (và các biến tuỳ chọn).
4. Deploy.

> GitHub Pages thuần túy chỉ host file tĩnh, không chạy được server-side (đọc key, cache `/api/trending`), nên Vercel phù hợp hơn.

## GitHub workflow gợi ý
Nhánh `main` luôn deploy được; làm tính năng trên nhánh riêng → Pull Request → Vercel tạo preview deployment → merge. Chạy `npm run lint && npm run build` trước khi merge.

## Bảo mật
`.env.local` đã nằm trong `.gitignore`. Không commit key.

## Ngoài phạm vi MVP
Login, playlist, voting, multiplayer, sound effect, v.v. Kiến trúc tách `lib/randomSong.ts`, `lib/storage.ts`, `lib/youtube.ts` để thêm sau.
