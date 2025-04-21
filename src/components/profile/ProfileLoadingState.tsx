
import React from "react";
import { Loader2 } from "lucide-react";

const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-cambridge" />
        <span className="text-lg text-gunmetal">Loading profile...</span>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
