import { MapPin, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { useParams } from "react-router-dom";

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  console.log("Fetching user data for id:", id);
  const { user, loading, error } = useUser(id || "");
  console.log("User data:", user, "loading:", loading, "error:", error);
  const handleEdit = () => {
    // Stub for future edit functionality
    console.log("Edit clicked");
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-6">
          <p className="text-lg text-red-600">
            {error || "Failed to load user profile"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="w-full bg-alabaster px-4 py-8 md:py-12">
        <div className="container mx-auto">
          <div className="relative flex flex-col items-center md:flex-row md:items-start md:space-x-8">
            {/* Edit Button for Hero */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 text-cambridge hover:text-cambridge/80"
              onClick={handleEdit}
            >
              <Pencil className="h-5 w-5" />
            </Button>

            {/* Profile Photo */}
            <div className="mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-accent-muted md:mb-0">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent-muted text-4xl text-gunmetal">
                  {user.displayName.charAt(0)}
                </div>
              )}
            </div>

            {/* Name and Location */}
            <div className="text-center md:text-left">
              <h1 className="mb-2 text-3xl font-bold text-gunmetal">
                {user.displayName}
              </h1>
              {user.location && (
                <div className="flex items-center justify-center gap-1 text-cambridge md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="container mx-auto px-4 py-8">
        <Card className="relative bg-timberwolf p-6">
          {/* Edit Button for Bio */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-cambridge hover:text-cambridge/80"
            onClick={handleEdit}
          >
            <Pencil className="h-5 w-5" />
          </Button>

          <h2 className="mb-4 text-xl font-semibold text-cambridge">
            About Me
          </h2>
          <p className="text-gunmetal">
            {user.bio || "No bio yet – click Edit to add one."}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ExpertProfile;
