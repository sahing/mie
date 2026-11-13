<?php
/**
 * Mondal Export Import — cPanel PHP 8 + MySQL REST API
 * Place inside public_html/api/ on cPanel.
 */

declare(strict_types=1);

$config = require __DIR__ . '/config.php';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
$allowed = $config['cors_allowed_origins'] ?? ['*'];
if (in_array('*', $allowed, true) || in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . ($origin !== '' ? $origin : '*'));
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonOut(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function getDb(array $config): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $config['db_host'],
        $config['db_name'],
        $config['db_charset'] ?? 'utf8mb4'
    );
    try {
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        return $pdo;
    } catch (Throwable $e) {
        jsonOut(500, ['ok' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
    }
}

function readJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

function signToken(string $email, string $secret): array {
    $expiresAt = (time() + 86400) * 1000;
    $payload = base64UrlEncode(json_encode([
        'email' => $email,
        'role' => 'admin',
        'exp' => $expiresAt,
    ]));
    $sig = base64UrlEncode(hash_hmac('sha256', $payload, $secret, true));
    return ['token' => $payload . '.' . $sig, 'expiresAt' => $expiresAt];
}

function verifyBearer(array $config): array {
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonOut(401, ['ok' => false, 'error' => 'Unauthorized. Missing Bearer token.']);
    }
    $parts = explode('.', trim($m[1]));
    if (count($parts) !== 2) {
        jsonOut(401, ['ok' => false, 'error' => 'Invalid token format.']);
    }
    [$payload, $sig] = $parts;
    $expected = base64UrlEncode(hash_hmac('sha256', $payload, $config['hmac_secret'], true));
    if (!hash_equals($expected, $sig)) {
        jsonOut(401, ['ok' => false, 'error' => 'Invalid token signature.']);
    }
    $data = json_decode(base64UrlDecode($payload), true);
    if (!is_array($data) || ($data['exp'] ?? 0) < (time() * 1000)) {
        jsonOut(401, ['ok' => false, 'error' => 'Token expired. Please sign in again.']);
    }
    return $data;
}

function mapProductRow(array $row): array {
    return [
        'slug' => $row['slug'],
        'name' => $row['name'],
        'category' => $row['category_id'],
        'image' => $row['image_url'],
        'gallery' => json_decode($row['gallery_json'] ?? '[]', true) ?: [],
        'shortDescription' => $row['short_description'],
        'description' => $row['description'],
        'specs' => [
            'origin' => $row['origin'],
            'packaging' => $row['packaging'],
            'moq' => $row['moq'],
            'privateLabel' => (bool)$row['private_label'],
            'incoterms' => $row['incoterms'],
        ],
        'certifications' => json_decode($row['certifications_json'] ?? '[]', true) ?: [],
        'needsUniqueImage' => (bool)$row['needs_unique_image'],
        'featured' => (bool)$row['featured'],
        'seo' => [
            'title' => $row['seo_title'],
            'description' => $row['seo_description'],
        ],
    ];
}

// Parse request path relative to /api/
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$route = $scriptDir !== '' && str_starts_with($requestUri, $scriptDir)
    ? substr($requestUri, strlen($scriptDir))
    : $requestUri;
$route = '/' . ltrim($route, '/');
$method = $_SERVER['REQUEST_METHOD'];

$pdo = getDb($config);

// 1. Health Check
if ($method === 'GET' && $route === '/health') {
    $pCount = (int)$pdo->query('SELECT COUNT(*) FROM products')->fetchColumn();
    $cCount = (int)$pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn();
    jsonOut(200, [
        'ok' => true,
        'engine' => 'php-mysql',
        'productCount' => $pCount,
        'categoryCount' => $cCount,
        'timestamp' => gmdate('c'),
    ]);
}

// 2. Auth Login
if ($method === 'POST' && $route === '/auth/login') {
    $body = readJsonBody();
    $email = strtolower(trim((string)($body['email'] ?? '')));
    $password = (string)($body['password'] ?? '');

    // Seed default admin on first run if admin_users is empty
    $count = (int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)');
        $stmt->execute([
            strtolower($config['default_admin_email']),
            password_hash($config['default_admin_password'], PASSWORD_BCRYPT),
            'admin',
        ]);
    }

    $stmt = $pdo->prepare('SELECT email, password_hash, role FROM admin_users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonOut(401, ['ok' => false, 'error' => 'Invalid admin email or password.']);
    }

    $signed = signToken($user['email'], $config['hmac_secret']);
    jsonOut(200, [
        'ok' => true,
        'token' => $signed['token'],
        'expiresAt' => $signed['expiresAt'],
        'user' => ['email' => $user['email'], 'role' => $user['role']],
    ]);
}

