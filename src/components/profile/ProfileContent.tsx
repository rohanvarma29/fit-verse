
import React from "react";
import PersonalInfoSection from "./PersonalInfoSection";
import ProgramDetailsSection from "./ProgramDetailsSection";

interface ProfileContentProps {
  activeSection: string;
  user: any;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ activeSection, user }) => {
  // Render the content based on active section (no more availability)
  switch (activeSection) {
    case "profile":
      return <PersonalInfoSection user={user} />;
    case "programs":
      return <ProgramDetailsSection />;
    default:
      return <PersonalInfoSection user={user} />;
  }
};

export default ProfileContent;
