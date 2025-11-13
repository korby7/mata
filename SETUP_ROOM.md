# 🔗 Setup Room Sharing Feature

Fitur Room Sharing memungkinkan multiple HP mengakses score yang sama secara real-time.

## 📋 Cara Setup di Cloudflare Pages

### 1. Buat KV Namespace

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih akun Anda
3. Klik **Workers & Pages** di sidebar kiri
4. Klik tab **KV**
5. Klik **Create namespace**
6. Nama namespace: `ROOM_KV`
7. Klik **Add**
8. Copy **Namespace ID** yang muncul

### 2. Bind KV ke Cloudflare Pages

#### Via Dashboard (Cara Mudah):
1. Buka **Workers & Pages**
2. Pilih project ScoreKeeper Anda
3. Klik tab **Settings**
4. Scroll ke **Functions**
5. Klik **KV namespace bindings** → **Add binding**
6. Variable name: `ROOM_KV`
7. KV namespace: Pilih `ROOM_KV` yang sudah dibuat
8. Klik **Save**

#### Via wrangler.toml (Optional):
1. Edit file `wrangler.toml`
2. Ganti `YOUR_KV_NAMESPACE_ID` dengan ID yang sudah dicopy
3. Deploy ulang

### 3. Deploy

Upload semua file ke Cloudflare Pages:
```
index.html
manifest.json
service-worker.js
icon.svg
icon-192x192.png
icon-512x512.png
icon-180x180.png
functions/api/[[path]].js  ← File API baru
wrangler.toml (optional)
```

### 4. Test

1. Buka website ScoreKeeper di HP pertama
2. Klik tombol **🔗 Room**
3. Klik **➕ Buat Room Baru**
4. Akan muncul kode 4 huruf (contoh: `ABCD`)
5. Di HP kedua, klik **🔗 Room** → **🔑 Join Room**
6. Masukkan kode `ABCD`
7. Sekarang kedua HP akan sync score real-time!

## ✨ Fitur Room

### Create Room
- Buat room baru dengan kode 4 huruf acak
- Share kode atau link ke pemain lain
- Score auto-sync setiap ada perubahan

### Join Room
- Masukkan kode 4 huruf untuk join
- Data score akan di-load dari room
- Auto-sync setiap 3 detik

### Share Room
- Copy link langsung atau share via native share
- Format link: `https://your-site.pages.dev?room=ABCD`
- Orang lain tinggal buka link, langsung bisa join

### Leave Room
- Keluar dari room tanpa hapus data lokal
- Stop auto-sync
- Data lokal tetap tersimpan

## 🔧 Troubleshooting

**Error: "Gagal membuat room"**
- Pastikan KV namespace sudah dibuat dan di-bind
- Cek Console di browser (F12) untuk error detail
- Pastikan file `functions/api/[[path]].js` sudah di-upload

**Room tidak sync**
- Cek koneksi internet
- Pastikan semua HP pakai kode room yang sama
- Tunggu 3 detik (interval sync)

**"Room not found"**
- Room expired setelah 24 jam
- Kode salah (harus 4 huruf)
- Buat room baru

## 💡 Catatan

- Room akan **otomatis hilang setelah 24 jam**
- Data lokal di masing-masing HP **tetap tersimpan** walau room hilang
- Maksimal request: **100,000 reads/day dan 1,000 writes/day** (Cloudflare free tier)
- Sync interval: **3 detik** (bisa diubah di code)

## 📊 Limits Cloudflare KV Free Tier

- ✅ 100,000 read requests/day
- ✅ 1,000 write requests/day
- ✅ 1 GB storage
- ✅ Unlimited namespaces

Untuk ScoreKeeper dengan 4 player:
- **1 room = ~1 KB data**
- **1,000 rooms bisa dibuat per hari**
- **Cukup untuk ratusan game per hari**

## 🚀 Next Steps

Jika sudah setup, coba fitur:
1. ✅ Create room
2. ✅ Share link/kode
3. ✅ Join dari HP lain
4. ✅ Edit score di 1 HP → cek sync di HP lain
5. ✅ Leave room

Selamat bermain! 🎮
