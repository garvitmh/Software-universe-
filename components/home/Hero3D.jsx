"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, useGLTF, Center, PresentationControls } from "@react-three/drei";
import { useRef } from "react";

function RetroComputer() {
  const { scene } = useGLTF("/models/retro_computer.glb");
  const ref = useRef();
  
  // Subtle auto-rotation
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={1.2} />
    </Center>
  );
}

export default function Hero3D() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 45 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, -2, -3]} intensity={0.5} color="#FF7A18" />
      
      {/* PresentationControls adds a satisfying interactive drag that snaps back */}
      <PresentationControls
        global={false} // Only applies to the model, not the whole canvas
        cursor={true}
        snap={{ mass: 4, tension: 400 }} // Snap back to original position
        speed={1.2}
        zoom={1}
        rotation={[0.1, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]} // Vertical limits
        azimuth={[-Math.PI / 2, Math.PI / 2]} // Horizontal limits
      >
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <RetroComputer />
        </Float>
      </PresentationControls>
      
      <ContactShadows position={[0, -2, 0]} opacity={0.35} scale={10} blur={2.6} far={4} color="#3a1f0a" />
    </Canvas>
  );
}

useGLTF.preload("/models/retro_computer.glb");
