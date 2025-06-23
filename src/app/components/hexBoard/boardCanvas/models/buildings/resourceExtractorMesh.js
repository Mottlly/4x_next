import React from "react";
import { Edges } from "@react-three/drei";
import BuildingFloatingIcon from "../icons/BuildingFloatingIcon";

// SmallHouse copied from reconstructedShelterMesh.js
function SmallHouse({ position, scale = 1, rotation = 0 }) {
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
      {/* Roof */}
      <mesh position={[0, 0.44, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.01, 0.28, 0.22, 4]} />
        <meshStandardMaterial color="#7a5c3a" />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.12, 0.17]}>
        <boxGeometry args={[0.09, 0.16, 0.01]} />
        <meshStandardMaterial color="#4b2e1a" />
      </mesh>
      {/* Chimney */}
      <mesh position={[-0.11, 0.5, 0.05]}>
        <cylinderGeometry args={[0.025, 0.025, 0.09, 8]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </group>
  );
}

export default function ResourceExtractorMesh({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  // Rectangle building size
  const width = 0.5;
  const height = 0.38;
  const depth = 0.32;

  // Chimney positions (on one edge)
  const chimneyY = height / 2 + 0.13;
  const chimneyZ = -depth / 2 + 0.07;

  // Tank positions (along the same edge as chimneys)
  const tankY = -0.06;
  const tankZ = -depth / 2 - 0.09;

  // Door position (opposite edge)
  const doorY = -0.09;
  const doorZ = depth / 2 + 0.01;

  // Edge color for highlights
  const edgeColor = "#22272a";

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Main rectangular building */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#f0f4f8" metalness={0.7} roughness={0.2} />
        <Edges color={edgeColor} />
      </mesh>
      {/* Chimney 1 */}
      <mesh position={[-0.12, chimneyY, chimneyZ]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
        <meshStandardMaterial color="#bfc9d1" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Chimney 2 */}
      <mesh position={[0.12, chimneyY, chimneyZ]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 12]} />
        <meshStandardMaterial color="#bfc9d1" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Side tank 1 */}
      <mesh position={[-0.18, tankY, tankZ]}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 10]} />
        <meshStandardMaterial color="#e0e7ef" metalness={0.5} roughness={0.2} />
        {/* Top edge highlight */}
        <Edges color={edgeColor} threshold={0.98} />
      </mesh>
      {/* Side tank 2 */}
      <mesh position={[0, tankY, tankZ]}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 10]} />
        <meshStandardMaterial color="#e0e7ef" metalness={0.5} roughness={0.2} />
        <Edges color={edgeColor} threshold={0.98} />
      </mesh>
      {/* Side tank 3 */}
      <mesh position={[0.18, tankY, tankZ]}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 10]} />
        <meshStandardMaterial color="#e0e7ef" metalness={0.5} roughness={0.2} />
        <Edges color={edgeColor} threshold={0.98} />
      </mesh>
      {/* Black door on opposite edge */}
      <mesh position={[0, doorY, doorZ]}>
        <boxGeometry args={[0.09, 0.16, 0.01]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Small houses from reconstructed shelter */}
      <SmallHouse position={[-0.55, -0.05, 0.35]} scale={0.6} rotation={0.2} />
      <SmallHouse
        position={[0.45, -0.05, -0.18]}
        scale={0.5}
        rotation={-0.15}
      />
      <BuildingFloatingIcon
        type="resource_extractor"
        color="#38bdf8"
        yOffset={0.7}
      />
    </group>
  );
}
