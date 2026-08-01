import { memo, Suspense, lazy } from 'react';
import HeroScene from '../scenes/HeroScene';

// Lazy-load heavier scenes
const CorridorScene = lazy(() => import('../scenes/CorridorScene'));

const SceneController = memo(function SceneController() {
  return (
    <div className="relative w-full bg-[#050403] text-white">
      {/* 
        Sequential scroll architecture. 
        Each scene handles its own pinning and height via GSAP ScrollTrigger.
      */}
      <HeroScene />
      
      <Suspense fallback={<div className="w-full h-[6000vh] bg-[#050403]" />}>
        <CorridorScene />
      </Suspense>
    </div>
  );
});

export default SceneController;
