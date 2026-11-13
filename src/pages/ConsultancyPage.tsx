import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { CONSULTANCY_SERVICES, getWhatsAppLink } from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';

export function ConsultancyPage() {
  const { slug } = useParams<{ slug?: string }>();
  const activeService = slug
    ? CONSULTANCY_SERVICES.find((s) => s.slug === slug)
    : null;

  if (slug && !activeService) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center space-y-4">
        <h1 className="font-display text-3xl font-semibold text-[#0F3D2E]">
          Consultancy Service Not Found
        </h1>
        <Link
          to="/consultancy"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Consultancy Overview</span>
        </Link>
      </div>
    );
  }

  if (activeService) {
    return (
      <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
        <SeoHead
          title={`${activeService.title} | Mondal Export Import Consultancy`}
          description={activeService.oneLine}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <nav className="flex items-center gap-2 text-xs text-[#1B1B1B]/65">
            <Link to="/" className="hover:text-[#0F3D2E]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link to="/consultancy" className="hover:text-[#0F3D2E]">
              Consultancy
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0F3D2E] font-medium">{activeService.title}</span>
          </nav>

          <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 sm:p-12 shadow-sm space-y-6">
            <div className="text-xs font-semibold text-[#2E8B57]">
              Export Trade Consultancy · Scope Note (Client to Confirm)
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
              {activeService.title}
            </h1>
            <p className="text-base sm:text-lg text-[#1B1B1B]/80 leading-relaxed">
              {activeService.summary}
            </p>

            <div className="pt-4 border-t border-[#0F3D2E]/10">
              <h2 className="font-display text-2xl font-semibold text-[#0F3D2E] mb-4">
                Key Deliverables
              </h2>
              <ul className="space-y-3">
                {activeService.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm sm:text-base text-[#1B1B1B]/85"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#2E8B57] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href={getWhatsAppLink(
                  `Hello, I would like consultancy assistance regarding ${activeService.title}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E0A526] text-[#09271D] text-sm font-semibold hover:bg-[#C9911A]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss on WhatsApp</span>
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-[#FAF7F0] text-sm font-semibold hover:bg-[#09271D]"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Other Services */}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#0F3D2E] mb-6">
              Other Consultancy Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {CONSULTANCY_SERVICES.filter((s) => s.slug !== activeService.slug).map(
                (s) => (
                  <Link
                    key={s.slug}
                    to={`/consultancy/${s.slug}`}
                    className="bg-white rounded-2xl border border-[#0F3D2E]/10 p-5 hover:border-[#0F3D2E]/30 transition-colors"
                  >
                    <h3 className="font-display text-lg font-semibold text-[#0F3D2E]">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#1B1B1B]/70 mt-2 leading-relaxed">
                      {s.oneLine}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Export Consultancy Services | Mondal Export Import"
        description="IEC, APEDA & Spice Board registration, export documentation, RoDTEP government benefits, and international business consultancy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold text-[#2E8B57]">
              Trade Compliance &amp; Advisory
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
              Export Licensing, Documentation &amp; Trade Consultancy
            </h1>
            <p className="text-base text-[#1B1B1B]/80 leading-relaxed">
              Backed by years of active merchant exporting since 2017, Mondal Export
              Import guides businesses through statutory export registrations,
              customs documentation, government incentive schemes, and global buyer
              readiness. Detailed engagement terms are confirmed per client scope.
            </p>
            <div className="pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-white text-sm font-semibold hover:bg-[#09271D]"
              >
                <span>Schedule Trade Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-white border border-[#0F3D2E]/10 min-h-[280px]">
            <img
              src="/images/consultancy-trade.jpg"
              alt="International export trade documentation and logistics desk"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONSULTANCY_SERVICES.map((svc, idx) => (
            <div
              key={svc.slug}
              className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <span className="font-mono text-xs text-[#2E8B57] font-semibold tabular-nums">
                  0{idx + 1}. Consultancy Practice
                </span>
                <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                  {svc.title}
                </h2>
                <p className="text-sm text-[#1B1B1B]/75 leading-relaxed">
                  {svc.summary}
                </p>
                <ul className="pt-2 space-y-2">
                  {svc.deliverables.slice(0, 3).map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs sm:text-sm text-[#1B1B1B]/80"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0F3D2E]/10 flex items-center justify-between">
                <Link
                  to={`/consultancy/${svc.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F3D2E] hover:text-[#2E8B57]"
                >
                  <span>Explore Service Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] font-mono text-[#1B1B1B]/50">
                  Client to confirm
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
