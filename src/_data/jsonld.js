import siteData from "./site.js";
import servicesData from "./services.js";

export default function () {
  const site = siteData();
  const services = servicesData();

  return {
    "@context": "https://schema.org",
    "@type": ["AutoRepair", "LocalBusiness"],
    name: site.business.name,
    alternateName: "Redline Repairs",
    description:
      "Professional auto repair shop in Tyler, TX offering oil changes, brake repair, engine diagnostics, tire rotation, AC repair, and transmission service. Honest pricing with transparent quotes and no hidden fees.",
    url: `${site.site_url}/`,
    logo: `${site.site_url}${site.logo}`,
    image: `${site.site_url}${site.logo}`,
    telephone: site.business.phone_tel,
    email: site.business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.business.street_address,
      addressLocality: site.business.city,
      addressRegion: site.business.region,
      postalCode: site.business.postal_code,
      addressCountry: site.business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.map.lat,
      longitude: site.map.lng,
    },
    hasMap: site.map.google_maps_short_url,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    areaServed: (site.areas_served || []).map((area) =>
      area.same_as
        ? { "@type": "City", name: area.name, sameAs: area.same_as }
        : { "@type": "City", name: area.name }
    ),
    sameAs: [
      site.business.social?.facebook,
      site.business.social?.instagram,
      site.map.google_maps_short_url,
    ].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Auto Repair Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
      })),
    },
  };
}
