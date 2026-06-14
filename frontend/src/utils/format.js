export const formatPrice = (value) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat("ar-SY", {
    maximumFractionDigits: 0,
  }).format(n);
};

// Fallback image when a product has no picture
export const placeholder =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#eef2ff'/><text x='50%' y='50%' font-size='28' fill='#1428A0' text-anchor='middle' dominant-baseline='middle' font-family='Cairo'>Al Boraq</text></svg>`
  );

export const imgUrl = (src) => {
  if (!src) return placeholder;
  if (src.startsWith("http")) return src;
  const base = (import.meta.env.VITE_API_URL || "http://localhost:8001/api").replace(
    "/api",
    ""
  );
  return `${base}/storage/${src}`;
};
