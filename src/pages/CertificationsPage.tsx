import { useState } from 'react';
import { ShieldCheck, X, ZoomIn } from 'lucide-react';
import { CERTIFICATE_ITEMS, COMPANY } from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';

export function CertificationsPage() {
  const [active, setActive] = useState<(typeof CERTIFICATE_ITEMS)[number] | null>(
    null
  );

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Certifications & Accreditations | ISO, APEDA, FIEO, GPC Dubai | Mondal Export Import"
        description="Inspect Mondal Export Import's official registrations: ISO 9001:2015, APEDA, FIEO, ICC, Spice Board, MSME, FSSAI, One Star Export House, and GPC Dubai."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E8B57]">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Trade Compliance</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
            Certifications, Statutory Boards &amp; Memberships
          </h1>
          <p className="text-base text-[#1B1B1B]/75 leading-relaxed">
            Every international shipment is backed by verified quality and export
            credentials. Click any certificate record below to inspect it in full view.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#0F3D2E]">
            {COMPANY.certificationsList.map((c, idx) => (
              <span key={c} className="inline-flex items-center gap-4">
                <span>{c}</span>
                {idx < COMPANY.certificationsList.length - 1 && (
                  <span aria-hidden="true" className="text-[#E0A526]">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CERTIFICATE_ITEMS.map((cert) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => setActive(cert)}
              className="group bg-white rounded-2xl border border-[#0F3D2E]/10 p-4 text-left hover:border-[#E0A526] transition-all shadow-sm hover:-translate-y-0.5"
            >
              <div className="relative aspect-[4/3] rounded-xl bg-[#FAF7F0] overflow-hidden flex items-center justify-center p-2">
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#09271D]/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>
              </div>
              <h2 className="mt-3 font-display text-base font-semibold text-[#0F3D2E]">
                {cert.title}
              </h2>
              <p className="text-xs text-[#1B1B1B]/65 mt-1">{cert.issuer}</p>
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 relative shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close certificate lightbox"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF7F0] text-[#0F3D2E] flex items-center justify-center hover:bg-[#E0A526]"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[4/3] bg-[#FAF7F0] rounded-2xl overflow-hidden flex items-center justify-center p-4">
              <img
                src={active.image}
                alt={active.title}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-xl font-semibold text-[#0F3D2E]">
                {active.title}
              </h3>
              <p className="text-sm text-[#1B1B1B]/70 mt-1">{active.issuer}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
