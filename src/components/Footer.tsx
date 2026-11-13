import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { COMPANY, CATEGORIES, CONSULTANCY_SERVICES } from '../data/siteContent';

export function Footer() {
  return (
    <footer className="bg-[#09271D] text-[#FAF7F0] pt-16 pb-24 md:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={COMPANY.logoUrl}
                alt="Mondal Export Import"
                className="w-11 h-11 rounded-xl bg-white p-0.5 object-contain"
              />
              <div>
                <div className="font-display text-xl font-semibold text-[#FAF7F0]">
                  {COMPANY.brand}
                </div>
                <div className="text-xs text-[#E0A526]">{COMPANY.tagline}</div>
              </div>
            </Link>
            <p className="text-sm text-[#FAF7F0]/75 leading-relaxed max-w-sm">
              Merchant exporter since {COMPANY.foundedYear} delivering agricultural
              commodities, fresh fruits, vegetables, and authentic Indian spices to
              Bangladesh, Asia, the Middle East, Africa, and Europe.
            </p>
            <p className="text-sm font-medium text-[#E0A526]">
              “{COMPANY.motto}”
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#FAF7F0]/80">
              <a
                href={COMPANY.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E0A526] transition-colors"
              >
                Facebook
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={COMPANY.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E0A526] transition-colors"
              >
                Instagram
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={COMPANY.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E0A526] transition-colors"
              >
                X
              </a>
              <span aria-hidden="true">·</span>
              <a
                href={COMPANY.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E0A526] transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-[#E0A526]">Export Products</h3>
            <ul className="space-y-2.5 text-sm text-[#FAF7F0]/75">
              <li>
                <Link to="/products" className="hover:text-[#FAF7F0] transition-colors">
                  All Products (45)
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/products/${c.id}`}
                    className="hover:text-[#FAF7F0] transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/catalogue" className="hover:text-[#FAF7F0] transition-colors">
                  PDF Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Consultancy */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-[#E0A526]">Company & Services</h3>
            <ul className="space-y-2.5 text-sm text-[#FAF7F0]/75">
              <li>
                <Link to="/about" className="hover:text-[#FAF7F0] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/certifications"
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  Certifications & GPC Dubai
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#FAF7F0] transition-colors">
                  Export Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#FAF7F0] transition-colors">
                  Export Insights Blog
                </Link>
              </li>
              {CONSULTANCY_SERVICES.slice(0, 2).map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/consultancy/${s.slug}`}
                    className="hover:text-[#FAF7F0] transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/consultancy"
                  className="hover:text-[#FAF7F0] transition-colors"
                >
                  All Consultancy Services
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-[#E0A526] transition-colors"
                >
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Addresses */}
          <div className="lg:col-span-3 space-y-3 text-sm text-[#FAF7F0]/80">
            <h3 className="text-sm font-semibold text-[#E0A526]">Contact & Offices</h3>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
              <a href={COMPANY.phoneHref} className="hover:text-white tabular-nums">
                {COMPANY.phoneDisplay}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white break-all">
                {COMPANY.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#E0A526] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#FAF7F0]">Regd. Office</div>
                <p className="text-xs text-[#FAF7F0]/70 leading-relaxed">
                  {COMPANY.regdOffice}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#FAF7F0]">Warehouse</div>
                <p className="text-xs text-[#FAF7F0]/70 leading-relaxed">
                  {COMPANY.warehouse}
                </p>
              </div>
            </div>
            <a
              href={COMPANY.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#E0A526] hover:underline pt-1"
            >
              <span>View Google Reviews</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F0]/60">
          <div>© 2026 Mondal Export Import. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-[#FAF7F0]">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms" className="hover:text-[#FAF7F0]">
              Terms of Trade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
