import React from "react";
import BuildingFloatingIcon from "../icons/BuildingFloatingIcon";

function ColonyBuilding({
  position,
  scale = 1,
  rotation = 0,
  color = "#c5a572",
}) {
  const adjustedPosition = [
    position[0],
    (position[1] ?? 0) - 0.15,
    position[2],
  ];

  return (
    <group
      position={adjustedPosition}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Main building base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.45, 0.4, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Upper level */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.28]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.02, 0.25, 0.18, 4]} />
        <meshStandardMaterial color="#8b6f47" />
      </mesh>

      {/* Flag pole */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Flag */}
      <mesh position={[0.08, 0.9, 0]}>
        <boxGeometry args={[0.15, 0.08, 0.01]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 0.35, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.15, 0.35, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[-0.15, 0.35, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.01]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.15, 0.18]}>
        <boxGeometry args={[0.12, 0.18, 0.01]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
    </group>
  );
}

export default function ColonySettlementMesh({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Main colony building */}
      <ColonyBuilding position={[0, 0, 0]} scale={1.2} rotation={0} />

      {/* Supporting structures */}
      <ColonyBuilding
        position={[0.6, 0, -0.3]}
        scale={0.7}
        rotation={0.5}
        color="#b8956a"
      />
      <ColonyBuilding
        position={[-0.5, 0, 0.4]}
        scale={0.8}
        rotation={-0.3}
        color="#d4c18f"
      />

      {/* Storage/utility buildings */}
      <mesh position={[0.3, -0.1, 0.5]}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      <mesh position={[-0.3, -0.1, -0.4]}>
        <boxGeometry args={[0.18, 0.12, 0.18]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>

      {/* Add the floating icon above the settlement */}
      <BuildingFloatingIcon type="colony_settlement" yOffset={1.2} />
    </group>
  );
}
