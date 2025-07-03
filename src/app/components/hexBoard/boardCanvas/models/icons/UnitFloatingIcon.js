import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Simple shuttle icon for Pod with downward arrow
function ShuttleIcon({ color = "#000" }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.02, 0.08]}>
        <coneGeometry args={[0.025, 0.05, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.06, 0.02, -0.02]}>
        <boxGeometry args={[0.04, 0.02, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.06, 0.02, -0.02]}>
        <boxGeometry args={[0.04, 0.02, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Engine */}
      <mesh position={[0, 0.02, -0.08]}>
        <cylinderGeometry args={[0.02, 0.025, 0.03, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Downward arrow to suggest landing */}
      {/* Arrow shaft */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.008, 0.04, 0.008]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Arrow head */}
      <mesh position={[0, -0.09, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.015, 0.025, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Simple binoculars icon using geometry
function BinocularsIcon({ color = "#000" }) {
  return (
    <group>
      <mesh position={[-0.07, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.07, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.13, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Hammer icon for Engineer
function HammerIcon({ color = "#000" }) {
  return (
    <group>
      {/* Handle */}
      <mesh position={[0, -0.0345, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.0138, 0.0138, 0.1495, 10]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.052, 0]}>
        <boxGeometry args={[0.098, 0.0525, 0.0525]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Simple sword icon for Raider
function SwordIcon({ color = "#000" }) {
  return (
    <group>
      {/* Blade */}
      <mesh position={[0, 0.045, 0]}>
        <boxGeometry args={[0.02, 0.09, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Crossguard */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.045, 0.01, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, -0.025, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.03, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Simple flag icon for ArmedSettler
function FlagIcon({ color = "#000" }) {
  return (
    <group>
      {/* Flag pole */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.025, 0.055, 0]}>
        <boxGeometry args={[0.05, 0.03, 0.008]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Flag triangle detail */}
      <mesh position={[0.055, 0.04, 0]}>
        <coneGeometry args={[0.015, 0.03, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// Simple shield icon for Security - using crossed swords instead
function ShieldIcon({ color = "#000" }) {
  return (
    <group>
      {/* First sword - diagonal from bottom-left to top-right */}
      <group rotation={[0, 0, Math.PI / 4]} position={[0.04, -0.04, 0]}>
        {/* Blade */}
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.015, 0.2, 0.03]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Crossguard */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.04, 0.012, 0.015]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.015, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.025, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Pommel */}
        <mesh position={[0, -0.032, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>

      {/* Second sword - diagonal from top-left to bottom-right (flipped) */}
      <group rotation={[0, 0, -Math.PI / 4]} position={[-0.04, -0.04, 0]}>
        {/* Blade */}
        <mesh position={[0, 0.055, 0]}>
          <boxGeometry args={[0.015, 0.2, 0.015]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Crossguard */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.04, 0.012, 0.015]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Handle */}
        <mesh position={[0, -0.015, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.025, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Pommel */}
        <mesh position={[0, -0.032, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

// Simple castle icon for hostile fortress, moved down to fit inside background
function CastleIcon({ color = "#000" }) {
  return (
    <group position={[0, -0.04, 0]}>
      {/* Main square */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.13, 0.13, 0.04]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Battlements */}
      {/* Top */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[0.09, 0.025, 0.045]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Left */}
      <mesh position={[-0.065, 0.07, 0]}>
        <boxGeometry args={[0.025, 0.045, 0.045]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Right */}
      <mesh position={[0.065, 0.07, 0]}>
        <boxGeometry args={[0.025, 0.045, 0.045]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.045, 0]}>
        <boxGeometry args={[0.09, 0.025, 0.045]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Flag pole */}
      <mesh position={[0, 0.16, 0.012]}>
        <cylinderGeometry args={[0.006, 0.006, 0.06, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.025, 0.185, 0.012]}>
        <boxGeometry args={[0.03, 0.018, 0.012]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  );
}

// Rounded square geometry helper
function RoundedSquare({
  size = 0.495,
  radius = 0.105,
  segments = 8,
  color = "#e57373",
  opacity = 0.85,
}) {
  const shape = React.useMemo(() => {
    const s = size / 2 - radius;
    const shape = new THREE.Shape();
    shape.absarc(-s, -s, radius, Math.PI, Math.PI * 1.5, false);
    shape.lineTo(s, -size / 2);
    shape.absarc(s, -s, radius, Math.PI * 1.5, 0, false);
    shape.lineTo(size / 2, s);
    shape.absarc(s, s, radius, 0, Math.PI * 0.5, false);
    shape.lineTo(-s, size / 2);
    shape.absarc(-s, s, radius, Math.PI * 0.5, Math.PI, false);
    shape.lineTo(-size / 2, -s);
    return shape;
  }, [size, radius]);

  return (
    <mesh>
      <extrudeGeometry
        args={[shape, { depth: 0.001, bevelEnabled: false, steps: 1 }]}
      />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

const ICONS = {
  Pod: ShuttleIcon,
  Scout: BinocularsIcon,
  Engineer: HammerIcon,
  Armed_Settler: FlagIcon,
  Security: ShieldIcon,
  Raider: SwordIcon,
  hostileFortress: CastleIcon,
  // Add more mappings for other unit types here
};

export default function UnitFloatingIcon({
  type = "Scout",
  color,
  yOffset = 0.7,
}) {
  const groupRef = useRef();
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  // Use red background for Raider and hostileFortress, otherwise use provided color or default
  let bgColor = color || "#38bdf8";
  if (type === "Raider" || type === "hostileFortress") bgColor = "#e57373";
  const Icon = ICONS[type] || null;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Rounded square background for fortress, circle for others */}
      {type === "hostileFortress" ? (
        <RoundedSquare
          size={0.36}
          radius={0.09}
          color={bgColor}
          opacity={0.85}
        />
      ) : (
        <mesh>
          <circleGeometry args={[0.18, 24]} />
          <meshBasicMaterial color={bgColor} transparent opacity={0.85} />
        </mesh>
      )}
      {/* White icon */}
      {Icon && <Icon color="#000" />}
    </group>
  );
}

export { CastleIcon };
