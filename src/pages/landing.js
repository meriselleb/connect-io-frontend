import React from "react";

import Hero from "../components/layout/Hero";
import LandingLayout from "../components/layout/LandingLayout";
import logo from "../images/icon.png"

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="A complete all-in-one networking platform"
        subtitle="Connect.io allows students and professionals to seek career advice and guidance from one another, create genuine networking connections, and share resources for career development."
        image={logo}
        ctaText="Create your account now"
        ctaLink="/signup"
      />
    </LandingLayout>
  );
}