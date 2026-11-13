import { useState } from 'react';
import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react';
import { COUNTRY_OPTIONS, getWhatsAppLink } from '../data/siteContent';
import { useCatalog } from '../context/CatalogContext';
import { getApiBaseUrl } from '../services/api';
import { trackEvent } from '../utils/analytics';

interface EnquiryFormProps {
  defaultProduct?: string;
  compact?: boolean;
}

export function EnquiryForm({ defaultProduct, compact = false }: EnquiryFormProps) {
  const { products: allProducts } = useCatalog();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultProduct ? [defaultProduct] : []
  );
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState(
    defaultProduct
      ? `Hello, I want to buy ${defaultProduct}. Please share price, packaging options, and FOB/CIF details.`
      : ''
  );
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    referenceId: string;
    whatsappUrl: string;
  } | null>(null);

  const toggleProduct = (productName: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((p) => p !== productName)
        : [...prev, productName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          country,
          products: selectedProducts.length > 0 ? selectedProducts : defaultProduct ? [defaultProduct] : [],
          quantity,
          message,
          website,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not submit your enquiry. Please try WhatsApp below.');
      } else {
        trackEvent('enquiry_submit', {
          product: defaultProduct || selectedProducts.join(',') || 'general',
          country,
        });
        setSuccess({
          referenceId: json.referenceId,
          whatsappUrl: json.whatsappUrl,
        });
      }
    } catch {
      setError('Network error while sending enquiry. You can message us directly on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl bg-[#2E8B57]/10 border border-[#2E8B57]/30 p-6 space-y-4">
        <div className="flex items-center gap-3 text-[#0F3D2E]">
          <CheckCircle2 className="w-7 h-7 text-[#2E8B57] shrink-0" />
          <div>
            <h3 className="font-display text-xl font-semibold">Enquiry Received</h3>
            <p className="text-xs text-[#1B1B1B]/70 font-mono tabular-nums">
              Reference: {success.referenceId}
            </p>
          </div>
        </div>
        <p className="text-sm text-[#1B1B1B]/80 leading-relaxed">
          Thank you for contacting Mondal Export Import. Our export desk at
          info@mondalexportimport.com will respond promptly. Need an immediate quote?
        </p>
        <div className={`flex ${compact ? 'flex-col' : 'flex-wrap'} gap-3`}>
          <a
            href={success.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { location: 'enquiry_success' })}
            className={`${compact ? 'w-full justify-center' : ''} inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E8B57] text-white text-sm font-semibold hover:bg-[#0F3D2E] transition-colors whitespace-nowrap`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Continue on WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              setMessage('');
              setQuantity('');
            }}
            className={`${compact ? 'w-full justify-center' : ''} inline-flex items-center px-4 py-2.5 rounded-full border border-[#0F3D2E]/20 text-sm font-medium text-[#0F3D2E] hover:bg-[#0F3D2E]/5 whitespace-nowrap`}
          >
            Send Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Company Name
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Importing company or firm"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Business Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="buyer@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 / +880 / +44 ..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Destination Country *
          </label>
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          >
            <option value="">Select destination country</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Required Quantity / Container
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 20 MT / 1 FCL / 500 Cartons"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none"
          />
        </div>
      </div>

      {!compact && (
        <div>
          <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
            Products of Interest ({selectedProducts.length} selected)
          </label>
          <div className="max-h-40 overflow-y-auto rounded-xl bg-white border border-[#0F3D2E]/15 p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allProducts.map((p) => {
              const checked = selectedProducts.includes(p.name);
              return (
                <label
                  key={p.slug}
                  className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    checked
                      ? 'bg-[#0F3D2E] text-white font-medium'
                      : 'hover:bg-[#0F3D2E]/5 text-[#1B1B1B]/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProduct(p.name)}
                    className="sr-only"
                  />
                  <span className="truncate">{p.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#0F3D2E] mb-1.5">
          Requirement & Packaging Notes *
        </label>
        <textarea
          rows={compact ? 3 : 4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Specify grade, preferred bag/carton size, private label, and destination port..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#0F3D2E]/15 text-sm text-[#1B1B1B] focus:border-[#0F3D2E] focus:outline-none resize-y"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/25 px-4 py-2.5 text-xs font-medium text-[#C0392B]"
        >
          {error}
        </div>
      )}

      <div className={`flex flex-col ${compact ? '' : 'sm:flex-row sm:flex-wrap'} gap-3 pt-1`}>
        <button
          type="submit"
          disabled={submitting}
          className={`${compact ? 'w-full' : 'flex-1'} inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F3D2E] hover:bg-[#09271D] disabled:opacity-60 text-[#FAF7F0] text-sm font-semibold transition-colors whitespace-nowrap`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 shrink-0" />
              <span>Send Enquiry</span>
            </>
          )}
        </button>

        {defaultProduct && (
          <a
            href={getWhatsAppLink(
              `Hello, I want to buy ${defaultProduct}. Please share price and details.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent('whatsapp_click', {
                location: 'product_enquiry_card',
                product: defaultProduct,
              })
            }
            className={`${compact ? 'w-full' : ''} inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#E0A526] hover:bg-[#C9911A] text-[#09271D] text-sm font-semibold transition-colors whitespace-nowrap`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>WhatsApp this product</span>
          </a>
        )}
      </div>
    </form>
  );
}
