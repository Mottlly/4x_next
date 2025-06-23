import React from "react";
import HostileBuildingFloatingIcon from "../icons/HostileBuildingFloatingIcon";

// A single hut: short lighter brown cylinder with a lighter, smaller cone roof and a door on a random side
function Hut({ position = [0, 0, 0], scale = 1, rotation = 0 }) {
  // Lighter colors
  const baseColor = "#a87c4a";
  const roofColor = "#7c5230";
  // Door on a random side (0, 90, 180, or 270 degrees)
  const doorAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  const doorRotation =
    doorAngles[Math.floor(Math.random() * doorAngles.length)];
  return (
    <group
      position={[position[0], position[1] - 0.4, position[2]]}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Hut base */}
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.14, 16]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      {/* Roof - lighter and a bit smaller */}
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.14, 0.08, 16]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      {/* Door */}
      <mesh
        position={[
          Math.sin(doorRotation) * 0.13,
          0.03,
          Math.cos(doorRotation) * 0.13,
        ]}
        rotation={[0, doorRotation, 0]}
      >
        <boxGeometry args={[0.045, 0.07, 0.01]} />
        <meshStandardMaterial color="#2d180a" />
      </mesh>
    </group>
  );
}

// Four castle walls with battlements, forming a square, with a gate in the south wall
function CastleWalls({ size = 0.8, height = 0.28, thickness = 0.09 }) {
  // Battlements: small cubes along the top of each wall
  const battlementCount = 5;
  const battlementSize = 0.07;
  const battlementHeight = 0.09;
  const wallColor = "#b0b0b0";
  const battlementColor = "#888";
  const half = size / 2;

  // Helper to render battlements along a wall
  function Battlements({ start, end, y, skipGate = false }) {
    const battlements = [];
    for (let i = 0; i < battlementCount; i++) {
      // For south wall, skip battlements above the gate
      if (skipGate && i === 2) continue;
      const t = i / (battlementCount - 1);
      const x = start[0] + (end[0] - start[0]) * t;
      const z = start[1] + (end[1] - start[1]) * t;
      battlements.push(
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry
            args={[battlementSize, battlementHeight, battlementSize]}
          />
          <meshStandardMaterial color={battlementColor} />
        </mesh>
      );
    }
    return battlements;
  }

  return (
    <group>
      {/* North wall */}
      <mesh position={[0, -0.25, -half]}>
        <boxGeometry args={[size, height, thickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <Battlements
        start={[-half + battlementSize / 2, -half]}
        end={[half - battlementSize / 2, -half]}
        y={-0.1}
      />
      {/* South wall with gate */}
      <mesh position={[0, -0.25, half]}>
        <boxGeometry args={[size, height, thickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Gate in the center of the south wall */}
      <mesh position={[0, -0.3, half + 0.04]}>
        <boxGeometry args={[0.16, 0.18, 0.02]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <Battlements
        start={[-half + battlementSize / 2, half]}
        end={[half - battlementSize / 2, half]}
        y={-0.1}
        skipGate={true}
      />
      {/* West wall */}
      <mesh position={[-half, -0.25, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <Battlements
        start={[-half, -half + battlementSize / 2]}
        end={[-half, half - battlementSize / 2]}
        y={-0.1}
      />
      {/* East wall */}
      <mesh position={[half, -0.25, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <Battlements
        start={[half, -half + battlementSize / 2]}
        end={[half, half - battlementSize / 2]}
        y={-0.1}
      />
    </group>
  );
}

// A simple stone keep (cylinder) in the center
function StoneKeep({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group
      position={[position[0], position[1] - 0.4, position[2]]}
      scale={[scale, scale, scale]}
    >
      {/* Main tower */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.44, 20]} />
        <meshStandardMaterial color="#b0b0b0" />
      </mesh>
      {/* Battlements */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.13, 0.46, Math.sin(angle) * 0.13]}
          >
            <boxGeometry args={[0.045, 0.08, 0.045]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        );
      })}
      {/* Door */}
      <mesh position={[0, 0.09, 0.13]}>
        <boxGeometry args={[0.05, 0.12, 0.01]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}

// HostileFortressMesh: square castle with keep, huts outside
export default function HostileFortressMesh({
  position = [0, -0.14, 0], // Lowered everything to sit on ground
  scale = 1,
  rotation = 0,
}) {
  // Hut positions outside the castle walls
  const hutDefs = [
    { pos: [0.7, 0, 0.3], scale: 0.9, rot: 0.2 },
    { pos: [-0.65, 0, 0.35], scale: 0.85, rot: -0.3 },
    { pos: [0.5, 0, -0.55], scale: 0.92, rot: 0.5 },
  ];

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {/* Square castle walls */}
      <CastleWalls />
      {/* Central stone keep */}
      <StoneKeep />
      {/* Huts outside the walls */}
      {hutDefs.map((def, i) => (
        <Hut key={i} position={def.pos} scale={def.scale} rotation={def.rot} />
      ))}
    </group>
  );
}
