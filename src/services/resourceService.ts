
import { ResourceFormData } from "@/components/resources/ResourceForm";
import { ResourceItem } from "@/components/marketplace/ResourceCard";

// Create a new resource
export const createResource = async (resourceData: ResourceFormData): Promise<any> => {
  const response = await fetch("http://localhost:5000/api/resources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(resourceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add resource");
  }

  return response.json();
};

// Fetch a specific resource
export const fetchResource = async (resourceId: string): Promise<ResourceFormData> => {
  const response = await fetch(
    `http://localhost:5000/api/resources/${resourceId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch resource");
  }

  return response.json();
};

// Update a resource
export const updateResource = async (
  resourceId: string,
  resourceData: ResourceFormData
): Promise<any> => {
  const response = await fetch(
    `http://localhost:5000/api/resources/${resourceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(resourceData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update resource");
  }

  return response.json();
};

// Fetch all resources (for marketplace)
export const fetchAllResources = async (): Promise<ResourceItem[]> => {
  const response = await fetch("http://localhost:5000/api/resources/all", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch resources");
  }

  return response.json();
};

// Fetch user's own resources
export const fetchUserResources = async (): Promise<ResourceItem[]> => {
  const response = await fetch("http://localhost:5000/api/resources/user/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user resources");
  }

  return response.json();
};

// Delete a resource
export const deleteResource = async (resourceId: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:5000/api/resources/${resourceId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete resource");
  }
};

// Send a resource request
export const sendResourceRequest = async (requestData: any): Promise<any> => {
  const response = await fetch("http://localhost:5000/api/resources/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to send request");
  }

  return response.json();
};

// Fetch received resource requests
export const fetchReceivedRequests = async (): Promise<any[]> => {
  const response = await fetch("http://localhost:5000/api/resources/requests/received", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch received requests");
  }

  return response.json();
};

// Fetch sent resource requests
export const fetchSentRequests = async (): Promise<any[]> => {
  const response = await fetch("http://localhost:5000/api/resources/requests/sent", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch sent requests");
  }

  return response.json();
};

// Update request status
export const updateRequestStatus = async (requestId: string, status: string): Promise<any> => {
  const response = await fetch(
    `http://localhost:5000/api/resources/requests/${requestId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update request status");
  }

  return response.json();
};
