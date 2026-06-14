import { useState } from "react";
import { imgUrl, placeholder } from "../utils/format";

/**
 * Image with a loading shimmer and an automatic fallback when the
 * source fails to load — keeps the UI looking polished even if a
 * remote image 404s.
 */
export default function SmartImage({ src, alt = "", className = "", imgClassName = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolved = failed ? placeholder : imgUrl(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={resolved}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`h-full w-full object-contain transition-all duration-500 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${imgClassName}`}
      />
    </div>
  );
}
