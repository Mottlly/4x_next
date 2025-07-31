import React from "react";
import { Edges } from "@react-three/drei/web/Edges";
import BuildingFloatingIcon from "../icons/BuildingFloatingIcon";

// SmallHouse reused from reconstructedShelterMesh.js
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

export default function SensorSuiteMesh({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  // Move all buildings forward and space them out
  const forwardOffset = 0.18;
  const towerX = -0.22;
  const houseX = 0.12;
  const zSpacing = 0.18;

  // Tower size
  const towerWidth = 0.14;
  const towerHeight = 0.52;
  const towerDepth = 0.14;

  // Edge color for highlights
  const edgeColor = "#22272a";

  // Radar and dome sizes
  const radarSize = 0.15;
  const domeRadius = 0.09;

  // Lower the tower so it sits on the ground (like the house)
  const towerBaseY = towerHeight / 2 - 0.18;
  // Tower top Y (for platform and dome)
  const towerTopY = towerBaseY + towerHeight / 2;

  return (
    <group
      position={[position[0], position[1], position[2] + forwardOffset]}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Observation tower - offset to the left, sits on ground */}
      <mesh position={[towerX, towerBaseY, zSpacing]}>
        <boxGeometry args={[towerWidth, towerHeight, towerDepth]} />
        <meshStandardMaterial color="#bcd6f7" metalness={0.7} roughness={0.2} />
        <Edges color={edgeColor} />
      </mesh>
      {/* Tower platform */}
      <mesh position={[towerX, towerTopY, zSpacing]}>
        <boxGeometry args={[0.22, 0.06, 0.18]} />
        <meshStandardMaterial color="#bcd6f7" metalness={0.7} roughness={0.2} />
        <Edges color={edgeColor} />
      </mesh>
      {/* Tower windows (black, on all 4 sides) */}
      {/* Front */}
      <mesh position={[towerX, towerTopY, zSpacing + 0.09]}>
        <boxGeometry args={[0.13, 0.03, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Back */}
      <mesh position={[towerX, towerTopY, zSpacing - 0.09]}>
        <boxGeometry args={[0.13, 0.03, 0.01]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Right */}
      <mesh position={[towerX + 0.11, towerTopY, zSpacing]}>
        <boxGeometry args={[0.01, 0.03, 0.13]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Left */}
      <mesh position={[towerX - 0.11, towerTopY, zSpacing]}>
        <boxGeometry args={[0.01, 0.03, 0.13]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Dome on top of radar*/}
      <mesh position={[towerX, towerTopY + domeRadius * 0.5, zSpacing]}>
        <sphereGeometry
          args={[domeRadius, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial color="#eaf6ff" metalness={0.7} roughness={0.2} />
        <Edges color={edgeColor} />
      </mesh>
      {/* Only one house, offset to the right and back */}
      <SmallHouse
        position={[houseX, -0.05, -0.28]}
        scale={0.7}
        rotation={0.1}
      />
      {/* Floating icon with matching color */}
      <BuildingFloatingIcon type="sensor_suite" color="#5f27cd" yOffset={0.7} />
    </group>
  );
}
