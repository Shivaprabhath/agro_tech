
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { sendResourceRequest } from '@/services/resourceService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ResourceItem {
  _id: string;
  title: string;
  imageUrl: string;
  price: string;
  priceType: 'per-day' | 'per-week' | 'per-month' | 'fixed';
  availability: string;
  condition: 'New' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  location: string;
  description?: string;
  ownerId: string;
  ownerName: string;
}

interface ResourceCardProps {
  resource: ResourceItem;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    message: '',
    paymentType: 'money',
    paymentDetails: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3))
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateSelect = (field: string, date: Date | undefined) => {
    if (date) {
      setRequestForm(prev => ({ ...prev, [field]: date }));
    }
  };
  
  const handleRequest = async (closeDialog: () => void) => {
    if (!requestForm.message || !requestForm.paymentDetails) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        resourceId: resource._id,
        resourceTitle: resource.title,
        ownerId: resource.ownerId,
        ownerName: resource.ownerName,
        message: requestForm.message,
        startDate: requestForm.startDate,
        endDate: requestForm.endDate,
        paymentType: requestForm.paymentType,
        paymentDetails: requestForm.paymentDetails
      };
      
      await sendResourceRequest(requestData);
      
      toast({
        title: "Request Sent!",
        description: `Your request for ${resource.title} has been sent to ${resource.ownerName}`,
      });
      
      closeDialog();
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show request button if resource is owned by current user
  const isOwnResource = resource.ownerId === user?.id;
  
  return (
    <div className="card h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={resource.imageUrl} 
          alt={resource.title}
          className="w-full h-full object-cover rounded-t-xl" 
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resource.condition === 'New' || resource.condition === 'Excellent'
              ? 'bg-green-100 text-green-800' 
              : resource.condition === 'Good'
              ? 'bg-blue-100 text-blue-800'
              : resource.condition === 'Fair'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {resource.condition}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{resource.location}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-primary">{resource.price}</span>
          <span className="text-gray-500 text-sm"> {resource.priceType === 'fixed' ? '' : `/ ${resource.priceType.split('-')[1]}`}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Available: {resource.availability}</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-gray-500">Owner:</span> {resource.ownerName}
        </div>
        <div className="mt-auto flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/resources/${resource._id}`}>View Details</Link>
          </Button>
          
          {!isOwnResource && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1">Request</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Request {resource.title}</DialogTitle>
                  <DialogDescription>
                    Fill out the form to request this resource from {resource.ownerName}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dates">Rental Period</Label>
                    <div className="flex flex-wrap gap-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Start Date</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[140px] justify-start text-left font-normal"
                            >
                              {format(requestForm.startDate, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={requestForm.startDate}
                              onSelect={(date) => handleDateSelect('startDate', date)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">End Date</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[140px] justify-start text-left font-normal"
                            >
                              {format(requestForm.endDate, "PPP")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={requestForm.endDate}
                              onSelect={(date) => handleDateSelect('endDate', date)}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Payment Type</Label>
                    <RadioGroup 
                      defaultValue="money" 
                      value={requestForm.paymentType}
                      onValueChange={(value) => setRequestForm(prev => ({ ...prev, paymentType: value }))}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="money" id="money" />
                        <Label htmlFor="money" className="font-normal">Money Payment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="barter" id="barter" />
                        <Label htmlFor="barter" className="font-normal">Barter Trade</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentDetails">
                      {requestForm.paymentType === 'money' ? 'Budget/Offer' : 'What you can offer in exchange'}
                    </Label>
                    <Input
                      id="paymentDetails"
                      name="paymentDetails"
                      placeholder={requestForm.paymentType === 'money' 
                        ? "Enter your budget or offer amount"
                        : "Describe what you can offer in exchange"}
                      value={requestForm.paymentDetails}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message to Owner</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Introduce yourself and explain why you need this resource"
                      value={requestForm.message}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    disabled={isSubmitting}
                    onClick={(e) => {
                      e.preventDefault();
                      const closeDialog = () => {
                        document.querySelector('[data-DialogClose]')?.dispatchEvent(
                          new MouseEvent('click', { bubbles: true })
                        );
                      };
                      handleRequest(closeDialog);
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {isOwnResource && (
            <Button className="flex-1" variant="outline" asChild>
              <Link to={`/edit-resource/${resource._id}`}>Edit</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
