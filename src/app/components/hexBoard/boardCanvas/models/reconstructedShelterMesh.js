import React from "react";

function SmallHouse({ position, scale = 1, rotation = 0 }) {
  // Lower the whole house so the base sits on the ground
  const adjustedPosition = [
    position[0],
    (position[1] ?? 0) - 0.18,
    position[2],
  ];
  return (
    <group
      position={adjustedPosition}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Base */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.38, 0.36, 0.32]} />
        <meshStandardMaterial color="#b48a78" />
      </mesh>
      {/* Roof (tip up, wide part down) */}
      <mesh position={[0, 0.44, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.01, 0.28, 0.22, 4]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.12, 0.17]}>
        <boxGeometry args={[0.09, 0.16, 0.01]} />
        <meshStandardMaterial color="#4b2e1a" />
      </mesh>
      {/* Chimney (lowered to sit on roof) */}
      <mesh position={[-0.11, 0.5, 0.05]}>
        <cylinderGeometry args={[0.025, 0.025, 0.09, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

export default function ReconstructedShelterMesh({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  // Cluster of 3 small houses, all lowered to sit on the tile
  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      <SmallHouse position={[0, 0, 0]} scale={1} rotation={0} />
      <SmallHouse position={[0.45, 0, -0.18]} scale={0.85} rotation={0.3} />
      <SmallHouse position={[-0.38, 0, 0.22]} scale={0.75} rotation={-0.2} />
    </group>
  );
}
