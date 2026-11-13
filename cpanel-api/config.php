<?php
/**
 * Mondal Export Import — cPanel PHP & MySQL API Configuration
 * Upload this folder to public_html/api/ on your cPanel server.
 */

return [
    // MySQL Database Credentials (create DB + user in cPanel -> MySQL Databases)
    'db_host' => 'localhost',
    'db_name' => 'mondal_export_db',
    'db_user' => 'mondal_db_user',
    'db_pass' => 'REPLACE_WITH_STRONG_MYSQL_PASSWORD',
    'db_charset' => 'utf8mb4',

    // Long random secret for signing admin Bearer tokens (change this!)
    'hmac_secret' => 'REPLACE_WITH_64_CHAR_RANDOM_SECRET_KEY',

    // Default initial admin account seeded on first login check if admin_users table is empty
    'default_admin_email' => 'admin@mondalexportimport.com',
    'default_admin_password' => 'MondalExport@2026',

    // Public URL of this /api/ folder (used for returning full uploaded image URLs)
    'public_api_url' => 'https://mondalexportimport.com/api',

    // Allowed frontend origins for CORS (comma-separated or '*' during initial testing)
    'cors_allowed_origins' => [
        '*',
    ],

    // Optional buyer enquiry notification email
    'notify_email' => 'info@mondalexportimport.com',
];
