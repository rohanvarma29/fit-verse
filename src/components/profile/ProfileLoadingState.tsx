
import React from "react";
import { Loader2 } from "lucide-react";

const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-alabaster/50">
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-white shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-cambridge" />
        <span className="text-lg font-medium text-gunmetal">Loading your profile...</span>
      </div>
    </div>
  );
};

export default ProfileLoadingState;
