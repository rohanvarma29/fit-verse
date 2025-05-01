import React from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import ProgramDetailsSection from "./ProgramDetailsSection";

interface ProfileContentProps {
  activeSection: string;
  user: any;
  refreshUser: () => Promise<void>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeSection,
  user,
  refreshUser,
}) => {
  // Render the content based on active section (no more availability)
  switch (activeSection) {
    case "profile":
      return <PersonalInfoSection user={user} refreshUser={refreshUser} />;
    case "programs":
      return <ProgramDetailsSection />;
    default:
      return <PersonalInfoSection user={user} refreshUser={refreshUser} />;
  }
};

export default ProfileContent;
