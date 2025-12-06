import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

// Type assertion to handle React 19 compatibility
const HelmetComponent = Helmet as any;

export default function SEO({ title, description, keywords }: SEOProps) {
  return (
    <HelmetComponent>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </HelmetComponent>
  );
}

