# Absensi Guru Sekolah
Absensi Guru berbasis jadwal pelajaran

# Setup Guide untuk Shared Hosting

## 1. Persiapan Files

### Build Project
Jalankan command berikut untuk build production:
```bash
npm run build
```

### Upload Files
Upload semua files dari folder `dist/` ke folder public_html di hosting Anda.

## 2. Setup Database

1. Buat database MySQL/MariaDB di cPanel
2. Import file `database/mariadb_schema.sql` melalui phpMyAdmin
3. Update konfigurasi database di `api/config.php`:
   ```php
   define('DB_HOST', 'localhost'); // Host database Anda
   define('DB_NAME', 'nama_database'); // Nama database yang dibuat
   define('DB_USER', 'username_db'); // Username database
   define('DB_PASS', 'password_db'); // Password database
   ```

## 3. Upload API Files

1. Buat folder `api` di root hosting (sejajar dengan public_html)
2. Upload semua files dari folder `api/` ke folder tersebut
3. Pastikan permissions folder api adalah 755

## 4. Konfigurasi .htaccess

File `.htaccess` sudah disertakan untuk:
- URL rewriting untuk React Router
- Security headers
- Compression
- Caching static assets

## 5. Update Frontend Configuration

Buat file `config.js` di root build untuk konfigurasi API:
```javascript
window.API_BASE_URL = 'https://yourdomain.com/api';
```

## 6. Testing

1. Akses website Anda
2. Test registrasi user baru
3. Test login/logout
4. Test fitur attendance

## 7. Troubleshooting

### Jika API tidak bisa diakses:
1. Pastikan mod_rewrite enabled
2. Check file permissions (755 untuk folder, 644 untuk files)
3. Check error logs di cPanel

### Jika database connection error:
1. Verify database credentials di config.php
2. Pastikan database sudah diimport
3. Check database user permissions

## 8. Security Notes

1. Ubah session configuration di php.ini jika perlu
2. Enable HTTPS untuk security
3. Backup database secara regular
4. Monitor error logs

## Files yang perlu diupload:

### Ke public_html/:
- Semua files dari folder `dist/` hasil build
- File `.htaccess`

### Ke folder api/:
- config.php
- auth.php  
- attendance.php

### Ke database:
- Import `database/mariadb_schema.sql`

Setelah setup selesai, website akan berfungsi penuh di shared hosting dengan database MariaDB/MySQL.
