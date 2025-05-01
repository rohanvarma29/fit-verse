import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useProfileNavigation } from "@/hooks/useProfileNavigation";
import ProfileContainer from "@/components/profile/ProfileContainer";
import ProfileLoadingState from "@/components/profile/ProfileLoadingState";
import ProfileErrorState from "@/components/profile/ProfileErrorState";

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, error, refreshUser } = useUser(id || "");
  const { activeSection, navigateToSection } = useProfileNavigation();

  if (loading) {
    return <ProfileLoadingState />;
  }

  if (error || !user) {
    return <ProfileErrorState error={error} onGoBack={() => navigate(-1)} />;
  }

  return (
    <ProfileContainer
      user={user}
      activeSection={activeSection}
      onSectionChange={navigateToSection}
      refreshUser={refreshUser}
    />
  );
};

export default ExpertProfile;
