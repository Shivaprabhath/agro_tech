
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { fetchUserProducts, deleteProduct } from "@/services/productService";
import { useTranslation } from "react-i18next";

const MyProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchUserProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: t('products.error'),
          description: t('products.addProductError'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast, user, t]);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm(t('products.confirmDelete'))) {
      return;
    }

    try {
      await deleteProduct(productId);

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      toast({
        title: t('products.productDeleted'),
        description: t('products.deleteSuccess'),
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: t('products.error'),
        description: t('products.deleteError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-semibold mb-6">{t('common.myProducts')}</h1>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p>{t('marketplace.loading')}</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="text-center">
            <CardContent>
              <p className="text-lg">{t('products.noProducts')}</p>
              <Button onClick={() => navigate("/add-product")}>
                {t('products.addProduct')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="relative">
                <CardContent className="relative h-48">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <h2 className="text-xl font-semibold mb-2">
                    {product.title}
                  </h2>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-4">
                    <span className="text-primary font-medium">
                      ${product.price}
                    </span>
                    <span className="text-gray-500"> / {product.unit}</span>
                  </div>
                </CardContent>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Link to={`/edit-product/${product._id}`}>
                    <Button size="icon" variant="secondary">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyProducts;
