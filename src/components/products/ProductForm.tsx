
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  quantity: string;
  unit: string;
  tradeOption: string;
  imageUrl: string;
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (productData: ProductFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  cancelPath?: string;
}

const ProductForm = ({
  initialData = {
    title: "",
    description: "",
    price: "",
    quantity: "",
    unit: "kg",
    tradeOption: "sell",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=500"
  },
  onSubmit,
  submitButtonText,
  isSubmitting,
  cancelPath = '/marketplace'
}: ProductFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.title || !product.price || !product.quantity) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSubmit(product);
    } catch (error) {
      console.error('Error with product form submission:', error);
      toast({
        title: "Error",
        description: "Failed to process product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{submitButtonText === "Add Product" ? "Add New Product" : "Edit Product"}</CardTitle>
        <CardDescription>
          {submitButtonText === "Add Product" 
            ? "List your agricultural products to sell or barter with others" 
            : "Update your agricultural product listing"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product Name *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Organic Tomatoes"
              value={product.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product (quality, variety, etc.)"
              value={product.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                placeholder="e.g. $2.50/kg"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tradeOption">Trade Option *</Label>
              <Select 
                value={product.tradeOption} 
                onValueChange={(value) => handleSelectChange('tradeOption', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sell">For Sale Only</SelectItem>
                  <SelectItem value="barter">For Barter Only</SelectItem>
                  <SelectItem value="both">Both Sale and Barter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                placeholder="e.g. 50"
                value={product.quantity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select 
                value={product.unit} 
                onValueChange={(value) => handleSelectChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="bunch">Bunches</SelectItem>
                  <SelectItem value="dozen">Dozen</SelectItem>
                  <SelectItem value="crate">Crates</SelectItem>
                  <SelectItem value="basket">Baskets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Product Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={product.imageUrl}
              onChange={handleChange}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(cancelPath)}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (submitButtonText === "Add Product" ? "Adding..." : "Updating...") : submitButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
