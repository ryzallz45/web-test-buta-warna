# Tes Buta Warna Ishihara

Aplikasi web tes buta warna berbasis plat Ishihara. Seluruh plat dibuat secara **procedural di atas kanvas HTML5** — tanpa gambar eksternal.

## Fitur

- **24 plat Ishihara** terdiri dari 5 tipe: Kontrol, Merah-Hijau, Protan, Deutan, dan Tritan
- **10 plat acak** per sesi tes dengan minimal 1 dari setiap tipe
- **Timer 10 detik** per plat dengan auto-skip
- **Mode pencahayaan**: Terang / Redup — menyesuaikan kontras plat
- **Diagnosis otomatis** berdasarkan pola jawaban (Normal, Protanopia, Deuteranopia, Tritanopia, Monokromasi)
- **Riwayat tes** tersimpan di localStorage (maks. 20 entri)
- **Ekspor PDF** via dialog print browser

## Cara Penggunaan

1. Buka `index.html` di browser (tidak perlu server)
2. Pilih mode pencahayaan
3. Klik **Mulai Tes**
4. Tebak angka dalam plat, klik **Jawab** atau **Tidak Ada**
5. Lihat hasil dan diagnosis

## Tipe Plat

| Tipe | Jumlah | Deskripsi |
|------|--------|-----------|
| Kontrol | 4 | Mudah, terlihat oleh semua orang — memvalidasi kondisi tes |
| Merah-Hijau | 9 | Mendeteksi buta warna merah-hijau umum |
| Protan | 4 | Spesifik protanopia (luminansi serupa, saturasi rendah) |
| Deutan | 4 | Spesifik deuteranopia (saturasi medium, luminansi mirip) |
| Tritan | 3 | Biru-kuning (bg biru/ungu, num kuning/hijau) |

## Algoritma Diagnosis

- **>= 2 kontrol salah** → Hasil Tidak Meyakinkan
- **<= 1 total salah** → Penglihatan Warna Normal
- **>= 4 merah-hijau + >= 2 tritan salah** → Monokromasi
- **>= 4 merah-hijau salah** → Protanopia / Deuteranopia / Campuran
- **>= 2 tritan salah** → Tritanopia
- **Lainnya** → Normal (Ringan)

## Teknis

- **Zero dependencies** — HTML + CSS + JavaScript vanilla
- Plat digambar dengan **Canvas API** menggunakan lingkaran-lingkaran kecil (dots)
- Setiap dot dicek terhadap **mask angka** yang di-render di offscreen canvas
- Warna menggunakan **HSL** dengan range hue, saturation, dan lightness yang berbeda antara background dan angka
- **High-DPI / Retina support** dengan `devicePixelRatio` scaling

## Keterbatasan

Tes ini bersifat indikatif dan bukan pengganti diagnosis medis profesional. Konsultasikan dengan dokter mata untuk hasil yang akurat.

## Lisensi

MIT
