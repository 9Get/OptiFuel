import { useAuth } from "../context/AuthContext";

import { HeroSection } from "../components/HomePage/HeroSection";
import { FeaturesSection } from "../components/HomePage/FeaturesSection";
import { HowItWorksSection } from "../components/HomePage/HowItWorksSection";

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </>
  );
}

export default HomePage;
