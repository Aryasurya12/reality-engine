'use client';

import Lighting from "./Lighting";
import WorkshopBackground from "./WorkshopBackground";
import Workbench from "./Workbench";
import DustParticles from "./DustParticles";
import TextOverlay from "./TextOverlay";

export default function HeroScene() {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* Deepest Layer: Background & Lighting */}
      <Lighting />
      <WorkshopBackground />
      
      {/* Mid Layer: Floating Dust */}
      <DustParticles />

      {/* Foreground Layer: Workbench, Robot, Blueprint */}
      <Workbench />

      {/* UI Layer */}
      <TextOverlay />
    </div>
  );
}
