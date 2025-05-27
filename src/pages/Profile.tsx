import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { fetchUserProfile, updateUserProfile } from "@/services/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  User,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  MapPinIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  locationString: z.string().optional(),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      phoneNumber: "",
      latitude: "",
      longitude: "",
      locationString: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const data = await fetchUserProfile();
        setProfile(data);

        form.reset({
          name: data.name || "",
          email: data.email || "",
          businessName: data.businessName || "",
          phoneNumber: data.phoneNumber || "",
          latitude: data.location?.coordinates?.[1]?.toString() || "",
          longitude: data.location?.coordinates?.[0]?.toString() || "",
          locationString: data.locationString || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
        businessName: profile.businessName || "",
        phoneNumber: profile.phoneNumber || "",
        latitude: profile.location?.coordinates?.[1]?.toString() || "",
        longitude: profile.location?.coordinates?.[0]?.toString() || "",
        locationString: profile.locationString || "",
      });
    }
    setIsEditing(false);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString());
          form.setValue("longitude", position.coords.longitude.toString());
          toast({
            title: "Location Updated",
            description: "Your current location has been set",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description:
              "Failed to get your location. Please ensure location access is enabled.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      const lat = data.latitude ? parseFloat(data.latitude) : undefined;
      const lng = data.longitude ? parseFloat(data.longitude) : undefined;

      const updateData = {
        ...data,
        location: {
          type: "Point",
          coordinates: [lng, lat].filter(
            (coord) => coord !== undefined
          ) as number[],
        },
        locationString: data.locationString || "",
      };

      const updatedProfile = await updateUserProfile(updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">
              Unable to load profile. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="profile-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Full Name"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Business */}
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Business Name"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone Number"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Latitude */}
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Latitude"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Longitude */}
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Longitude"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Location String */}
                    <FormField
                      control={form.control}
                      name="locationString"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Location Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="E.g., Guwahati, Assam"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      className="w-full md:w-auto"
                    >
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      Get Current Location
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" form="profile-form">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-xl">
                  {profile?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
              <div className="mt-4 w-full space-y-4">
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Role
                  </p>
                  <p className="capitalize">{profile.role}</p>
                </div>
                {profile.businessName && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Business
                    </p>
                    <p>{profile.businessName}</p>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                    <p>{profile.phoneNumber}</p>
                  </div>
                )}
                {profile.locationString && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location Description
                    </p>
                    <p>{profile.locationString}</p>
                  </div>
                )}
                {profile.location?.coordinates && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Coordinates
                    </p>
                    <p>Lat: {profile.location.coordinates[1]}</p>
                    <p>Long: {profile.location.coordinates[0]}</p>
                  </div>
                )}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </p>
                  <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
