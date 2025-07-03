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

// Large vertical sword for Raider (right hand)
export const RaiderSword = (
  <group>
    {/* Handle */}
    <mesh position={[0.33, 0.17, 0.13]}>
      <cylinderGeometry args={[0.018, 0.018, 0.09, 12]} />
      <meshStandardMaterial color="#888" />
    </mesh>
    {/* Crossguard (hilt) */}
    <mesh position={[0.33, 0.23, 0.13]}>
      <boxGeometry args={[0.06, 0.018, 0.045]} />
      <meshStandardMaterial color="#bbb" />
    </mesh>
    {/* Blade */}
    <mesh position={[0.33, 0.38, 0.13]}>
      <boxGeometry args={[0.028, 0.24, 0.028]} />
      <meshStandardMaterial color="#eee" />
    </mesh>
    {/* Pyramid tip, edges aligned with blade */}
    <mesh position={[0.33, 0.52, 0.13]}>
      <coneGeometry args={[0.028, 0.04, 4]} /> {/* 4 sides = pyramid */}
      <meshStandardMaterial color="#ccc" />
    </mesh>
  </group>
);

// Simple hat accessory for Armed_Settler
export const Hat = (
  <group>
    {/* Hat crown - positioned higher to avoid clipping */}
    <mesh position={[0, 0.44, 0]}>
      <cylinderGeometry args={[0.13, 0.13, 0.08, 16]} />
      <meshStandardMaterial color="#4a5d23" />
    </mesh>
    {/* Hat brim */}
    <mesh position={[0, 0.40, 0]}>
      <cylinderGeometry args={[0.17, 0.17, 0.02, 16]} />
      <meshStandardMaterial color="#4a5d23" />
    </mesh>
  </group>
);

// Army helmet accessory for Security
export const ArmyHelmet = (
  <group>
    {/* Helmet dome */}
    <mesh position={[0, 0.41, 0]}>
      <sphereGeometry args={[0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#2d5016" />
    </mesh>
    {/* Chin strap */}
    <mesh position={[0, 0.35, 0.12]}>
      <boxGeometry args={[0.08, 0.01, 0.02]} />
      <meshStandardMaterial color="#1a2e0b" />
    </mesh>
  </group>
);

// Backpack accessory for Armed_Settler (on back)
export const Backpack = (
  <group>
    {/* Main backpack body - doubled in size and moved further back */}
    <mesh position={[0, 0.18, -0.16]}>
      <boxGeometry args={[0.20, 0.28, 0.12]} />
      <meshStandardMaterial color="#2d5016" />
    </mesh>
    {/* Bedroll on top - longer to avoid fighting with backpack mesh */}
    <mesh position={[0, 0.33, -0.16]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.07, 0.26, 12]} />
      <meshStandardMaterial color="#D2B48C" />
    </mesh>
    {/* Left strap - adjusted for larger backpack */}
    <mesh position={[-0.07, 0.14, -0.11]}>
      <boxGeometry args={[0.03, 0.20, 0.015]} />
      <meshStandardMaterial color="#1a2e0b" />
    </mesh>
    {/* Right strap - adjusted for larger backpack */}
    <mesh position={[0.07, 0.14, -0.11]}>
      <boxGeometry args={[0.03, 0.20, 0.015]} />
      <meshStandardMaterial color="#1a2e0b" />
    </mesh>
  </group>
);

// Bandolier accessory for Security (across chest)
export const Bandolier = (
  <group>
    {/* Main strap - much larger to cover entire torso */}
    <mesh position={[0.02, 0.18, 0.11]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.35, 0.05, 0.03]} />
      <meshStandardMaterial color="#4a3728" />
    </mesh>
    {/* Ammunition pouches - larger and spread across entire strap */}
    <mesh position={[-0.08, 0.28, 0.12]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
      <meshStandardMaterial color="#2d2520" />
    </mesh>
    <mesh position={[-0.02, 0.23, 0.12]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
      <meshStandardMaterial color="#2d2520" />
    </mesh>
    <mesh position={[0.04, 0.18, 0.12]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
      <meshStandardMaterial color="#2d2520" />
    </mesh>
    <mesh position={[0.10, 0.13, 0.12]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
      <meshStandardMaterial color="#2d2520" />
    </mesh>
    <mesh position={[0.16, 0.08, 0.12]} rotation={[0, 0, -Math.PI / 6]}>
      <boxGeometry args={[0.05, 0.04, 0.04]} />
      <meshStandardMaterial color="#2d2520" />
    </mesh>
    {/* Buckle at center - larger */}
    <mesh position={[0.02, 0.18, 0.125]}>
      <boxGeometry args={[0.04, 0.03, 0.02]} />
      <meshStandardMaterial color="#8B5C2A" />
    </mesh>
  </group>
);
