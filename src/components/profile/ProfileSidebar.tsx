
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface ProfileSidebarProps {
  user: {
    _id: string;
    displayName: string;
    profilePhoto?: string;
  } | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  activeSection,
  onSectionChange,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center p-6">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-offset-2 ring-cambridge/40">
          {user.profilePhoto ? (
            <AvatarImage src={user.profilePhoto} alt={user.displayName} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-cambridge text-alabaster text-xl font-medium">
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-xl font-semibold text-center text-gunmetal">
          {user.displayName}
        </h2>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onSectionChange("profile")}
              isActive={activeSection === "profile"}
              tooltip="Profile Information"
              className="transition-all duration-200 font-medium"
            >
              <User className="text-cambridge" />
              <span>Personal Info</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => onSectionChange("programs")}
              isActive={activeSection === "programs"}
              tooltip="Program Details"
              className="transition-all duration-200 font-medium"
            >
              <Settings className="text-cambridge" />
              <span>Program Details</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-6">
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium shadow-sm"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ProfileSidebar;
