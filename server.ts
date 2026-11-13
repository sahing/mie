import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import multer from 'multer';
import { z } from 'zod';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const dataDir = path.join(__dirname, 'data');
const productsPath = path.join(dataDir, 'products.json');
const categoriesPath = path.join(dataDir, 'categories.json');
const enquiriesPath = path.join(dataDir, 'enquiries.json');
const redirectsPath = path.join(__dirname, 'redirects.json');
const uploadsDir = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mondalexportimport.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MondalExport@2026';
const AUTH_SECRET =
  process.env.ADMIN_TOKEN_SECRET || 'mondal-preview-hmac-secret-change-in-prod';

interface ProductRecord {
  slug: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  specs: {
    origin: string;
    packaging: string;
    moq: string;
    privateLabel: boolean;
    incoterms: string;
  };
  certifications: string[];
  needsUniqueImage: boolean;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
  };
}

interface CategoryRecord {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  sortOrder: number;
}

interface EnquiryRecord {
  id: string;
  referenceId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  products: string[];
  quantity: string;
  message: string;
  status: 'new' | 'quoted' | 'closed';
  adminNotes: string;
  createdAt: string;
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function signToken(email: string): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const payload = Buffer.from(
    JSON.stringify({ email, role: 'admin', exp: expiresAt })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payload)
    .digest('base64url');
  return { token: `${payload}.${sig}`, expiresAt };
}

