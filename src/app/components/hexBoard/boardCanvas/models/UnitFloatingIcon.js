import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// Simple binoculars icon using geometry
function BinocularsIcon({ color = "#fff" }) {
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
function HammerIcon({ color = "#fff" }) {
  // 15% larger for handle, 30% larger for head
  return (
    <group>
      {/* Handle */}
      <mesh position={[0, -0.0345, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.0138, 0.0138, 0.1495, 10]} />
        <meshStandardMaterial color="#bfa76a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.052, 0]}>
        <boxGeometry args={[0.098, 0.0525, 0.0525]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

const ICONS = {
  Scout: BinocularsIcon,
  Engineer: HammerIcon,
  // Add more mappings for other unit types here
};

export default function UnitFloatingIcon({
  type = "Scout",
  color = "#38bdf8",
  yOffset = 0.7,
}) {
  const groupRef = useRef();
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  const Icon = ICONS[type] || null;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Blue background circle */}
      <mesh>
        <circleGeometry args={[0.18, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>
      {/* White icon */}
      {Icon && <Icon color="#fff" />}
    </group>
  );
}
