This repository houses a [Next.js](https://nextjs.org) dashboard for exploring social-media analytics data.

## Ringkasan Aplikasi

- **Tujuan**: memberikan ringkasan performa konten video TikTok/Instagram melalui dua “sheet” utama: analitik detail (Sheet 1) dan agregasi klasifikasi & insight (Sheet 2).
- **Fitur utama**:
  - Sheet 1 (“Dashboard Insight Strategis”) menampilkan detail video yang dipilih, metrik performa, caption/hashtag, ringkasan, dan analisis audio/video.
  - Sheet 2 (“Framework Video High-Engagement”) menyajikan tabel konten dan visualisasi yang dapat dipakai untuk menelusuri konten berkinerja tinggi; klik baris tabel akan membuka Sheet 1 dengan video relevan.
  - Navigasi antar sheet, sort/filter sederhana, serta integrasi video player untuk melihat konten terkait.
- **Stack**: Next.js (App Router) + TypeScript, Tailwind CSS, React Context untuk state dataset, data lokal yang di-load dari dataset Kaggle.

## Arsitektur Data

```mermaid
flowchart TD
  Kaggle[Dataset Kaggle] -->|ekstrak ke /dataset| Loader[getDatasetEntries()]
  Loader --> Provider[DatasetProvider Context]
  Provider --> Sheet1[Sheet 1 Components]
  Provider --> Sheet2[Sheet 2 Components]
  Sheet2 -->|klik baris| Router -->|/?id=123| Sheet1
```

- Dataset zip dari Kaggle diletakkan di folder `dataset`.
- Utilitas `getDatasetEntries()` membaca struktur folder tersebut dan menyusun daftar entri `DatasetEntry`.
- `DatasetProvider` menyediakan state global (daftar entri + ID terpilih) untuk seluruh komponen Sheet 1.
- Sheet 2 memakai data hasil agregasi untuk tabel dan grafik; klik baris mengarahkan ke Sheet 1 melalui query `/?id=<ID>`, sehingga `DatasetProvider` memilih video yang relevan.

## Prasyarat

- Node.js versi 18 LTS atau lebih baru.
- npm (atau pnpm/bun/yarn bila ingin mengganti package manager).
- Opsional: [Kaggle CLI](https://github.com/Kaggle/kaggle-api) jika Anda ingin mengunduh dataset secara terotomatisasi (`kaggle datasets download`).
- Docker & Docker Compose (opsional) bila ingin menjalankan via kontainer.

## Konfigurasi

- Port default Next.js: `3000`. Ubah dengan environment variable `PORT` saat menjalankan (`PORT=4000 npm run dev`).
- Sesuaikan environment variable Next.js lainnya (mis. `NEXT_TELEMETRY_DISABLED=1`) sesuai kebutuhan.
- Aplikasi tidak memerlukan backend tambahan; seluruh data dilayani secara lokal melalui file statis pada folder `dataset`.

## Dataset Setup

1. Unduh dataset **Semifinal** dari Kaggle: https://www.kaggle.com/datasets/eldintarofarrandi/semifinal  
   (Gunakan tombol *Download* atau `kaggle datasets download` jika Anda memakai Kaggle CLI.)
2. Ekstrak arsip yang diunduh.
3. Salin folder `dataset` hasil ekstraksi ke akar proyek ini sehingga strukturnya menjadi:
   ```
   <project-root>/
     dataset/
       0001/
         ...
   ```
4. Pastikan setiap sub-folder dataset berisi berkas JSON dan media seperti yang disediakan Kaggle.

## Menjalankan Secara Lokal

Install dependensi kemudian jalankan server Next.js dalam mode pengembangan:

```bash
npm install
npm run dev
```

Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000).

## Menjalankan dengan Docker Compose

Jika Anda ingin menjalankan melalui kontainer:

```bash
docker-compose up -d --build
```

Perintah di atas akan membuat image dan menyalakan layanan dalam mode background. Gunakan `docker-compose down` untuk mematikannya.
