import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

export function EditorialImage({ src, alt, title, className = '' }: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="w-7 h-7 text-slate-400 mb-2" strokeWidth={1.5} />
        <span className="font-display text-sm font-medium text-slate-700">
          {title || 'The Ink & Isles'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
