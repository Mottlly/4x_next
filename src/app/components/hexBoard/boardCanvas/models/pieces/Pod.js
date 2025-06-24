import React from "react";

// Simple meeple figure
function Meeple({ position, color = "#4a90e2" }) {
  return (
    <group position={position}>
      {/* Head */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.03, 12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.08, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arms (left and right) */}
      <mesh position={[-0.04, 0.11, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.04, 0.11, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Legs (left and right) */}
      <mesh position={[-0.015, 0.02, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.04, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.015, 0.02, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.04, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function Pod({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
  selected = false,
}) {
  const shuttleColor = "#e8e8e8"; // Light gray
  const accentColor = "#4a90e2"; // Blue accents
  const meepleColor = "#4a90e2"; // Blue meeples

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {" "}
      {/* Main shuttle body */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.25, 0.12, 0.35]} />
        <meshStandardMaterial color={shuttleColor} />
      </mesh>{" "}
      {/* Cockpit */}
      <mesh position={[0, -0.22, 0.18]}>
        <boxGeometry args={[0.12, 0.08, 0.12]} />
        <meshStandardMaterial color={shuttleColor} />
      </mesh>
      {/* Cockpit window (black) */}
      <mesh position={[0, -0.21, 0.241]}>
        <boxGeometry args={[0.08, 0.06, 0.002]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Engine section (back) */}
      <mesh position={[0, -0.24, -0.22]}>
        <cylinderGeometry args={[0.06, 0.08, 0.08, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      {/* Engine nozzles */}
      <mesh position={[-0.05, -0.24, -0.28]}>
        <cylinderGeometry args={[0.02, 0.025, 0.04, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0.05, -0.24, -0.28]}>
        <cylinderGeometry args={[0.02, 0.025, 0.04, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>{" "}
      {/* Landing legs - fixed positioning for front left */}
      <mesh position={[-0.12, -0.28, 0.1]} rotation={[0, 0, Math.PI / 12]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.12, -0.28, 0.1]} rotation={[0, 0, -Math.PI / 12]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[-0.12, -0.28, -0.1]} rotation={[0, 0, Math.PI / 12]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.12, -0.28, -0.1]} rotation={[0, 0, -Math.PI / 12]}>
        <cylinderGeometry args={[0.008, 0.012, 0.06, 6]} />
        <meshStandardMaterial color="#666666" />
      </mesh>{" "}
      {/* Landing pads - matching the leg order */}
      <mesh position={[-0.15, -0.31, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0.15, -0.31, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[-0.15, -0.31, -0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0.15, -0.31, -0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {/* Cockpit/viewport */}
      <mesh position={[0, -0.18, 0.08]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
      {/* Blue accent stripes */}
      <mesh position={[0, -0.22, 0.05]}>
        <boxGeometry args={[0.26, 0.02, 0.05]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      {/* Side panels */}
      <mesh position={[-0.13, -0.22, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0.13, -0.22, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>      {/* Meeples standing beside the shuttle */}
      <Meeple position={[-0.25, -0.3, 0.1]} color={meepleColor} />
      <Meeple position={[0.25, -0.3, -0.05]} color={meepleColor} />

      {/* Selection indicator */}
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
