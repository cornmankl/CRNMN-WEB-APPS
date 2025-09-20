import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
}

export function SEOHead({
  title = 'THEFMSMKT CMNTYPLX - Premium Gourmet Corn Street Food Delivery Malaysia',
  description = 'Order premium gourmet corn snacks with 4 irresistible flavors: Chocolate, Cheddar Cheese, Susu Pekat & Caramel. Fast delivery across Klang Valley. THEFMSMKT - Street food redefined.',
  keywords = 'food delivery malaysia, gourmet corn, street food, chocolate corn, cheddar cheese corn, susu pekat, caramel corn, klang valley delivery, premium snacks, THEFMSMKT',
  image = 'https://thefmsmkt.com/og-image.jpg',
  url = 'https://thefmsmkt.com',
  type = 'website',
  structuredData
}: SEOProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'THEFMSMKT CMNTYPLX');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'THEFMSMKT CMNTYPLX', true);
    updateMetaTag('og:locale', 'en_MY', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:site', '@thefmsmkt');

    // Additional mobile and app tags
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    updateMetaTag('apple-mobile-web-app-title', 'THEFMSMKT');
    updateMetaTag('application-name', 'THEFMSMKT');
    updateMetaTag('theme-color', '#39FF14');
    updateMetaTag('msapplication-TileColor', '#39FF14');

    // Geo tags for local SEO
    updateMetaTag('geo.region', 'MY-14'); // Kuala Lumpur
    updateMetaTag('geo.placename', 'Kuala Lumpur, Malaysia');
    updateMetaTag('geo.position', '3.139;101.687');
    updateMetaTag('ICBM', '3.139, 101.687');

    // Business specific tags
    updateMetaTag('business:contact_data:street_address', 'Klang Valley');
    updateMetaTag('business:contact_data:locality', 'Kuala Lumpur');
    updateMetaTag('business:contact_data:region', 'Federal Territory');
    updateMetaTag('business:contact_data:postal_code', '50000');
    updateMetaTag('business:contact_data:country_name', 'Malaysia');

    // Create or update structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Create canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Create alternate language links
    const alternateLangs = [
      { lang: 'en', href: url },
      { lang: 'ms', href: `${url}/ms` },
      { lang: 'zh', href: `${url}/zh` }
    ];

    alternateLangs.forEach(({ lang, href }) => {
      let alternate = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = lang;
        document.head.appendChild(alternate);
      }
      alternate.href = href;
    });

  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
}

// Default structured data for the homepage
export const defaultStructuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "THEFMSMKT CMNTYPLX",
  "description": "Premium gourmet corn street food delivery service in Malaysia",
  "url": "https://thefmsmkt.com",
  "logo": "https://thefmsmkt.com/logo.png",
  "image": "https://thefmsmkt.com/og-image.jpg",
  "priceRange": "RM 7-15",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Kuala Lumpur",
    "addressRegion": "Federal Territory",
    "addressCountry": "Malaysia"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "3.139",
    "longitude": "101.687"
  },
  "telephone": "+60-123-456-789",
  "servesCuisine": "Street Food",
  "menu": "https://thefmsmkt.com/menu",
  "acceptsReservations": false,
  "delivery": {
    "@type": "DeliveryService",
    "url": "https://thefmsmkt.com"
  },
  "paymentAccepted": "Cash, Credit Card, Online Payment",
  "openingHours": [
    "Mo-Su 10:00-22:00"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2347",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Abdullah"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "THEFMSMKT jagung terbaik yang pernah saya rasa! Rasa Chocolate mereka sungguh addictive."
    }
  ],
  "hasMenu": {
    "@type": "Menu",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Gourmet Corn Varieties",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Chocolate Corn Delight",
            "description": "Premium corn kernels coated with rich chocolate flavor",
            "offers": {
              "@type": "Offer",
              "price": "9.50",
              "priceCurrency": "MYR"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Cheddar Cheese Classic",
            "description": "Crispy corn with authentic cheddar cheese coating",
            "offers": {
              "@type": "Offer",
              "price": "8.90",
              "priceCurrency": "MYR"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Susu Pekat Traditional",
            "description": "Local favorite with sweet condensed milk flavor",
            "offers": {
              "@type": "Offer",
              "price": "8.50",
              "priceCurrency": "MYR"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Caramel Crunch",
            "description": "Sweet caramel coating on perfectly roasted corn",
            "offers": {
              "@type": "Offer",
              "price": "9.00",
              "priceCurrency": "MYR"
            }
          }
        ]
      }
    ]
  }
};

// Product-specific structured data
export const createProductStructuredData = (product: any) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "brand": {
    "@type": "Brand",
    "name": "THEFMSMKT"
  },
  "offers": {
    "@type": "Offer",
    "price": product.price.replace('RM ', ''),
    "priceCurrency": "MYR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "THEFMSMKT CMNTYPLX"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150"
  }
});

// Delivery area structured data
export const createDeliveryAreaStructuredData = (areas: string[]) => ({
  "@context": "https://schema.org",
  "@type": "DeliveryService",
  "provider": {
    "@type": "Restaurant",
    "name": "THEFMSMKT CMNTYPLX"
  },
  "areaServed": areas.map(area => ({
    "@type": "City",
    "name": area,
    "containedInPlace": {
      "@type": "State",
      "name": "Selangor",
      "containedInPlace": {
        "@type": "Country",
        "name": "Malaysia"
      }
    }
  })),
  "deliveryMethod": "https://schema.org/OnSitePickup",
  "estimatedDeliveryTime": "15-30 minutes"
});