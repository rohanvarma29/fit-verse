
import React, { useState, ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PersonalInfoSectionProps {
  user: {
    _id: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    bio?: string;
    profilePhoto?: string;
    socialMedia?: string;
  } | null;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ user }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [socialMedia, setSocialMedia] = useState(user?.socialMedia || "");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  if (!user) return null;

  // When user changes file input for profile photo
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      const previewURL = URL.createObjectURL(file);
      setProfilePhotoPreview(previewURL);
      // Placeholder: here should call API to upload photo and update immediately or on confirm
      console.log("Selected new profile photo file:", file);
    }
  };

  // Placeholder save function for each field
  const handleSave = (field: string) => {
    console.log("Save field:", field);
    // Here would be the API call for updating this field
    setEditingField(null);
    // Update local states or refetch user after saving, for now just log
  };

  // Handle cancel editing and revert changes
  const handleCancel = (field: string) => {
    setEditingField(null);
    if (field === "displayName") setDisplayName(user?.displayName || "");
    else if (field === "location") setLocation(user?.location || "");
    else if (field === "bio") setBio(user?.bio || "");
    else if (field === "socialMedia") setSocialMedia(user?.socialMedia || "");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gunmetal">Personal Information</h2>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                {profilePhotoPreview ? (
                  <AvatarImage
                    src={profilePhotoPreview}
                    alt="Profile preview"
                    className="object-cover"
                  />
                ) : user.profilePhoto ? (
                  <AvatarImage
                    src={user.profilePhoto}
                    alt={user.displayName}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-cambridge text-alabaster text-4xl">
                    {user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor="profile-photo-upload"
                className="absolute bottom-0 right-0 bg-cambridge text-white p-1.5 rounded-full cursor-pointer shadow-md hover:bg-cambridge/90 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </label>
              <input
                type="file"
                id="profile-photo-upload"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => {
                if (profilePhotoFile) {
                  // Here would be API call to save profile photo
                  console.log("Uploading photo:", profilePhotoFile);
                }
              }}
              disabled={!profilePhotoFile}
            >
              {profilePhotoFile ? "Save Photo" : "Change Photo"}
            </Button>
          </div>

          {/* Profile Fields */}
          <div className="flex-1 space-y-4">
            {/* Display Name */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gunmetal">
                  Display Name
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cambridge hover:text-cambridge/80 p-1 h-auto"
                  onClick={() => setEditingField("displayName")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              {editingField === "displayName" ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave("displayName")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel("displayName")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gunmetal">{user.displayName}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gunmetal">
                  Location
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cambridge hover:text-cambridge/80 p-1 h-auto"
                  onClick={() => setEditingField("location")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              {editingField === "location" ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave("location")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel("location")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gunmetal">
                  {user.location || (
                    <span className="italic text-timberwolf">
                      No location set
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gunmetal">
                  Bio
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cambridge hover:text-cambridge/80 p-1 h-auto"
                  onClick={() => setEditingField("bio")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              {editingField === "bio" ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full border border-timberwolf rounded-md px-3 py-2 text-gunmetal placeholder:text-timberwolf focus:outline-none focus:ring-2 focus:ring-cambridge transition min-h-[120px]"
                    placeholder="Write a bit about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave("bio")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel("bio")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gunmetal whitespace-pre-wrap">
                  {user.bio || (
                    <span className="italic text-timberwolf">
                      No bio yet. Click 'Edit' to tell clients about yourself.
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Social Media */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gunmetal">
                  Social Media
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cambridge hover:text-cambridge/80 p-1 h-auto"
                  onClick={() => setEditingField("socialMedia")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
              {editingField === "socialMedia" ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition"
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(e.target.value)}
                    placeholder="Instagram handle or URL"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave("socialMedia")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel("socialMedia")}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gunmetal">
                  {user.socialMedia ? (
                    <a
                      href={
                        user.socialMedia.startsWith("http")
                          ? user.socialMedia
                          : `https://instagram.com/${user.socialMedia}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cambridge hover:underline"
                    >
                      {user.socialMedia}
                    </a>
                  ) : (
                    <span className="italic text-timberwolf">
                      No social media linked
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PersonalInfoSection;
