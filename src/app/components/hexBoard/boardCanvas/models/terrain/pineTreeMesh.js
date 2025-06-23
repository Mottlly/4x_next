import React from "react";

export default function PineTreeMesh({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      {/* Lower foliage */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.35, 0.5, 8]} />
        <meshStandardMaterial color="#2e5d34" />
      </mesh>
      {/* Middle foliage */}
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.28, 0.4, 8]} />
        <meshStandardMaterial color="#357a38" />
      </mesh>
      {/* Top foliage */}
      <mesh position={[0, 1.15, 0]}>
        <coneGeometry args={[0.18, 0.32, 8]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
    </group>
  );
}
