export function articleJsonLd(title?: string, description?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
  };
}
