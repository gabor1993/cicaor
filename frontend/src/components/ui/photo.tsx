import Image from "next/image";
import { PhotoPlaceholder } from "./photo-placeholder";

type PhotoProps = {
  src: string | null;
  alt: string;
  sizes: string;
  tone?: 0 | 1 | 2;
  className?: string;
};

// For images that are optional in the CMS: shows the placeholder until a photo is uploaded.
export function Photo({ src, alt, sizes, tone, className = "" }: PhotoProps) {
  if (!src) return <PhotoPlaceholder alt={alt} tone={tone} className={className} />;
  return <Image src={src} alt={alt} width={800} height={600} sizes={sizes} className={`object-cover ${className}`} />;
}
