"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Sphere, Cylinder, ContactShadows } from "@react-three/drei";
import { useRef } from "react";

function Layer({ children }) {
  return <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>{children}</Float>;
}

function Burger() {
  const group = useRef();
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
  });
  const bun = "#E89A4F";
  return (
    <group ref={group} position={[0, -0.1, 0]} scale={1.15}>
      {/* bottom bun */}
      <mesh position={[0, -0.85, 0]} scale={[1.15, 0.5, 1.15]} castShadow>
        <sphereGeometry args={[1, 48, 48, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={bun} roughness={0.65} />
      </mesh>
      {/* patty */}
      <Cylinder args={[1.02, 1.02, 0.38, 48]} position={[0, -0.5, 0]} castShadow>
        <meshStandardMaterial color="#5A3621" roughness={0.8} />
      </Cylinder>
      {/* cheese */}
      <RoundedBox args={[1.95, 0.14, 1.95]} radius={0.06} smoothness={4} position={[0, -0.27, 0]} rotation={[0, 0.2, 0.02]} castShadow>
        <meshStandardMaterial color="#FFC23E" roughness={0.4} />
      </RoundedBox>
      {/* lettuce ring */}
      <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.0, 0.16, 16, 60]} />
        <meshStandardMaterial color="#56A85A" roughness={0.7} />
      </mesh>
      {/* top bun dome */}
      <mesh position={[0, 0.18, 0]} scale={[1.18, 0.95, 1.18]} castShadow>
        <sphereGeometry args={[1, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={bun} roughness={0.55} />
      </mesh>
      {/* sesame seeds */}
      {[[0.3, 0.7, 0.2], [-0.35, 0.72, 0.1], [0.1, 0.78, -0.35], [-0.15, 0.74, 0.4], [0.45, 0.66, -0.2]].map((p, i) => (
        <Sphere key={i} args={[0.07, 12, 12]} position={p}>
          <meshStandardMaterial color="#FBE6C5" roughness={0.5} />
        </Sphere>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.5, 5.2], fov: 42 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, -2, -3]} intensity={0.5} color="#FF7A18" />
      <pointLight position={[4, -1, 4]} intensity={0.4} color="#7C5CFC" />
      <Layer>
        <Burger />
      </Layer>
      <ContactShadows position={[0, -2, 0]} opacity={0.35} scale={9} blur={2.6} far={4} color="#3a1f0a" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.7} />
    </Canvas>
  );
}
