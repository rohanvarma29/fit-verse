import React, { useState, ChangeEvent } from "react";
import {
  MapPin,
  Pencil,
  Loader2,
  Link as IconLink,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useParams, useNavigate } from "react-router-dom";

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useUser(id || "");

  // Local state for inline editing toggles
  const [editingField, setEditingField] = useState<string | null>(null);

  // Temporary local state to hold form inputs before "saving"
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [socialMedia, setSocialMedia] = useState(user?.socialMedia || "");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-cambridge" />
          <span className="text-lg text-gunmetal">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="p-6 max-w-md w-full text-center">
          <p className="text-lg text-red-600">
            {error || "Failed to load user profile"}
          </p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 md:px-12">
      {/* Header Section */}
      <div className="container mx-auto max-w-4xl bg-alabaster rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Profile Photo */}
          <div className="relative w-40 h-40 rounded-full border-4 border-white bg-accent-muted flex-shrink-0 shadow-md cursor-pointer">
            <label
              htmlFor="profile-photo-upload"
              className="block w-full h-full rounded-full overflow-hidden"
            >
              {profilePhotoPreview ? (
                <img
                  src={profilePhotoPreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-accent-muted text-6xl font-bold text-gunmetal select-none">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </label>
            {/* Hidden file input */}
            <input
              type="file"
              id="profile-photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-cambridge bg-opacity-80 text-white py-1 text-center text-sm font-semibold rounded-b-full hover:bg-cambridge/90 transition-colors select-none">
              Click to Change Photo
            </div>
          </div>

          {/* Info Fields */}
          <div className="flex-1 w-full">
            {/* Display Name */}
            <div className="mb-6">
              <h2 className="flex items-center text-3xl font-bold text-gunmetal gap-3">
                {editingField === "displayName" ? (
                  <>
                    <input
                      type="text"
                      className="w-full border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-3"
                      onClick={() => handleSave("displayName")}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleCancel("displayName")}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span>{user.displayName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit display name"
                      className="text-cambridge hover:text-cambridge/80"
                      onClick={() => setEditingField("displayName")}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </h2>
            </div>

            {/* Location */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center text-cambridge text-base font-medium flex-shrink-0 gap-2">
                <MapPin className="h-5 w-5" />
                {editingField === "location" ? (
                  <input
                    type="text"
                    className="border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition w-full max-w-xs"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span>
                    {user.location || (
                      <span className="italic text-timberwolf">
                        No location set
                      </span>
                    )}
                  </span>
                )}
              </div>
              {editingField === "location" ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit location"
                  className="text-cambridge hover:text-cambridge/80"
                  onClick={() => setEditingField("location")}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Social Media */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center text-cambridge text-base font-medium flex-shrink-0 gap-2">
                <Instagram className="h-5 w-5" />
                {editingField === "socialMedia" ? (
                  <input
                    type="text"
                    placeholder="Enter Instagram handle or URL"
                    className="border border-timberwolf rounded-md px-3 py-2 text-gunmetal focus:outline-none focus:ring-2 focus:ring-cambridge transition w-full max-w-xs"
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(e.target.value)}
                    autoFocus
                  />
                ) : user.socialMedia ? (
                  <a
                    href={
                      user.socialMedia.startsWith("http")
                        ? user.socialMedia
                        : `https://instagram.com/${user.socialMedia}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-cambridge"
                  >
                    {user.socialMedia}
                  </a>
                ) : (
                  <span className="italic text-timberwolf">
                    No social media linked
                  </span>
                )}
              </div>
              {editingField === "socialMedia" ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit social media"
                  className="text-cambridge hover:text-cambridge/80"
                  onClick={() => setEditingField("socialMedia")}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-cambridge">About Me</h3>
            {editingField === "bio" ? (
              <>
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
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit bio"
                className="text-cambridge hover:text-cambridge/80"
                onClick={() => setEditingField("bio")}
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
          </div>
          {editingField === "bio" ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-timberwolf rounded-md p-3 text-gunmetal placeholder:text-timberwolf focus:outline-none focus:ring-2 focus:ring-cambridge transition min-h-[120px]"
              placeholder="Write a bit about yourself"
              autoFocus
            />
          ) : (
            <p className="text-gunmetal whitespace-pre-wrap min-h-[120px]">
              {user.bio || (
                <span className="italic text-timberwolf">
                  No bio yet. Click ‘Edit’ to tell clients about yourself.
                </span>
              )}
            </p>
          )}
        </section>
        <Button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ExpertProfile;
