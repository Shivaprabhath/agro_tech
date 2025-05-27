
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CropItem {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  quantity: string;
  unit: string;
  location: string;
  distance: string;
  sellerId: string;
  sellerName: string;
  tradeOption: 'sell' | 'barter' | 'both';
}

interface CropCardProps {
  crop: CropItem;
}

const CropCard: React.FC<CropCardProps> = ({ crop }) => {
  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={crop.imageUrl} 
          alt={crop.title}
          className="w-full h-full object-cover rounded-t-xl" 
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            crop.tradeOption === 'sell' 
              ? 'bg-green-100 text-green-800' 
              : crop.tradeOption === 'barter' 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {crop.tradeOption === 'sell' 
              ? 'For Sale' 
              : crop.tradeOption === 'barter' 
              ? 'For Barter'
              : 'Sale/Barter'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1">{crop.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{crop.location} • {crop.distance}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-neutral p-2 rounded text-center">
            <span className="block text-sm text-gray-500">Price</span>
            <span className="font-semibold text-primary">{crop.price}</span>
          </div>
          <div className="bg-neutral p-2 rounded text-center">
            <span className="block text-sm text-gray-500">Quantity</span>
            <span className="font-semibold">{crop.quantity} {crop.unit}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-gray-500">Posted by:</span> {crop.sellerName}
        </div>
        <div className="mt-auto flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/marketplace/${crop.id}`}>View Details</Link>
          </Button>
          <Button className="flex-1">Contact Farmer</Button>
        </div>
      </div>
    </div>
  );
};

export default CropCard;
