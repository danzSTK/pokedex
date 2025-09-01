import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /*   loading?: "lazy" | "eager";
  priority?: boolean; */
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  ...props
}: Readonly<ImageWithFallbackProps>) {
  const [imageError, setImageError] = useState(false);

  return (
    <Image
      src={imageError ? "/pokemon-fallback.svg" : src}
      alt={alt}
      width={width}
      height={height}
      className={cn("", className)}
      onError={() => setImageError(true)}
      {...props}
    />
  );
}
