
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Instagram, Edit, User, X, Check } from "lucide-react";

// Mock API function - replace with actual API calls
const updateUserProfile = async (field: string, value: string | File) => {
  // This would be replaced with actual API calls to update the user profile
  console.log(`Updating ${field} with:`, value);
  return { success: true };
};

type UserProfile = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  location: string;
  bio: string;
  socialMedia: string;
  profilePhoto: string | null;
};

const ExpertProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [editState, setEditState] = useState<{
    displayName: boolean;
    location: boolean;
    bio: boolean;
    socialMedia: boolean;
  }>({
    displayName: false,
    location: false,
    bio: false,
    socialMedia: false,
  });

  // Mock user data - in a real app, this would come from an API or context
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    displayName: "Coach John",
    email: "john.doe@example.com",
    location: "New York, NY",
    bio: "Certified personal trainer with 10 years of experience in strength training and nutrition coaching. I specialize in helping clients achieve sustainable fitness results through personalized workout plans and dietary guidance.",
    socialMedia: "coach_john",
    profilePhoto: null,
  });

  // Toggle edit state for a specific field
  const toggleEdit = (field: keyof typeof editState) => {
    setEditState((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle field updates
  const handleUpdate = async (field: keyof UserProfile, value: string) => {
    setLoading(true);
    try {
      const response = await updateUserProfile(field, value);
      
      if (response.success) {
        setProfile((prev) => ({
          ...prev,
          [field]: value,
        }));
        
        toggleEdit(field as keyof typeof editState);
        
        toast({
          title: "Success",
          description: `Your ${field} has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile photo update
  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        profilePhoto: previewUrl,
      }));

      // In a real app, you would upload the file to your server here
      const response = await updateUserProfile("profilePhoto", file);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Your profile photo has been updated.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile photo. Please try again.",
        variant: "destructive",
      });
      // Revert the preview
      setProfile((prev) => ({
        ...prev,
        profilePhoto: null,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing without saving
  const cancelEdit = (field: keyof typeof editState) => {
    toggleEdit(field);
  };

  return (
    <div className="min-h-screen bg-alabaster">
      {/* Header with navbar - just imported for continuity */}
      <div className="w-full bg-alabaster border-b border-timberwolf shadow-sm">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gunmetal">Expert Profile</h1>
          <p className="text-gunmetal/70">
            Manage your professional profile information
          </p>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Photo and Name Card */}
          <Card className="mb-8 overflow-hidden border-timberwolf bg-white/70 backdrop-blur-sm">
            <div className="relative h-32 bg-gradient-to-r from-cambridge to-cambridge/60">
              <div className="absolute -bottom-16 left-6 p-1 bg-white rounded-full shadow-md">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white">
                    <AvatarImage src={profile.profilePhoto || ""} />
                    <AvatarFallback className="bg-cambridge/20 text-cambridge">
                      <User className="h-16 w-16" />
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoUpdate}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>
            </div>
            <CardContent className="pt-20 pb-6">
              <div className="space-y-6">
                {/* Display Name */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {editState.displayName ? (
                    <div className="flex-1 space-y-2">
                      <label htmlFor="displayName" className="form-label">
                        Display Name
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="displayName"
                          defaultValue={profile.displayName}
                          className="form-input flex-1"
                          placeholder="How clients will see your name"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => cancelEdit("displayName")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => {
                            const input = document.getElementById("displayName") as HTMLInputElement;
                            handleUpdate("displayName", input.value);
                          }}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gunmetal">
                        {profile.displayName}
                      </h2>
                      <p className="text-gunmetal/70">
                        {profile.firstName} {profile.lastName}
                      </p>
                    </div>
                  )}
                  {!editState.displayName && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-cambridge border-cambridge hover:bg-cambridge/10"
                      onClick={() => toggleEdit("displayName")}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Name
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="mb-8 border-timberwolf bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gunmetal mb-4">
                Profile Details
              </h3>
              <div className="space-y-6">
                {/* Location */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gunmetal">Location</h4>
                    {!editState.location && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-cambridge hover:bg-cambridge/10"
                        onClick={() => toggleEdit("location")}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {editState.location ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          defaultValue={profile.location}
                          className="form-input flex-1"
                          placeholder="City, State"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => cancelEdit("location")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => {
                            const input = document.getElementById("location") as HTMLInputElement;
                            handleUpdate("location", input.value);
                          }}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-gunmetal/80">
                      <MapPin className="h-4 w-4 mr-1 text-cambridge" />
                      {profile.location || (
                        <span className="text-gunmetal/50 italic">Add your location</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Media */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gunmetal">Social Media</h4>
                    {!editState.socialMedia && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-cambridge hover:bg-cambridge/10"
                        onClick={() => toggleEdit("socialMedia")}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {profile.socialMedia ? "Edit" : "Add"}
                      </Button>
                    )}
                  </div>
                  {editState.socialMedia ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="socialMedia"
                          defaultValue={profile.socialMedia}
                          className="form-input flex-1"
                          placeholder="Instagram handle (without @)"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => cancelEdit("socialMedia")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => {
                            const input = document.getElementById("socialMedia") as HTMLInputElement;
                            handleUpdate("socialMedia", input.value);
                          }}
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-gunmetal/80">
                      {profile.socialMedia ? (
                        <>
                          <Instagram className="h-4 w-4 mr-1 text-cambridge" />
                          <a
                            href={`https://instagram.com/${profile.socialMedia}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cambridge hover:underline"
                          >
                            @{profile.socialMedia}
                          </a>
                        </>
                      ) : (
                        <span className="text-gunmetal/50 italic">Add your social media handle</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gunmetal">Bio</h4>
                    {!editState.bio && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-cambridge hover:bg-cambridge/10"
                        onClick={() => toggleEdit("bio")}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {profile.bio ? "Edit" : "Add"}
                      </Button>
                    )}
                  </div>
                  {editState.bio ? (
                    <div className="space-y-2">
                      <Textarea
                        id="bio"
                        defaultValue={profile.bio}
                        className="form-input resize-none"
                        placeholder="Tell potential clients about yourself (training experience, certifications, specialties)"
                        rows={4}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => cancelEdit("bio")}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const textarea = document.getElementById("bio") as HTMLTextAreaElement;
                            handleUpdate("bio", textarea.value);
                          }}
                          disabled={loading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gunmetal/80 prose-sm max-w-none">
                      {profile.bio ? (
                        <p>{profile.bio}</p>
                      ) : (
                        <p className="text-gunmetal/50 italic">
                          No bio yet. Click 'Edit' to tell clients about yourself.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings Card - could expand this in the future */}
          <Card className="border-timberwolf bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-gunmetal mb-4">
                Account Settings
              </h3>
              <div className="flex justify-between items-center text-gunmetal/80">
                <div className="space-y-1">
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm">{profile.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-cambridge border-cambridge hover:bg-cambridge/10"
                  onClick={() => navigate("/account/security")}
                >
                  Change Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
