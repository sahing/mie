# cPanel PHP & MySQL API Setup Guide

Deploy this `/cpanel-api/` folder to `public_html/api/` on your existing cPanel server (`https://mondalexportimport.com/api/`) without modifying your WordPress installation.

## 1. Create MySQL Database in cPanel
1. Log into **cPanel → MySQL Databases**.
2. Create a database (e.g. `mondal_export_db`) and a database user with **All Privileges**.
3. Open **cPanel → phpMyAdmin**, select the new database, and import:
   - `schema.sql` (creates `categories`, `products`, `enquiries`, `admin_users` tables)
   - `seed.sql` (generated directly inside `/admin` → **cPanel Setup & Sync** → **Download MySQL seed.sql**)

## 2. Configure & Upload `/api/`
1. Edit `config.php`:
   - Enter your `db_name`, `db_user`, and `db_pass`.
   - Replace `hmac_secret` with a random 64-character string.
   - Update `default_admin_email` and `default_admin_password` before your first login.
   - Set `public_api_url` to `https://mondalexportimport.com/api` (or your exact domain).
   - Restrict `cors_allowed_origins` to your frontend domain once deployed (e.g. `['https://app.mondalexportimport.com']`).
2. Upload `.htaccess`, `config.php`, and `index.php` into `public_html/api/` via cPanel File Manager or FTP.
3. Ensure PHP 8.1+ is active in **cPanel → MultiPHP Manager**.
4. Test `https://mondalexportimport.com/api/health` in your browser — it should return JSON `{"ok":true,"engine":"php-mysql",...}`.

## 3. Connect Your Frontend on Another Server
Set the frontend environment variable before building or in `/admin` → **cPanel Setup & Sync**:
```env
VITE_API_BASE_URL="https://mondalexportimport.com/api"
```
Note: Existing `/products/...` images from the starter seed can either be copied to `public/products/` on the frontend host, or replaced directly via the `/admin` image uploader (which stores new uploads inside `public_html/api/uploads/`).
