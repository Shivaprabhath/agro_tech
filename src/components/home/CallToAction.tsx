
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 md:py-20 bg-primary-800 text-white">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
            {t('callToAction.title')}
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('callToAction.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-800 hover:bg-primary-50 text-base"
            >
              <Link to="/register">{t('callToAction.createAccount')}</Link>
            </Button>
            <Button
              asChild
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10 text-base"
            >
              <Link to="/about">{t('callToAction.learnMore')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
