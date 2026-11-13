import { useState } from 'react';
import { motion } from 'motion/react';
import { Globe2, Ship, Plane, Truck } from 'lucide-react';

interface MarketNode {
  id: string;
  name: string;
  x: number;
  y: number;
  mode: string;
  keyCommodities: string;
  transitNote: string;
}

const INDIA_HUB = { x: 642, y: 245 };

const MARKETS: MarketNode[] = [
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    x: 682,
    y: 238,
    mode: 'Land Border & Rail / Barge',
    keyCommodities: 'Rice, Wheat, Maize, Onion, Potato, Fresh Fruits, Oilcakes',
    transitNote: 'Direct dispatch from Nadia warehouse via Petrapole & Gede border corridors.',
  },
  {
    id: 'middle-east',
    name: 'Middle East (GCC)',
    x: 535,
    y: 222,
    mode: 'Ocean Container & Air Freight',
    keyCommodities: 'Basmati Rice, Green Chilli, Mango, Pomegranate, Cardamom, Turmeric',
    transitNote: 'GPC Dubai member network serving UAE, Saudi Arabia, Qatar, Oman & Kuwait.',
  },
  {
    id: 'asia',
    name: 'Asia & ASEAN',
    x: 755,
    y: 265,
    mode: 'Ocean Container & Air Freight',
    keyCommodities: 'Non-Basmati Rice, Pulses, Maize, DORB, Spices, Fresh Vegetables',
    transitNote: 'Regular shipments across Southeast & South Asian wholesale hubs.',
  },
  {
    id: 'africa',
    name: 'Africa',
    x: 495,
    y: 300,
    mode: 'Ocean FCL / Bulk',
    keyCommodities: 'Non-Basmati & Parboiled Rice, Lentils, Wheat, Groundnut, Spices',
    transitNote: 'East & West African ports served with 25 kg & 50 kg private-label sacks.',
  },
  {
    id: 'europe',
    name: 'Europe',
    x: 475,
    y: 140,
    mode: 'Reefer Sea & Air Cargo',
    keyCommodities: 'Aged Basmati Rice, Whole Spices, Table Grapes, Pomegranate, Mango',
    transitNote: 'APEDA, Spice Board & FSSAI compliant lots tailored for European buyers.',
  },
];

export function ExportMarketsMap() {
  const [active, setActive] = useState<MarketNode>(MARKETS[1]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Interactive SVG Map */}
      <div className="lg:col-span-8 relative rounded-3xl bg-[#09271D] border border-white/10 p-4 sm:p-6 overflow-hidden shadow-xl">
        <svg
          viewBox="0 0 960 440"
          className="w-full h-auto select-none"
          role="img"
          aria-label="Global export routes from West Bengal, India to Bangladesh, Asia, Middle East, Africa, and Europe"
        >
          {/* Subtle coordinate grid */}
          <g stroke="rgba(250,247,240,0.06)" strokeWidth="1">
            {[80, 160, 240, 320, 400].map((y) => (
              <line key={`h-${y}`} x1="0" y1={y} x2="960" y2={y} />
            ))}
            {[160, 320, 480, 640, 800].map((x) => (
              <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="440" />
            ))}
          </g>

          {/* Simplified stylized continental silhouettes */}
          <g fill="rgba(46,139,87,0.22)" stroke="rgba(250,247,240,0.12)" strokeWidth="1">
            {/* Americas (context) */}
            <path d="M110,95 L230,85 L270,150 L215,215 L145,190 Z" />
            <path d="M210,235 L285,255 L265,365 L215,395 L195,310 Z" />
            {/* Europe */}
            <path d="M415,85 L540,75 L560,145 L495,165 L425,155 Z" />
            {/* Africa */}
            <path d="M420,185 L525,180 L570,255 L525,365 L465,360 L415,260 Z" />
            {/* Middle East & Asia & India */}
            <path d="M525,165 L615,155 L780,105 L845,175 L810,275 L715,295 L665,245 L635,285 L595,235 L535,230 Z" />
            {/* Oceania */}
            <path d="M745,315 L845,310 L860,375 L760,380 Z" />
          </g>

          {/* Animated dotted trade routes from India */}
          {MARKETS.map((m, idx) => {
            const cx = (INDIA_HUB.x + m.x) / 2;
            const cy = Math.min(INDIA_HUB.y, m.y) - (m.id === 'bangladesh' ? 18 : 48);
            const pathD = `M ${INDIA_HUB.x} ${INDIA_HUB.y} Q ${cx} ${cy} ${m.x} ${m.y}`;
            const isSelected = active.id === m.id;
            return (
              <g key={`route-${m.id}`}>
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#E0A526' : 'rgba(250,247,240,0.4)'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray="5 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.9, delay: idx * 0.12, ease: 'easeOut' }}
                />
              </g>
            );
          })}

          {/* India Origin Hub */}
          <g>
            <circle cx={INDIA_HUB.x} cy={INDIA_HUB.y} r="10" fill="#E0A526" opacity="0.25" />
            <circle cx={INDIA_HUB.x} cy={INDIA_HUB.y} r="5.5" fill="#E0A526" />
            <text
              x={INDIA_HUB.x - 10}
              y={INDIA_HUB.y + 22}
              fill="#FAF7F0"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
            >
              West Bengal, India
            </text>
          </g>

          {/* Market Nodes */}
          {MARKETS.map((m) => {
            const isSelected = active.id === m.id;
            return (
              <g
                key={m.id}
                onClick={() => setActive(m)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Select ${m.name} export market`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActive(m);
                }}
              >
                <motion.circle
                  cx={m.x}
                  cy={m.y}
                  r={isSelected ? 15 : 11}
                  fill="#2E8B57"
                  opacity={0.3}
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isSelected ? 6.5 : 5}
                  fill={isSelected ? '#E0A526' : '#FAF7F0'}
                  stroke="#09271D"
                  strokeWidth="2"
                />
                <text
                  x={m.x}
                  y={m.y - 14}
                  fill={isSelected ? '#E0A526' : '#FAF7F0'}
                  fontSize="12"
                  fontWeight={isSelected ? '700' : '500'}
                  textAnchor="middle"
                >
                  {m.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Market Details Panel */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {MARKETS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(m)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                active.id === m.id
                  ? 'bg-[#E0A526] text-[#09271D] font-semibold'
                  : 'bg-[#0F3D2E]/8 text-[#0F3D2E] hover:bg-[#0F3D2E]/15'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-[#0F3D2E]/10 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold text-[#0F3D2E]">
              {active.name}
            </h3>
            <Globe2 className="w-5 h-5 text-[#2E8B57]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#1B1B1B]/70">
            {active.id === 'bangladesh' ? (
              <Truck className="w-4 h-4 text-[#E0A526]" />
            ) : active.id === 'europe' ? (
              <Plane className="w-4 h-4 text-[#E0A526]" />
            ) : (
              <Ship className="w-4 h-4 text-[#E0A526]" />
            )}
            <span>{active.mode}</span>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0F3D2E] mb-1">
              Primary Export Demand
            </div>
            <p className="text-sm text-[#1B1B1B]/80 leading-relaxed">
              {active.keyCommodities}
            </p>
          </div>
          <p className="text-xs text-[#1B1B1B]/65 pt-3 border-t border-[#0F3D2E]/10">
            {active.transitNote}
          </p>
        </div>
      </div>
    </div>
  );
}
