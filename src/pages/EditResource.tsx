
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import ResourceForm, { ResourceFormData } from "@/components/resources/ResourceForm";
import { useAuth } from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireFarmer from "@/components/auth/RequireFarmer";
import { fetchResource, updateResource } from "@/services/resourceService";

// Define an interface for the API resource data including ownerId
interface ResourceApiData extends ResourceFormData {
  ownerId?: string;
}

const EditResource = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState<ResourceFormData | null>(null);

  useEffect(() => {
    const loadResource = async () => {
      try {
        if (!id) return;
        
        const resourceData = await fetchResource(id) as ResourceApiData;
        console.log("Resource data:", resourceData);
        
        // Verify the resource belongs to the current user
        if (resourceData.ownerId && resourceData.ownerId !== user?.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this resource",
            variant: "destructive"
          });
          navigate('/my-resources');
          return;
        }
        
        // Remove ownerId before setting to avoid TypeScript errors
        const { ownerId, ...resourceFormData } = resourceData;
        setResource(resourceFormData);
      } catch (error) {
        console.error('Error fetching resource:', error);
        toast({
          title: "Error",
          description: "Could not load resource details",
          variant: "destructive"
        });
        navigate('/my-resources');
      } finally {
        setIsLoading(false);
      }
    };

    loadResource();
  }, [id, navigate, toast, user]);

  const handleSubmit = async (resourceData: ResourceFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!id) return;
      
      await updateResource(id, resourceData);
      
      toast({
        title: "Resource updated!",
        description: `${resourceData.title} has been updated successfully`,
      });
      
      navigate("/my-resources");
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
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
                <p className="mt-4 text-lg">Loading resource information...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!resource) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-xl text-red-500">Resource not found</p>
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
          <ResourceForm 
            initialData={resource}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Update Resource"
            cancelPath="/my-resources"
          />
        </div>
      </div>
    </Layout>
  );
};

export default function ProtectedEditResource() {
  return (
    <RequireAuth>
      <RequireFarmer>
        <EditResource />
      </RequireFarmer>
    </RequireAuth>
  );
}
