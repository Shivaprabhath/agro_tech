
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireFarmer from "@/components/auth/RequireFarmer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ResourceItem } from "@/components/marketplace/ResourceCard";
import { fetchUserResources, deleteResource } from "@/services/resourceService";
import { useTranslation } from "react-i18next";

const MyResources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const data = await fetchUserResources();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast({
          title: t('resources.error'),
          description: t('resources.addResourceError'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [toast, t]);

  const handleDeleteResource = async (resourceId: string) => {
    if (!window.confirm(t('resources.confirmDelete'))) {
      return;
    }

    try {
      await deleteResource(resourceId);

      setResources((prevResources) =>
        prevResources.filter((resource) => resource._id !== resourceId)
      );

      toast({
        title: t('resources.resourceDeleted'),
        description: t('resources.deleteSuccess'),
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: t('resources.error'),
        description: t('resources.deleteError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">{t('common.myResources')}</h1>
          <Button onClick={() => navigate("/add-resource")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t('resources.addResource')}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p>{t('marketplace.loading')}</p>
          </div>
        ) : resources.length === 0 ? (
          <Card className="text-center">
            <CardContent className="py-8">
              <p className="text-lg mb-4">{t('resources.noResources')}</p>
              <Button onClick={() => navigate("/add-resource")}>
                {t('resources.addFirstResource')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Card key={resource._id} className="relative">
                <CardContent className="relative p-0">
                  <div className="h-48">
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      {resource.location} • {resource.availability}
                    </p>
                    <div className="mb-2">
                      <span className="font-semibold text-primary">{resource.price}</span>
                      <span className="text-gray-500 text-sm"> {resource.priceType === 'fixed' ? '' : `/ ${resource.priceType.split('-')[1]}`}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Link to={`/edit-resource/${resource._id}`}>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Pencil className="h-4 w-4" /> {t('resources.edit')}
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteResource(resource._id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> {t('resources.delete')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default function ProtectedMyResources() {
  return (
    <RequireAuth>
      <RequireFarmer>
        <MyResources />
      </RequireFarmer>
    </RequireAuth>
  );
}
