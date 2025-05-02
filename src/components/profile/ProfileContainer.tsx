import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileContainerProps {
  user: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
  refreshUser: () => Promise<void>;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  activeSection,
  onSectionChange,
  refreshUser,
}) => {
  const isMobile = useIsMobile();

  // Add custom styles to make the mobile sidebar more opaque
  const customStyles = `
    [data-mobile="true"].bg-sidebar {
      background-color: rgba(0, 42, 50, 0.95) !important;
    }
  `;

  return (
    <div className="min-h-screen bg-alabaster/50">
      <style>{customStyles}</style>
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
            {/* Mobile Sidebar Trigger */}
            {isMobile && (
              <div className="mb-4">
                <SidebarTrigger>
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
              </div>
            )}
            <div className="max-w-4xl mx-auto">
              <ProfileContent
                activeSection={activeSection}
                user={user}
                refreshUser={refreshUser}
              />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ProfileContainer;
