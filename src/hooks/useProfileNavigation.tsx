
import { useState } from 'react';

export const useProfileNavigation = (defaultSection: string = "profile") => {
  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  
  const navigateToSection = (section: string) => {
    setActiveSection(section);
  };
  
  return {
    activeSection,
    navigateToSection
  };
};
