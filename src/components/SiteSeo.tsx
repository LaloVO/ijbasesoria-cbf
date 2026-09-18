import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://betsabeearias.homepty.com';

const SiteSeo = () => {
  const location = useLocation();
  const canonical = `${SITE_URL}${location.pathname === '/' ? '' : location.pathname}`;
  const isHome = location.pathname === '/';

  const schema = isHome
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          '@id': `${SITE_URL}/#real-estate-agent`,
          name: 'IJB Asesoría',
          url: SITE_URL,
          areaServed: { '@type': 'City', name: 'Ciudad de México' },
          knowsAbout: [
            'Rentas con póliza jurídica',
            'Compra y venta de propiedades',
            'Asesoría hipotecaria',
            'Desarrollos inmobiliarios',
          ],
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'IJB Asesoría',
          inLanguage: 'es-MX',
          publisher: { '@id': `${SITE_URL}/#real-estate-agent` },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/mapa?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ]
    : [];

  return (
    <Helmet>
      <html lang="es-MX" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="es_MX" />
      <meta property="og:site_name" content="IJB Asesoría" />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      {schema.map((item, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify(item)}</script>
      ))}
    </Helmet>
  );
};

export default SiteSeo;
