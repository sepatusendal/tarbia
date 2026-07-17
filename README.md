# UPA Hub 🕌

Pusat administrasi dan dokumentasi kegiatan UPA/Liqo — jadwal, absensi, kas, materi, dan anggota dalam satu tempat.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, Prisma + Supabase (Postgres & Storage), NextAuth (login nomor HP + password).

## Setup

### 1. Buat project Supabase (gratis)

1. Buat akun & project baru di [supabase.com](https://supabase.com).
2. Buka **Project Settings → Database → Connection string → URI**, salin connection string (pakai *direct connection*, port 5432).
3. Buka **Project Settings → API**, salin `Project URL`, `anon public` key, dan `service_role` key.
4. Buka **Storage**, buat bucket baru bernama `materi`, set **Public bucket** = ON (supaya file PDF materi bisa diakses lewat link).

### 2. Isi environment variables

Salin `.env.example` ke `.env` (sudah ada placeholder) lalu isi dengan nilai dari Supabase:

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
NEXTAUTH_SECRET="..."   # generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install, migrate, seed

```bash
npm install
npm run db:migrate   # buat tabel di database
npm run db:seed      # buat akun admin pertama
```

Seed default: nomor HP `081234567890`, password `admin123`. Bisa diubah lewat env `SEED_ADMIN_PHONE` / `SEED_ADMIN_PASSWORD` sebelum `npm run db:seed`.

### 4. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), login pakai akun admin dari seed, lalu tambahkan anggota lain lewat menu **Anggota**.

## Struktur Modul

- **Dashboard** — ringkasan pertemuan berikutnya, petugas, saldo kas, kehadiran terakhir.
- **Jadwal** — CRUD jadwal liqo + penugasan petugas (MC, Pemateri, Notulen, Dokumentasi, Konsumsi). Admin only.
- **Absensi** — catat kehadiran per pertemuan (Admin/Pengurus), anggota melihat riwayat pribadi.
- **Kas** — catat pemasukan/pengeluaran (Admin/Pengurus), semua role bisa lihat saldo & riwayat.
- **Materi** — upload PDF ke Supabase Storage, link video, ringkasan & catatan per pertemuan.
- **Anggota** — kelola data anggota & role (Admin only).

## Hak Akses

| Role | Akses |
|---|---|
| Admin | Semua data: jadwal, petugas, anggota, kas, absensi, materi |
| Pengurus | Input kas, absensi, materi |
| Anggota | Lihat jadwal, materi, kas, dan absensi pribadi |
