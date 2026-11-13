import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck, Globe, PackageCheck } from 'lucide-react';
import {
  COMPANY,
  COMPANY_OVERVIEW,
  WHY_CHOOSE_US,
  PROCESS_STEPS,
  getWhatsAppLink,
} from '../data/siteContent';
import { SeoHead } from '../components/SeoHead';

export function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-[#FAF7F0] min-h-screen">
      <SeoHead
        title="About Mondal Export Import | Indian Merchant Exporter Since 2017"
        description="Learn about Mondal Export Import, an ISO 9001:2015 certified One Star Export House in West Bengal, India exporting agro commodities, fresh produce, and spices."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold text-[#2E8B57]">
              About Us · Established {COMPANY.foundedYear}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#0F3D2E] text-balance">
              {COMPANY.brand} — {COMPANY.tagline}
            </h1>
            <p className="text-base text-[#1B1B1B]/80 leading-relaxed">
              {COMPANY_OVERVIEW}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] text-[#FAF7F0] text-sm font-semibold hover:bg-[#09271D] transition-colors"
              >
                <span>Explore 45 Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E0A526] text-[#09271D] text-sm font-semibold hover:bg-[#C9911A] transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-white border border-[#0F3D2E]/10 min-h-[300px]">
            <img
              src="/images/company-warehouse.jpg"
              alt="Mondal Export Import warehouse and quality inspection in Nadia, West Bengal"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((pillar, i) => {
            const Icon = i === 0 ? ShieldCheck : i === 1 ? Globe : PackageCheck;
            return (
              <div
                key={pillar.number}
                className="bg-white rounded-3xl border border-[#0F3D2E]/10 p-7 space-y-3 shadow-sm"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#0F3D2E]/8 text-[#0F3D2E] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="font-display text-2xl font-semibold text-[#0F3D2E]">
                  {pillar.title}
                </h2>
                <p className="text-sm text-[#1B1B1B]/75 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Offices & Logistics */}
        <div className="bg-[#0F3D2E] text-[#FAF7F0] rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-semibold">
              West Bengal Strategic Footprint
            </h2>
            <p className="text-sm text-[#FAF7F0]/80 leading-relaxed">
              Operating from Nadia District in West Bengal, we maintain seamless road
              connectivity to Bangladesh land customs stations as well as Kolkata and
              Haldia maritime container terminals. In addition to international exports,
              we also supply the domestic market on demand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/8 border border-white/12 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#E0A526] text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Registered Office</span>
              </div>
              <p className="text-sm text-[#FAF7F0]/85 leading-relaxed">
                {COMPANY.regdOffice}
              </p>
            </div>
            <div className="rounded-2xl bg-white/8 border border-white/12 p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#E0A526] text-xs font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Export Warehouse</span>
              </div>
              <p className="text-sm text-[#FAF7F0]/85 leading-relaxed">
                {COMPANY.warehouse}
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Summary */}
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F3D2E] mb-8">
            Our 6-Step Export Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS_STEPS.map((st) => (
              <div
                key={st.step}
                className="bg-white rounded-2xl border border-[#0F3D2E]/10 p-6 space-y-2"
              >
                <span className="font-mono text-xs text-[#2E8B57] font-semibold tabular-nums">
                  Step {st.step}
                </span>
                <h3 className="font-display text-xl font-semibold text-[#0F3D2E]">
                  {st.title}
                </h3>
                <p className="text-sm text-[#1B1B1B]/75 leading-relaxed">
                  {st.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
