
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import PersonalInfoSection from "@/components/profile/PersonalInfoSection";
import ProgramDetailsSection from "@/components/profile/ProgramDetailsSection";
import AvailabilitySection from "@/components/profile/AvailabilitySection";

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error } = useUser(id || "");
  
  // Track active section for the sidebar navigation
  const [activeSection, setActiveSection] = useState<string>("profile");

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

  // Render the content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <PersonalInfoSection user={user} />;
      case "programs":
        return <ProgramDetailsSection />;
      case "availability":
        return <AvailabilitySection />;
      default:
        return <PersonalInfoSection user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ExpertProfile;
