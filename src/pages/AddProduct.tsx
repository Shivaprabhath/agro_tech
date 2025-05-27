
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/products/ProductForm";
import { createProduct } from "@/services/productService";

const AddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true);
    
    try {
      await createProduct(productData);
      
      toast({
        title: t('products.productAdded'),
        description: `${productData.title} ${t('products.addedToMarketplace')}`,
      });
      
      navigate("/marketplace");
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: t('products.error'),
        description: t('products.addProductError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          <ProductForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={t('products.addProduct')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
