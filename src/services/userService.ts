import { toast } from "@/hooks/use-toast";

interface UserUpdate {
  name?: string;
  email?: string;
  businessName?: string;
  phoneNumber?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    toast({
      title: "Error",
      description: "Failed to fetch user profile",
      variant: "destructive"
    });
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<User>) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // Ensure coordinates are numbers and create proper location object
    if (userData.location && userData.location.coordinates) {
      userData.location = {
        type: "Point",
        coordinates: userData.location.coordinates
          .filter(coord => coord !== null && coord !== undefined)
          .map(coord => typeof coord === 'string' ? parseFloat(coord) : coord)
      };
    }

    const response = await fetch("http://localhost:5000/api/auth/update", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
