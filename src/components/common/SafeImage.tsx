import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';

/** <img> with a graceful fallback when the image is missing or fails to load. */
export default function SafeImage({ src, alt, className = '', ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (image unavailable)` : 'Image unavailable'}
        className={`flex items-center justify-center bg-brand-50 text-brand-500 ${className}`}
      >
        <ImageOff size={28} aria-hidden />
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />;
}