if ($method === 'GET' && $route === '/auth/me') {
    $user = verifyBearer($config);
    jsonOut(200, ['ok' => true, 'user' => $user]);
}

// 3. Categories
if ($method === 'GET' && $route === '/categories') {
    $sql = 'SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS count FROM categories c ORDER BY c.sort_order ASC, c.name ASC';
    $rows = $pdo->query($sql)->fetchAll();
    $out = array_map(fn($r) => [
        'id' => $r['id'],
        'name' => $r['name'],
        'shortName' => $r['short_name'],
        'description' => $r['description'],
        'image' => $r['cover_image'],
        'sortOrder' => (int)$r['sort_order'],
        'count' => (int)$r['count'],
    ], $rows);
    jsonOut(200, $out);
}

if ($method === 'POST' && $route === '/categories') {
    verifyBearer($config);
    $b = readJsonBody();
    $id = trim((string)($b['id'] ?? ''));
    if (!preg_match('/^[a-z0-9-]+$/', $id)) {
        jsonOut(400, ['ok' => false, 'error' => 'Invalid category ID.']);
    }
    $stmt = $pdo->prepare('INSERT INTO categories (id, name, short_name, description, cover_image, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    try {
        $stmt->execute([
            $id,
            trim((string)($b['name'] ?? '')),
            trim((string)($b['shortName'] ?? '')),
            trim((string)($b['description'] ?? '')),
            trim((string)($b['image'] ?? '')),
            (int)($b['sortOrder'] ?? 10),
        ]);
    } catch (PDOException $e) {
        jsonOut(409, ['ok' => false, 'error' => 'Category already exists or invalid data.']);
    }
    jsonOut(201, ['ok' => true, 'category' => $b]);
}

if ($method === 'PUT' && preg_match('#^/categories/([a-z0-9-]+)$#', $route, $m)) {
    verifyBearer($config);
    $id = $m[1];
    $b = readJsonBody();
    $stmt = $pdo->prepare('UPDATE categories SET name=?, short_name=?, description=?, cover_image=?, sort_order=? WHERE id=?');
    $stmt->execute([
        trim((string)($b['name'] ?? '')),
        trim((string)($b['shortName'] ?? '')),
        trim((string)($b['description'] ?? '')),
        trim((string)($b['image'] ?? '')),
        (int)($b['sortOrder'] ?? 10),
        $id,
    ]);
    jsonOut(200, ['ok' => true, 'category' => array_merge($b, ['id' => $id])]);
}

if ($method === 'DELETE' && preg_match('#^/categories/([a-z0-9-]+)$#', $route, $m)) {
    verifyBearer($config);
    $id = $m[1];
    $check = $pdo->prepare('SELECT COUNT(*) FROM products WHERE category_id = ?');
    $check->execute([$id]);
    $used = (int)$check->fetchColumn();
    if ($used > 0) {
        jsonOut(409, ['ok' => false, 'error' => "Cannot delete category while $used products belong to it."]);
    }
    $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
    $stmt->execute([$id]);
    jsonOut(200, ['ok' => true]);
}

// 4. Products
if ($method === 'GET' && $route === '/products') {
    $cat = trim((string)($_GET['category'] ?? ''));
    $q = trim((string)($_GET['q'] ?? ''));
    $sql = 'SELECT * FROM products WHERE 1=1';
    $params = [];
    if ($cat !== '' && $cat !== 'all') {
        $sql .= ' AND category_id = ?';
        $params[] = $cat;
    }
    if ($q !== '') {
        $sql .= ' AND (name LIKE ? OR description LIKE ?)';
        $params[] = '%' . $q . '%';
        $params[] = '%' . $q . '%';
    }
    $sql .= ' ORDER BY created_at ASC, name ASC';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    jsonOut(200, array_map('mapProductRow', $rows));
}

if ($method === 'GET' && preg_match('#^/products/([a-z0-9-]+)$#', $route, $m)) {
    $stmt = $pdo->prepare('SELECT * FROM products WHERE slug = ? LIMIT 1');
    $stmt->execute([$m[1]]);
    $row = $stmt->fetch();
    if (!$row) jsonOut(404, ['ok' => false, 'error' => 'Product not found.']);
    jsonOut(200, mapProductRow($row));
}

