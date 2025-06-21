import React from "react";
import { Edges } from "@react-three/drei";

// Binoculars accessory for a scout meeple
export const Binoculars = (
  <>
    <mesh position={[-0.04, 0.39, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
      <meshStandardMaterial color="#222" />
      <Edges color="#666" />
    </mesh>
    <mesh position={[0.04, 0.39, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
      <meshStandardMaterial color="#222" />
      <Edges color="#666" />
    </mesh>
    <mesh position={[0, 0.39, 0.14]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.06, 0.01, 0.01]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  </>
);

// Wrench accessory for Engineer
export const Wrench = (
  <group>
    {/* Handle */}
    <mesh position={[0.08, 0.33, 0.13]} rotation={[0, 0, Math.PI / 8]}>
      <cylinderGeometry args={[0.012, 0.012, 0.13, 8]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    {/* Jaw */}
    <mesh position={[0.08, 0.39, 0.13]} rotation={[0, 0, Math.PI / 8]}>
      <boxGeometry args={[0.04, 0.02, 0.02]} />
      <meshStandardMaterial color="#bbb" />
    </mesh>
  </group>
);

// Improved Hammer accessory for Engineer (held in right hand)
export const Hammer = (
  <group>
    {/* Handle */}
    <mesh position={[0.26, 0.15, 0.09]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[0.018, 0.018, 0.19, 10]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
    {/* Head - main bar */}
    <mesh position={[0.26, 0.25, 0.09]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.08, 0.03, 0.03]} />
      <meshStandardMaterial color="#444" />
    </mesh>
    {/* Head - striking face */}
    <mesh position={[0.3, 0.25, 0.09]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.02, 0.04, 0.04]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  </group>
);

// Hardhat with black highlight lines (no brim)
export const HardHat = (
  <group>
    {/* Dome */}
    <mesh position={[0, 0.41, 0]}>
      <sphereGeometry args={[0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#ffd700" />
    </mesh>
  </group>
);

// Toolbelt accessory for Engineer (square, wraps around body)
export const ToolBelt = (
  <group>
    {/* Front */}
    <mesh position={[0, 0.01, 0.095]}>
      <boxGeometry args={[0.32, 0.04, 0.025]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.01, -0.095]}>
      <boxGeometry args={[0.32, 0.04, 0.025]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
    {/* Left */}
    <mesh position={[-0.173, 0.01, 0]}>
      <boxGeometry args={[0.025, 0.04, 0.22]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
    {/* Right */}
    <mesh position={[0.173, 0.01, 0]}>
      <boxGeometry args={[0.025, 0.04, 0.22]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
    {/* Pouches (optional, front) */}
    <mesh position={[-0.09, 0.01, 0.12]}>
      <boxGeometry args={[0.05, 0.03, 0.03]} />
      <meshStandardMaterial color="#6B3E1B" />
    </mesh>
    <mesh position={[0.09, 0.01, 0.12]}>
      <boxGeometry args={[0.05, 0.03, 0.03]} />
      <meshStandardMaterial color="#6B3E1B" />
    </mesh>
  </group>
);

// Axe accessory for Raider (on back)
export const Axe = (
  <group>
    {/* Handle */}
    <mesh
      position={[0.06, 0.18, -0.13]}
      rotation={[Math.PI / 2.2, 0, Math.PI / 8]}
    >
      <cylinderGeometry args={[0.01, 0.012, 0.18, 8]} />
      <meshStandardMaterial color="#a0522d" />
    </mesh>
    {/* Blade */}
    <mesh position={[0.06, 0.27, -0.13]} rotation={[0, 0, Math.PI / 8]}>
      <boxGeometry args={[0.04, 0.02, 0.08]} />
      <meshStandardMaterial color="#bbb" />
    </mesh>
  </group>
);

// Sword accessory for Raider (on back)
export const Sword = (
  <group>
    {/* Blade */}
    <mesh
      position={[-0.06, 0.18, -0.13]}
      rotation={[Math.PI / 2.2, 0, -Math.PI / 8]}
    >
      <cylinderGeometry args={[0.008, 0.01, 0.16, 8]} />
      <meshStandardMaterial color="#aaa" />
    </mesh>
    {/* Guard */}
    <mesh position={[-0.06, 0.25, -0.13]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.03, 0.01, 0.03]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    {/* Pommel */}
    <mesh position={[-0.06, 0.17, -0.13]}>
      <sphereGeometry args={[0.014, 8, 8]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  </group>
);
