import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { COMPANY, getWhatsAppLink } from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';
import { EnquiryForm } from '../components/EnquiryForm';
import { trackEvent } from '../utils/analytics';

export function ContactPage() {
  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="Contact Us & Request Export Quote | Mondal Export Import"
        description="Send an export enquiry to Mondal Export Import in Nadia, West Bengal, India. Reach us via form, email at info@mondalexportimport.com, or WhatsApp +91 8617864081."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-[#2E8B57] mb-2">
            International Buyer Desk
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
            Get In Touch &amp; Request Export Pricing
          </h1>
          <p className="mt-3 text-base text-[#1B1B1B]/75">
            Select one or multiple products below, specify your destination country and
            quantity, and our export desk will reply promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#0F3D2E]/10 p-6 sm:p-10 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-[#0F3D2E] mb-6">
              Export Enquiry Form
            </h2>
            <EnquiryForm />
          </div>

          {/* Direct Channels + Offices */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F3D2E] text-[#FAF7F0] rounded-3xl p-7 space-y-5">
              <h2 className="font-display text-2xl font-semibold">
                Direct Communication
              </h2>

              <a
                href={COMPANY.phoneHref}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/8 hover:bg-white/12 transition-colors"
              >
                <Phone className="w-5 h-5 text-[#E0A526] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#FAF7F0]/70">Phone</div>
                  <div className="font-semibold text-sm tabular-nums">
                    {COMPANY.phoneDisplay}
                  </div>
                </div>
              </a>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { location: 'contact_page' })}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#2E8B57] hover:bg-[#2E8B57]/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-white/80">WhatsApp Export Desk</div>
                  <div className="font-semibold text-sm tabular-nums">
                    {COMPANY.phoneDisplay} (Chat Now)
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/8 hover:bg-white/12 transition-colors"
              >
                <Mail className="w-5 h-5 text-[#E0A526] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#FAF7F0]/70">Email</div>
                  <div className="font-semibold text-sm break-all">
                    {COMPANY.email}
                  </div>
                </div>
              </a>
            </div>

            <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-7 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2E8B57]">
                  <MapPin className="w-4 h-4" />
                  <span>Registered Office</span>
                </div>
                <p className="text-sm text-[#1B1B1B]/80 leading-relaxed">
                  {COMPANY.regdOffice}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F3D2E]/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#2E8B57]">
                  <MapPin className="w-4 h-4" />
                  <span>Export Warehouse</span>
                </div>
                <p className="text-sm text-[#1B1B1B]/80 leading-relaxed">
                  {COMPANY.warehouse}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Google Maps for Registered Office & Warehouse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#0F3D2E]/10">
              <h3 className="font-display text-lg font-semibold text-[#0F3D2E]">
                Registered Office — Haringhata, Nadia
              </h3>
              <p className="text-xs text-[#1B1B1B]/65 mt-0.5">{COMPANY.regdOffice}</p>
            </div>
            <iframe
              title="Mondal Export Import Registered Office Map"
              src="https://maps.google.com/maps?q=Fatepur%20Haringhata%20Nadia%20West%20Bengal%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              className="w-full h-64 border-0"
            />
          </div>

          <div className="bg-white rounded-3xl border border-[#0F3D2E]/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#0F3D2E]/10">
              <h3 className="font-display text-lg font-semibold text-[#0F3D2E]">
                Export Warehouse — Chakdaha, Nadia
              </h3>
              <p className="text-xs text-[#1B1B1B]/65 mt-0.5">{COMPANY.warehouse}</p>
            </div>
            <iframe
              title="Mondal Export Import Warehouse Map"
              src="https://maps.google.com/maps?q=Kadambagachi%20Chakdaha%20Nadia%20West%20Bengal%20India&t=&z=12&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              className="w-full h-64 border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