if ($method === 'POST' && $route === '/products') {
    verifyBearer($config);
    $b = readJsonBody();
    $slug = trim((string)($b['slug'] ?? ''));
    if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
        jsonOut(400, ['ok' => false, 'error' => 'Invalid product slug.']);
    }
    $desc = trim((string)($b['description'] ?? ''));
    $shortDesc = trim((string)($b['shortDescription'] ?? '')) ?: substr($desc, 0, 140);
    $specs = $b['specs'] ?? [];
    $seo = $b['seo'] ?? [];

    $stmt = $pdo->prepare(
        'INSERT INTO products (slug, name, category_id, image_url, gallery_json, short_description, description, origin, packaging, moq, private_label, incoterms, certifications_json, needs_unique_image, featured, seo_title, seo_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    try {
        $stmt->execute([
            $slug,
            trim((string)($b['name'] ?? '')),
            trim((string)($b['category'] ?? 'agriculture')),
            trim((string)($b['image'] ?? '')),
            json_encode($b['gallery'] ?? []),
            $shortDesc,
            $desc,
            trim((string)($specs['origin'] ?? 'India')),
            trim((string)($specs['packaging'] ?? 'TBC')),
            trim((string)($specs['moq'] ?? 'TBC')),
            !empty($specs['privateLabel']) ? 1 : 0,
            trim((string)($specs['incoterms'] ?? 'FOB / CIF (TBC)')),
            json_encode($b['certifications'] ?? ['ISO 9001:2015', 'APEDA']),
            !empty($b['needsUniqueImage']) ? 1 : 0,
            !empty($b['featured']) ? 1 : 0,
            trim((string)($seo['title'] ?? '')),
            trim((string)($seo['description'] ?? '')),
        ]);
    } catch (PDOException $e) {
        jsonOut(409, ['ok' => false, 'error' => 'Could not create product: ' . $e->getMessage()]);
    }
    $fetch = $pdo->prepare('SELECT * FROM products WHERE slug = ?');
    $fetch->execute([$slug]);
    jsonOut(201, ['ok' => true, 'product' => mapProductRow($fetch->fetch())]);
}

if ($method === 'PUT' && preg_match('#^/products/([a-z0-9-]+)$#', $route, $m)) {
    verifyBearer($config);
    $targetSlug = $m[1];
    $b = readJsonBody();
    $newSlug = trim((string)($b['slug'] ?? $targetSlug));
    $desc = trim((string)($b['description'] ?? ''));
    $shortDesc = trim((string)($b['shortDescription'] ?? '')) ?: substr($desc, 0, 140);
    $specs = $b['specs'] ?? [];
    $seo = $b['seo'] ?? [];

    $stmt = $pdo->prepare(
        'UPDATE products SET slug=?, name=?, category_id=?, image_url=?, gallery_json=?, short_description=?, description=?, origin=?, packaging=?, moq=?, private_label=?, incoterms=?, certifications_json=?, needs_unique_image=?, featured=?, seo_title=?, seo_description=? WHERE slug=?'
    );
    $stmt->execute([
        $newSlug,
        trim((string)($b['name'] ?? '')),
        trim((string)($b['category'] ?? 'agriculture')),
        trim((string)($b['image'] ?? '')),
        json_encode($b['gallery'] ?? []),
        $shortDesc,
        $desc,
        trim((string)($specs['origin'] ?? 'India')),
        trim((string)($specs['packaging'] ?? 'TBC')),
        trim((string)($specs['moq'] ?? 'TBC')),
        !empty($specs['privateLabel']) ? 1 : 0,
        trim((string)($specs['incoterms'] ?? 'FOB / CIF (TBC)')),
        json_encode($b['certifications'] ?? []),
        !empty($b['needsUniqueImage']) ? 1 : 0,
        !empty($b['featured']) ? 1 : 0,
        trim((string)($seo['title'] ?? '')),
        trim((string)($seo['description'] ?? '')),
        $targetSlug,
    ]);
    $fetch = $pdo->prepare('SELECT * FROM products WHERE slug = ?');
    $fetch->execute([$newSlug]);
    $row = $fetch->fetch();
    if (!$row) jsonOut(404, ['ok' => false, 'error' => 'Product not found.']);
    jsonOut(200, ['ok' => true, 'product' => mapProductRow($row)]);
}

if ($method === 'DELETE' && preg_match('#^/products/([a-z0-9-]+)$#', $route, $m)) {
    verifyBearer($config);
    $stmt = $pdo->prepare('DELETE FROM products WHERE slug = ?');
    $stmt->execute([$m[1]]);
    jsonOut(200, ['ok' => true]);
}

