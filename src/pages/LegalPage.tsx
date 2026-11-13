import { COMPANY } from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
}

export function LegalPage({ mode }: LegalPageProps) {
  const isPrivacy = mode === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Foreign Trade & Use';

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title={`${title} | ${COMPANY.brand}`}
        description={`${title} for international buyers and visitors on Mondal Export Import.`}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-8 sm:p-12 space-y-6 shadow-sm">
          <p className="text-xs font-semibold text-[#2E8B57]">
            Legal Notice · Updated 2026
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F3D2E]">
            {title}
          </h1>

          {isPrivacy ? (
            <div className="space-y-4 text-sm text-[#1B1B1B]/80 leading-relaxed">
              <p>
                {COMPANY.brand} respects your privacy and handles buyer enquiry data
                solely for preparing commercial export quotations, proforma invoices, and
                shipment coordination.
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E] pt-2">
                Information We Collect
              </h2>
              <p>
                When you submit an export enquiry, we collect your name, company name,
                business email, phone/WhatsApp number, destination country, and
                commodity requirements. We do not sell or rent buyer data to third
                parties.
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E] pt-2">
                Contact &amp; Data Requests
              </h2>
              <p>
                To update or remove your contact details, email{' '}
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-[#0F3D2E] underline font-medium"
                >
                  {COMPANY.email}
                </a>{' '}
                or write to our registered office at {COMPANY.regdOffice}.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-[#1B1B1B]/80 leading-relaxed">
              <p>
                All commodity listings, packaging sizes, and minimum order quantities on
                this website serve as an informational B2B trade catalogue for
                international and domestic buyers.
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E] pt-2">
                Quotations &amp; Incoterms
              </h2>
              <p>
                Final export pricing (FOB, CFR, or CIF), moisture tolerances, delivery
                schedules, and payment terms (L/C or advance TT) are governed exclusively
                by the signed Proforma Invoice or Sales Contract issued by {COMPANY.brand}.
              </p>
              <h2 className="font-display text-xl font-semibold text-[#0F3D2E] pt-2">
                Regulatory Compliance
              </h2>
              <p>
                Exports are executed in accordance with Indian Foreign Trade Policy,
                APEDA, Spice Board, FSSAI, and destination country import phytosanitary
                regulations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
