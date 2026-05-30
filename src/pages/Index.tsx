import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import PropertiesSection from '@/components/home/PropertiesSection';
import AIFeatureSection from '@/components/home/AIFeatureSection';
import SmartSearchCTA from '@/components/home/SmartSearchCTA';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>IJB Asesoría | Soluciones Inmobiliarias y Póliza Jurídica CDMX</title>
        <meta
          name="description"
          content="Encuentra propiedades en la CDMX con procesos ágiles y seguros. Especialistas en rentas con póliza jurídica, asesoría hipotecaria integral y desarrollos de alto potencial."
        />
      </Helmet>

      <Navbar />

      <main>
        <HeroSection />
        <PropertiesSection />
        <AIFeatureSection />
        <SmartSearchCTA />
      </main>

      <Footer />
    </>
  );
};

export default Index;
