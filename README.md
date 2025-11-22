## Satria Data Penyisihan 2025

[Video Sentiment Classification]
Metode : Ekstrak Audio (Whisper) => Data Preprocessing => Sentence Transformers => Logistic Regression => Hyperparameter Tuning (Optuna)
Untuk notebook modelling dan analisis data bisa diliat di link berikut



## Satria Data Semifinal 2025

Repositori ini berisi dua komponen utama:

- `backend/` – layanan FastAPI untuk scraping Instagram/Google Drive, analisis video & audio, serta utilitas dataset. Panduan lengkap tersedia di `backend/README.md`.
- `frontend/` – dashboard Next.js untuk mengeksplorasi dataset dan menampilkan hasil analitik. Lihat `frontend/README.md` untuk langkah setup.

### Akses Cepat

- Deployment publik dashboard dapat diakses di: https://ce-dashboard-satdat25.xflow.icu/
- Untuk menjalankan lokal:
  1. Ikuti petunjuk pada `backend/README.md` untuk menyalakan API.
  2. Ikuti panduan `frontend/README.md` untuk menyalakan dashboard dan hubungkan ke API lokal/remote.

### Struktur Direktori

```
.
├── backend/   # FastAPI service, analitik video/audio, skrip dataset
└── frontend/  # Next.js dashboard & proxy API ke backend
```

Kontribusi dan dokumentasi lanjutan tersedia di masing-masing folder.
