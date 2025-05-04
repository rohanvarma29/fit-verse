import React from "react";
import { updateAvailability } from "@/lib/api";
import PersonalInfoSection from "./PersonalInfoSection";
import ProgramDetailsSection from "./ProgramDetailsSection";
import AvailabilitySection from "./AvailabilitySection";

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
  // Render the content based on active section
  switch (activeSection) {
    case "profile":
      return <PersonalInfoSection user={user} refreshUser={refreshUser} />;
    case "programs":
      return <ProgramDetailsSection user={user} refreshUser={refreshUser} />;
    case "availability":
      return (
        <AvailabilitySection
          meetLink={user?.meetLink}
          onUpdateAvailability={async (meetLink) => {
            await updateAvailability(meetLink);
            refreshUser();
          }}
        />
      );
    default:
      return <PersonalInfoSection user={user} refreshUser={refreshUser} />;
  }
};

export default ProfileContent;
