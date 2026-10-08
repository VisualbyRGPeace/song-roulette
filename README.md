# SONG ROULETTE

Mở web → bấm **BỐC BÀI** → hát. Một web app tối giản, chọn ngẫu nhiên bài hát (trending, classic, nostalgia) để hát karaoke.

## Tính năng
- Trang chủ "luxury minimalism", bốc bài ngay tại chỗ với animation roulette (tôn trọng `prefers-reduced-motion`).
- Random không lặp: loại `MAX_RECENT_SONGS` (mặc định 10) bài gần nhất, đổi trong `lib/randomSong.ts`.
- Lọc theo Category (All / Trending / Classics / Nostalgia) và Language (All / Vietnamese / English).
- `/songs` thư viện + tìm kiếm (không dấu cũng tìm được), `/trending`, `/classics` (lọc theo thập niên), `/history` (localStorage, có CLEAR HISTORY).
- Trending từ YouTube Data API (lúc build, làm mới mỗi giờ) nếu có key; không có key hoặc API lỗi thì tự dùng danh sách local, và trang `/trending` nói rõ điều đó (không giả "realtime").
- Dark mode tự động theo hệ thống.

## Tech stack
Next.js 14 (App Router, static export) · TypeScript strict · Tailwind CSS 3 · Framer Motion · Lucide Icons.

## Cài đặt & chạy local
```bash
npm install
cp .env.example .env.local   # tuỳ chọn, điền YOUTUBE_API_KEY nếu muốn trending thật
npm run dev                  # http://localhost:3000
```
Build production:
```bash
npm run build   # export tĩnh ra thư mục out/
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

Lúc build, code gọi `videos?chart=mostPopular&videoCategoryId=10` (Music). Mỗi lần build tốn khoảng 1 quota unit. Lưu ý: tiêu đề video được tách "Artist - Song" theo heuristic nên đôi khi không hoàn hảo.

Trình duyệt không bao giờ gọi YouTube trực tiếp: dữ liệu được nhúng sẵn vào trang lúc build.

## Chỉnh sửa kho bài
Sửa `data/songs.ts`: mỗi dòng là `[title, artist, year | null, category, language]`. Bài local không có `youtubeId` nên nút YouTube mở kết quả tìm kiếm "tên bài + ca sĩ + karaoke".

## Deploy lên GitHub Pages
Site được export tĩnh (`output: "export"`) và deploy bằng GitHub Actions (`.github/workflows/deploy.yml`).

1. Push code lên nhánh `main`.
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. (Tuỳ chọn) **Settings → Secrets and variables → Actions → New repository secret**: tên `YOUTUBE_API_KEY`.
4. Vào tab **Actions**, workflow chạy xong là site có tại `https://<username>.github.io/<repo>/`.

Vì GitHub Pages không có server, YouTube API được gọi **lúc build** trong GitHub Actions (key nằm trong Secret, không bao giờ vào code hay trình duyệt). Workflow tự build lại mỗi giờ để làm mới trending; trang `/trending` ghi rõ thời điểm cập nhật. Không có secret thì site dùng danh sách bài local.

Chạy thử bản export ở máy: `npm run build` (kết quả trong thư mục `out/`).

## Bảo mật
`.env.local` đã nằm trong `.gitignore`. Không commit key.

## Ngoài phạm vi MVP
Login, playlist, voting, multiplayer, sound effect, v.v. Kiến trúc tách `lib/randomSong.ts`, `lib/storage.ts`, `lib/youtube.ts` để thêm sau.
