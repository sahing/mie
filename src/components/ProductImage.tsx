import { useState } from 'react';
import { Wheat, Apple, Carrot, Flame } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ProductImage({
  src,
  alt,
  category,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored || !src) {
    const Icon =
      category === 'fruits'
        ? Apple
        : category === 'vegetables'
          ? Carrot
          : category === 'spices'
            ? Flame
            : Wheat;
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0F3D2E]/10 via-[#FAF7F0] to-[#E0A526]/15 flex flex-col items-center justify-center p-6 text-center">
        <Icon className="w-10 h-10 text-[#0F3D2E]/50 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-[#0F3D2E]/70 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
