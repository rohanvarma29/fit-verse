
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileErrorStateProps {
  error: string;
  onGoBack: () => void;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ error, onGoBack }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="p-6 max-w-md w-full text-center">
        <p className="text-lg text-red-600">
          {error || "Failed to load user profile"}
        </p>
        <Button className="mt-4" onClick={onGoBack}>
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default ProfileErrorState;
