import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Calendar } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
  const { toast } = useToast();
  const { toggleSidebar, isMobile } = useSidebar();

  const handleLogout = async () => {
    try {
      console.log(`${API_BASE_URL}/users/logout`);
      const response = await fetch(`${API_BASE_URL}/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/");
        toast({
          title: "Logged out successfully!",
          description: "You have been successfully logged out.",
        });
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Logout failed",
          description:
            errorData.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  if (!user) return null;

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center p-6">
        <Avatar className="h-20 w-20 mb-4 ring-2 ring-offset-2 ring-cambridge/40">
          {user.profilePhoto ? (
            <AvatarImage
              src={`http://localhost:3000${user.profilePhoto}`}
              alt={user.displayName}
              className="object-cover"
            />
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
              onClick={() => handleSectionChange("profile")}
              isActive={activeSection === "profile"}
              tooltip="Profile Information"
              className={`transition-all duration-200 font-medium ${
                isMobile ? "text-white" : "text-gunmetal"
              }`}
            >
              <User className="text-cambridge" />
              <span>Personal Info</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleSectionChange("programs")}
              isActive={activeSection === "programs"}
              tooltip="Program Details"
              className={`transition-all duration-200 font-medium ${
                isMobile ? "text-white" : "text-gunmetal"
              }`}
            >
              <Settings className="text-cambridge" />
              <span>Program Details</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => handleSectionChange("availability")}
              isActive={activeSection === "availability"}
              tooltip="Availability"
              className={`transition-all duration-200 font-medium ${
                isMobile ? "text-white" : "text-gunmetal"
              }`}
            >
              <Calendar className="text-cambridge" />
              <span>Availability</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-6">
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors font-medium shadow-sm"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        <Button
          variant="outline"
          className="w-full border-gunmetal-300 text-gunmetal hover:bg-green-200 transition-colors font-medium shadow-sm"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ProfileSidebar;
