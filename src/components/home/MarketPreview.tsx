
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CropCard, { CropItem } from '../marketplace/CropCard';

const MarketPreview = () => {
  const { t } = useTranslation();
  
  const featuredCrops: CropItem[] = [
    {
      id: '1',
      title: t('home.marketPreview.crops.tomatoes.title'),
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500',
      price: t('home.marketPreview.crops.tomatoes.price'),
      quantity: '50',
      unit: 'kg',
      location: t('home.marketPreview.crops.tomatoes.location'),
      distance: t('home.marketPreview.crops.tomatoes.distance'),
      sellerId: 'farmer1',
      sellerName: t('home.marketPreview.crops.tomatoes.seller'),
      tradeOption: 'sell'
    },
    {
      id: '2',
      title: t('home.marketPreview.crops.corn.title'),
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=500',
      price: t('home.marketPreview.crops.corn.price'),
      quantity: '30',
      unit: 'dozen',
      location: t('home.marketPreview.crops.corn.location'),
      distance: t('home.marketPreview.crops.corn.distance'),
      sellerId: 'farmer2',
      sellerName: t('home.marketPreview.crops.corn.seller'),
      tradeOption: 'both'
    },
    {
      id: '3',
      title: t('home.marketPreview.crops.lettuce.title'),
      imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=500',
      price: t('home.marketPreview.crops.lettuce.price'),
      quantity: '100',
      unit: 'heads',
      location: t('home.marketPreview.crops.lettuce.location'),
      distance: t('home.marketPreview.crops.lettuce.distance'),
      sellerId: 'farmer3',
      sellerName: t('home.marketPreview.crops.lettuce.seller'),
      tradeOption: 'barter'
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-neutral">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              {t('home.marketPreview.heading')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              {t('home.marketPreview.subheading')}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/marketplace">
                {t('home.marketPreview.viewAll')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCrops.map(crop => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketPreview;
