
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, BarChart3, Share2 } from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();
  
  const featureItems = [
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: t('home.features.sharing.title'),
      description: t('home.features.sharing.description'),
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      title: t('home.features.insights.title'),
      description: t('home.features.insights.description'),
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t('home.features.community.title'),
      description: t('home.features.community.description'),
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: t('home.features.planning.title'),
      description: t('home.features.planning.description'),
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            {t('home.features.heading')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.features.subheading')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureItems.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-6 rounded-xl bg-neutral text-center hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-5 p-4 rounded-full bg-primary-50">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
