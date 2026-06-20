import { createFileRoute } from "@tanstack/react-router";

import { LandingHero } from "@/components/landing-hero";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return <LandingHero />;
}
