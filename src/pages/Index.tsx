
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import MarketPreview from '@/components/home/MarketPreview';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <MarketPreview />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

export default Index;