function verifyToken(token: string): { email: string; role: string } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expected = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payload)
      .digest('base64url');
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    ) as { email: string; role: string; exp: number };
    if (!decoded.exp || Date.now() > decoded.exp) return null;
    return { email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : '';
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Unauthorized. Please sign in.' });
  }
  (req as express.Request & { adminUser?: { email: string; role: string } }).adminUser = user;
  return next();
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const base = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .slice(0, 40);
    cb(null, `${base || 'product'}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, WebP, or GIF images are allowed.'));
  },
});

const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must use lowercase letters, numbers, and hyphens'),
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(64),
  image: z.string().trim().min(1),
  gallery: z.array(z.string()).optional().default([]),
  shortDescription: z.string().trim().max(240).optional().default(''),
  description: z.string().trim().min(5).max(5000),
  specs: z.object({
    origin: z.string().trim().max(160).default('India'),
    packaging: z.string().trim().max(200).default('TBC'),
    moq: z.string().trim().max(160).default('TBC'),
    privateLabel: z.boolean().default(true),
    incoterms: z.string().trim().max(160).default('FOB / CIF (TBC)'),
  }),
  certifications: z.array(z.string()).optional().default(['ISO 9001:2015', 'APEDA']),
  needsUniqueImage: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
  seo: z
    .object({
      title: z.string().trim().max(160).optional().default(''),
      description: z.string().trim().max(260).optional().default(''),
    })
    .optional()
    .default({ title: '', description: '' }),
});

const categorySchema = z.object({
  id: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'Category ID must use lowercase letters, numbers, and hyphens'),
  name: z.string().trim().min(2).max(120),
  shortName: z.string().trim().min(2).max(60),
  description: z.string().trim().min(5).max(1000),
  image: z.string().trim().min(1),
  sortOrder: z.number().int().min(0).optional().default(10),
});

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  company: z.string().trim().max(160).optional().default(''),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(6, 'Please enter a valid phone or WhatsApp number').max(40),
  country: z.string().trim().min(2, 'Please select your destination country').max(100),
  products: z.array(z.string()).optional().default([]),
  quantity: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().min(5, 'Please include a short message about your requirement').max(3000),
  website: z.string().optional().default(''),
});

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(ip);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count += 1;
  return true;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // CORS headers for cross-server usage
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  });

  // 301 Redirects from legacy WordPress URLs
  const redirectMap = readJson<Record<string, string>>(redirectsPath, {});
  app.use((req, res, next) => {
    const normalized =
      req.path.length > 1 && req.path.endsWith('/')
        ? req.path.slice(0, -1)
        : req.path;
    const target =
      redirectMap[req.path] || redirectMap[normalized] || redirectMap[`${normalized}/`];
    if (target) {
      return res.redirect(301, target);
    }
    return next();
  });

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    const products = readJson<ProductRecord[]>(productsPath, []);
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    res.json({
      ok: true,
      engine: 'express-preview',
      productCount: products.length,
      categoryCount: categories.length,
      timestamp: new Date().toISOString(),
    });
  });

  // Auth routes
  app.post('/api/auth/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      return res
        .status(401)
        .json({ ok: false, error: 'Invalid admin email or password.' });
    }

    const { token, expiresAt } = signToken(ADMIN_EMAIL);
    return res.json({
      ok: true,
      token,
      expiresAt,
      user: { email: ADMIN_EMAIL, role: 'admin' },
    });
  });

  app.get('/api/auth/me', requireAdmin, (req, res) => {
    const adminReq = req as express.Request & {
      adminUser?: { email: string; role: string };
    };
    res.json({ ok: true, user: adminReq.adminUser });
  });

  // Categories API
  app.get('/api/categories', (_req, res) => {
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    const products = readJson<ProductRecord[]>(productsPath, []);
    const withCounts = [...categories]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => ({
        ...cat,
        count: products.filter((p) => p.category === cat.id).length,
      }));
    res.json(withCounts);
  });

  app.post('/api/categories', requireAdmin, (req, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, error: parsed.error.issues[0]?.message || 'Invalid category' });
    }
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    if (categories.some((c) => c.id === parsed.data.id)) {
      return res
        .status(409)
        .json({ ok: false, error: 'A category with this ID already exists.' });
    }
    const created: CategoryRecord = parsed.data;
    categories.push(created);
    writeJson(categoriesPath, categories);
    return res.status(201).json({ ok: true, category: created });
  });

  app.put('/api/categories/:id', requireAdmin, (req, res) => {
    const parsed = categorySchema.safeParse({ ...req.body, id: req.params.id });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, error: parsed.error.issues[0]?.message || 'Invalid category' });
    }
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    const idx = categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Category not found.' });
    }
    categories[idx] = parsed.data;
    writeJson(categoriesPath, categories);
    return res.json({ ok: true, category: categories[idx] });
  });

  app.delete('/api/categories/:id', requireAdmin, (req, res) => {
    const products = readJson<ProductRecord[]>(productsPath, []);
    const usedCount = products.filter((p) => p.category === req.params.id).length;
    if (usedCount > 0) {
      return res.status(409).json({
        ok: false,
        error: `Cannot delete category while ${usedCount} products belong to it.`,
      });
    }
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    const next = categories.filter((c) => c.id !== req.params.id);
    if (next.length === categories.length) {
      return res.status(404).json({ ok: false, error: 'Category not found.' });
    }
    writeJson(categoriesPath, next);
    return res.json({ ok: true });
  });

  // Products API
  app.get('/api/products', (req, res) => {
    const products = readJson<ProductRecord[]>(productsPath, []);
    const cat = String(req.query.category || '').trim();
    const q = String(req.query.q || '').trim().toLowerCase();
    const filtered = products.filter((p) => {
      const catMatch = !cat || cat === 'all' || p.category === cat;
      const qMatch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return catMatch && qMatch;
    });
    res.json(filtered);
  });

  app.get('/api/products/:slug', (req, res) => {
    const products = readJson<ProductRecord[]>(productsPath, []);
    const item = products.find((p) => p.slug === req.params.slug);
    if (!item) return res.status(404).json({ ok: false, error: 'Product not found.' });
    return res.json(item);
  });

  app.post('/api/products', requireAdmin, (req, res) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, error: parsed.error.issues[0]?.message || 'Invalid product' });
    }
    const products = readJson<ProductRecord[]>(productsPath, []);
    if (products.some((p) => p.slug === parsed.data.slug)) {
      return res
        .status(409)
        .json({ ok: false, error: 'A product with this slug already exists.' });
    }
    const data = parsed.data;
    const newProduct: ProductRecord = {
      ...data,
      shortDescription:
        data.shortDescription || data.description.slice(0, 140).trim(),
      seo: {
        title:
          data.seo?.title || `${data.name} Exporter India | Mondal Export Import`,
        description:
          data.seo?.description ||
          data.shortDescription ||
          data.description.slice(0, 155),
      },
    };
    products.push(newProduct);
    writeJson(productsPath, products);
    return res.status(201).json({ ok: true, product: newProduct });
  });

  app.put('/api/products/:slug', requireAdmin, (req, res) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ ok: false, error: parsed.error.issues[0]?.message || 'Invalid product' });
    }
    const products = readJson<ProductRecord[]>(productsPath, []);
    const idx = products.findIndex((p) => p.slug === req.params.slug);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }
    if (
      parsed.data.slug !== req.params.slug &&
      products.some((p) => p.slug === parsed.data.slug)
    ) {
      return res
        .status(409)
        .json({ ok: false, error: 'Another product already uses that slug.' });
    }
    const data = parsed.data;
    const updated: ProductRecord = {
      ...data,
      shortDescription:
        data.shortDescription || data.description.slice(0, 140).trim(),
      seo: {
        title:
          data.seo?.title || `${data.name} Exporter India | Mondal Export Import`,
        description:
          data.seo?.description ||
          data.shortDescription ||
          data.description.slice(0, 155),
      },
    };
    products[idx] = updated;
    writeJson(productsPath, products);
    return res.json({ ok: true, product: updated });
  });

  app.delete('/api/products/:slug', requireAdmin, (req, res) => {
    const products = readJson<ProductRecord[]>(productsPath, []);
    const next = products.filter((p) => p.slug !== req.params.slug);
    if (next.length === products.length) {
      return res.status(404).json({ ok: false, error: 'Product not found.' });
    }
    writeJson(productsPath, next);
    return res.json({ ok: true });
  });

  // Image Upload Endpoint
  app.post('/api/upload', requireAdmin, (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ ok: false, error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ ok: false, error: 'No image file provided.' });
      }
      return res.status(201).json({
        ok: true,
        url: `/uploads/${req.file.filename}`,
      });
    });
  });

  // Export current store as MySQL seed SQL for cPanel import
  app.get('/api/export-sql', requireAdmin, (_req, res) => {
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    const products = readJson<ProductRecord[]>(productsPath, []);
    const esc = (s: string) =>
      "'" +
      String(s ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r?\n/g, '\\n') +
      "'";

    const lines: string[] = [
      '-- Mondal Export Import — Live MySQL Seed Export',
      `-- Generated at ${new Date().toISOString()}`,
      'SET NAMES utf8mb4;',
      '',
    ];

    for (const c of categories) {
      lines.push(
        `INSERT INTO categories (id, name, short_name, description, cover_image, sort_order) VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.shortName)}, ${esc(c.description)}, ${esc(c.image)}, ${Number(c.sortOrder || 0)}) ON DUPLICATE KEY UPDATE name=VALUES(name), short_name=VALUES(short_name), description=VALUES(description), cover_image=VALUES(cover_image), sort_order=VALUES(sort_order);`
      );
    }

    lines.push('');
    for (const p of products) {
      lines.push(
        `INSERT INTO products (slug, name, category_id, image_url, gallery_json, short_description, description, origin, packaging, moq, private_label, incoterms, certifications_json, needs_unique_image, featured, seo_title, seo_description) VALUES (${esc(p.slug)}, ${esc(p.name)}, ${esc(p.category)}, ${esc(p.image)}, ${esc(JSON.stringify(p.gallery || []))}, ${esc(p.shortDescription)}, ${esc(p.description)}, ${esc(p.specs?.origin || 'India')}, ${esc(p.specs?.packaging || 'TBC')}, ${esc(p.specs?.moq || 'TBC')}, ${p.specs?.privateLabel ? 1 : 0}, ${esc(p.specs?.incoterms || 'FOB / CIF (TBC)')}, ${esc(JSON.stringify(p.certifications || []))}, ${p.needsUniqueImage ? 1 : 0}, ${p.featured ? 1 : 0}, ${esc(p.seo?.title || '')}, ${esc(p.seo?.description || '')}) ON DUPLICATE KEY UPDATE name=VALUES(name), category_id=VALUES(category_id), image_url=VALUES(image_url), gallery_json=VALUES(gallery_json), short_description=VALUES(short_description), description=VALUES(description), origin=VALUES(origin), packaging=VALUES(packaging), moq=VALUES(moq), private_label=VALUES(private_label), incoterms=VALUES(incoterms), certifications_json=VALUES(certifications_json), needs_unique_image=VALUES(needs_unique_image), featured=VALUES(featured), seo_title=VALUES(seo_title), seo_description=VALUES(seo_description);`
      );
    }

    res.setHeader('Content-Type', 'application/sql; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="mondal-seed.sql"'
    );
    res.send(lines.join('\n'));
  });

  // Robots.txt & Dynamic Sitemap.xml
  app.get('/robots.txt', (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const origin = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const products = readJson<ProductRecord[]>(productsPath, []);
    const categories = readJson<CategoryRecord[]>(categoriesPath, []);
    const staticRoutes = [
      '/',
      '/about',
      '/products',
      ...categories.map((c) => `/products/${c.id}`),
      '/consultancy',
      '/consultancy/export-license-registration',
      '/consultancy/export-documentation',
      '/consultancy/govt-benefits-service',
      '/consultancy/business-consultancy',
      '/gallery',
      '/certifications',
      '/blog',
      '/blog/indian-basmati-rice-export-guide',
      '/blog/apeda-phytosanitary-compliance-fresh-produce',
      '/blog/spice-board-quality-standards-global-buyers',
      '/blog/export-packaging-private-labeling-tips',
      '/contact',
      '/catalogue',
      '/privacy-policy',
      '/terms',
    ];

    const productRoutes = products.map((p) => `/products/${p.slug}`);
    const allUrls = [...staticRoutes, ...productRoutes];
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (route) => `  <url>
    <loc>${origin}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.startsWith('/products/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/products') ? '0.8' : '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // Enquiry Submission & Admin Management
  app.post('/api/enquiry', async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        ok: false,
        error: 'Too many requests. Please wait a few minutes or message us directly on WhatsApp.',
      });
    }

    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: parsed.error.issues[0]?.message || 'Invalid form submission.',
      });
    }

    const data = parsed.data;
    if (data.website && data.website.trim().length > 0) {
      return res.status(200).json({ ok: true, referenceId: 'MEI-FILTERED' });
    }

    const referenceId = `MEI-${Date.now().toString(36).toUpperCase()}`;
    const record: EnquiryRecord = {
      id: crypto.randomUUID(),
      referenceId,
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      country: data.country,
      products: data.products,
      quantity: data.quantity,
      message: data.message,
      status: 'new',
      adminNotes: '',
      createdAt: new Date().toISOString(),
    };

    const existing = readJson<EnquiryRecord[]>(enquiriesPath, []);
    existing.unshift(record);
    writeJson(enquiriesPath, existing);

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'enquiries@mondalexportimport.com',
            to: ['info@mondalexportimport.com'],
            reply_to: data.email,
            subject: `[${referenceId}] New Export Enquiry from ${data.name} (${data.country})`,
            text: [
              `Reference: ${referenceId}`,
              `Name: ${data.name}`,
              `Company: ${data.company || 'N/A'}`,
              `Email: ${data.email}`,
              `Phone/WhatsApp: ${data.phone}`,
              `Country: ${data.country}`,
              `Products: ${data.products.join(', ') || 'General'}`,
              `Quantity: ${data.quantity || 'TBC'}`,
              `Message:\n${data.message}`,
            ].join('\n'),
          }),
        });
      } catch (err) {
        console.error('Resend dispatch error:', err);
      }
    }

    if (process.env.ENQUIRY_WEBHOOK_URL) {
      try {
        await fetch(process.env.ENQUIRY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch (err) {
        console.error('Webhook dispatch error:', err);
      }
    }

    const whatsappSummary = encodeURIComponent(
      `Hello Mondal Export Import (Ref: ${referenceId}). Name: ${data.name}${
        data.company ? `, Company: ${data.company}` : ''
      }, Country: ${data.country}. Products: ${
        data.products.join(', ') || 'General Export Enquiry'
      }. Quantity: ${data.quantity || 'TBC'}. ${data.message}`
    );

    return res.status(200).json({
      ok: true,
      referenceId,
      whatsappUrl: `https://wa.me/918617864081?text=${whatsappSummary}`,
    });
  });

  app.get('/api/enquiries', requireAdmin, (_req, res) => {
    const enquiries = readJson<EnquiryRecord[]>(enquiriesPath, []);
    res.json(enquiries);
  });

  app.patch('/api/enquiries/:id', requireAdmin, (req, res) => {
    const enquiries = readJson<EnquiryRecord[]>(enquiriesPath, []);
    const idx = enquiries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Enquiry not found.' });
    }
    const status = req.body?.status;
    if (status && ['new', 'quoted', 'closed'].includes(status)) {
      enquiries[idx].status = status;
    }
    if (typeof req.body?.adminNotes === 'string') {
      enquiries[idx].adminNotes = req.body.adminNotes.slice(0, 2000);
    }
    writeJson(enquiriesPath, enquiries);
    return res.json({ ok: true, enquiry: enquiries[idx] });
  });

  app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mondal Export Import server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
