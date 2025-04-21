
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";

interface ProfileContainerProps {
  user: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ 
  user, 
  activeSection, 
  onSectionChange 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-alabaster/50">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Sidebar */}
          <ProfileSidebar
            user={user}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />

          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <ProfileContent 
                activeSection={activeSection} 
                user={user} 
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ProfileContainer;
