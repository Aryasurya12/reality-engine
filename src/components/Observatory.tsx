'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Astrolabe() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Smooth, slow rotation for the entire group
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.5;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.3;
      ring2Ref.current.rotation.z += delta * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.6;
      ring3Ref.current.rotation.z -= delta * 0.1;
    }
  });

  const material = new THREE.MeshStandardMaterial({ 
    color: '#b58953', 
    metalness: 0.8, 
    roughness: 0.2 
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#fcdba1" emissive="#c45b36" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <primitive object={material} />
      </mesh>

      {/* Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.0, 0.05, 16, 100]} />
        <primitive object={material} />
      </mesh>

      {/* Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.5, 0.05, 16, 100]} />
        <primitive object={material} />
      </mesh>
    </group>
  );
}

export default function Observatory() {
  return (
    <div className="relative w-full h-screen bg-transparent pointer-events-auto">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h2 className="font-serif text-5xl text-glow bg-gradient-to-b from-[#fcdba1] to-[#b58953] bg-clip-text text-transparent">
          The Grand Observatory
        </h2>
        <p className="font-sans text-sm tracking-[0.3em] uppercase opacity-50 mt-4 text-[var(--color-workshop-brass)]">
          Drag to explore the universe
        </p>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#fcdba1" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#c45b36" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Astrolabe />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