// 5. Image Upload
if ($method === 'POST' && $route === '/upload') {
    verifyBearer($config);
    if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        jsonOut(400, ['ok' => false, 'error' => 'No valid image uploaded.']);
    }
    $file = $_FILES['image'];
    if ($file['size'] > 5 * 1024 * 1024) {
        jsonOut(400, ['ok' => false, 'error' => 'Image exceeds 5 MB limit.']);
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $extMap = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];
    if (!isset($extMap[$mime])) {
        jsonOut(400, ['ok' => false, 'error' => 'Only JPG, PNG, WebP, or GIF allowed.']);
    }
    $uploadsDir = __DIR__ . '/uploads';
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);
    $base = preg_replace('/[^a-z0-9-]+/', '-', strtolower(pathinfo($file['name'], PATHINFO_FILENAME)));
    $filename = ($base ?: 'product') . '-' . time() . '.' . $extMap[$mime];
    $dest = $uploadsDir . '/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        jsonOut(500, ['ok' => false, 'error' => 'Failed to save uploaded image.']);
    }
    $baseUrl = rtrim($config['public_api_url'], '/');
    jsonOut(201, ['ok' => true, 'url' => $baseUrl . '/uploads/' . $filename]);
}

// 6. Enquiries
if ($method === 'POST' && $route === '/enquiry') {
    $b = readJsonBody();
    if (!empty($b['website'])) {
        jsonOut(200, ['ok' => true, 'referenceId' => 'MEI-FILTERED']);
    }
    $name = trim((string)($b['name'] ?? ''));
    $email = trim((string)($b['email'] ?? ''));
    $phone = trim((string)($b['phone'] ?? ''));
    $country = trim((string)($b['country'] ?? ''));
    $message = trim((string)($b['message'] ?? ''));
    if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($phone) < 6 || strlen($message) < 5) {
        jsonOut(400, ['ok' => false, 'error' => 'Please complete all required fields accurately.']);
    }
    $id = bin2hex(random_bytes(16));
    $ref = 'MEI-' . strtoupper(base_convert((string)time(), 10, 36));
    $stmt = $pdo->prepare(
        'INSERT INTO enquiries (id, reference_id, name, company, email, phone, country, products_json, quantity, message, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id,
        $ref,
        $name,
        trim((string)($b['company'] ?? '')),
        $email,
        $phone,
        $country,
        json_encode($b['products'] ?? []),
        trim((string)($b['quantity'] ?? '')),
        $message,
        'new',
    ]);

    if (!empty($config['notify_email'])) {
        @mail(
            $config['notify_email'],
            "[$ref] New Export Enquiry from $name ($country)",
            "Ref: $ref\nName: $name\nEmail: $email\nPhone: $phone\nCountry: $country\nMessage:\n$message"
        );
    }

    $waText = rawurlencode("Hello Mondal Export Import (Ref: $ref). Name: $name, Country: $country. $message");
    jsonOut(200, [
        'ok' => true,
        'referenceId' => $ref,
        'whatsappUrl' => "https://wa.me/918617864081?text=$waText",
    ]);
}

if ($method === 'GET' && $route === '/enquiries') {
    verifyBearer($config);
    $rows = $pdo->query('SELECT * FROM enquiries ORDER BY created_at DESC')->fetchAll();
    $out = array_map(fn($r) => [
        'id' => $r['id'],
        'referenceId' => $r['reference_id'],
        'name' => $r['name'],
        'company' => $r['company'],
        'email' => $r['email'],
        'phone' => $r['phone'],
        'country' => $r['country'],
        'products' => json_decode($r['products_json'] ?? '[]', true) ?: [],
        'quantity' => $r['quantity'],
        'message' => $r['message'],
        'status' => $r['status'],
        'adminNotes' => $r['admin_notes'] ?? '',
        'createdAt' => $r['created_at'],
    ], $rows);
    jsonOut(200, $out);
}

if ($method === 'PATCH' && preg_match('#^/enquiries/([a-zA-Z0-9-]+)$#', $route, $m)) {
    verifyBearer($config);
    $b = readJsonBody();
    $status = in_array($b['status'] ?? '', ['new', 'quoted', 'closed'], true) ? $b['status'] : null;
    $notes = isset($b['adminNotes']) ? (string)$b['adminNotes'] : null;
    if ($status !== null && $notes !== null) {
        $stmt = $pdo->prepare('UPDATE enquiries SET status=?, admin_notes=? WHERE id=?');
        $stmt->execute([$status, $notes, $m[1]]);
    } elseif ($status !== null) {
        $stmt = $pdo->prepare('UPDATE enquiries SET status=? WHERE id=?');
        $stmt->execute([$status, $m[1]]);
    } elseif ($notes !== null) {
        $stmt = $pdo->prepare('UPDATE enquiries SET admin_notes=? WHERE id=?');
        $stmt->execute([$notes, $m[1]]);
    }
    jsonOut(200, ['ok' => true]);
}

jsonOut(404, ['ok' => false, 'error' => 'Endpoint not found: ' . $route]);
