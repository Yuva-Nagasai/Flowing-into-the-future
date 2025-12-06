import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export default function SEOHead({
  title,
  description = 'NanoFlows Digital Hub - Discover amazing products with fast delivery and secure checkout.',
  keywords = 'shop, ecommerce, products, electronics, fashion, deals',
  ogImage = '/og-shop.jpg',
  ogType = 'website',
  canonical,
}: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | NanoFlows Digital Hub`;

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('og:title', `${title} | NanoFlows Digital Hub`, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', ogImage, true);
    updateMeta('og:type', ogType, true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', `${title} | NanoFlows Digital Hub`);
    updateMeta('twitter:description', description);

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, keywords, ogImage, ogType, canonical]);

  return null;
}
