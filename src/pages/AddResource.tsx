
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireFarmer from "@/components/auth/RequireFarmer";
import ResourceForm, { ResourceFormData } from "@/components/resources/ResourceForm";
import { createResource } from "@/services/resourceService";

const AddResource = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (resourceData: ResourceFormData) => {
    setIsSubmitting(true);
    
    try {
      await createResource(resourceData);
      
      toast({
        title: t('resources.resourceAdded'),
        description: `${resourceData.title} ${t('resources.addedSuccessfully')}`,
      });
      
      navigate("/my-resources");
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: t('resources.error'),
        description: t('resources.addResourceError'),
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
          <ResourceForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText={t('resources.addResource')}
            cancelPath="/my-resources"
          />
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedAddResource() {
  return (
    <RequireAuth>
      <RequireFarmer>
        <AddResource />
      </RequireFarmer>
    </RequireAuth>
  );
}
