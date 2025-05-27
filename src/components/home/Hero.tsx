
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="hero relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-primary-900 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-primary-800 mb-8 max-w-2xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-base">
              <Link to="/register">{t('home.hero.getStarted')} <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="btn-outline text-base">
              <Link to="/marketplace">{t('home.hero.exploreMarketplace')}</Link>
            </Button>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-5xl">
          <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-2xl bg-white/80 backdrop-blur-sm">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=1200" 
              alt="Farmers collaborating" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -right-8 -bottom-8 hidden md:block">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="font-medium text-green-700">Live Exchange</p>
              </div>
              <p className="text-sm text-gray-600">
                235+ farmers actively trading in your region
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
