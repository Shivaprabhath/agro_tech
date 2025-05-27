
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import ProductForm, { ProductFormData } from "@/components/products/ProductForm";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProduct, updateProduct } from "@/services/productService";

// Define an interface for the API product data including sellerId
interface ProductApiData extends ProductFormData {
  sellerId?: string;
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductFormData | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        
        const productData = await fetchProduct(id) as ProductApiData;
        console.log("Product data:", productData);
        
        // Verify the product belongs to the current user
        if (productData.sellerId && productData.sellerId !== user?.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this product",
            variant: "destructive"
          });
          navigate('/my-products');
          return;
        }
        
        // Remove sellerId before setting to avoid TypeScript errors with ProductFormData
        const { sellerId, ...productFormData } = productData;
        setProduct(productFormData);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive"
        });
        navigate('/my-products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate, toast, user]);

  const handleSubmit = async (productData: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!id) return;
      
      await updateProduct(id, productData);
      
      toast({
        title: "Product updated!",
        description: `${productData.title} has been updated successfully`,
      });
      
      navigate("/my-products");
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-lg">Loading product information...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-xl text-red-500">Product not found</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          <ProductForm 
            initialData={product}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Update Product"
            cancelPath="/my-products"
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
