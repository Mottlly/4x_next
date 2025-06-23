import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Rounded square geometry helper
function RoundedSquare({
  size = 0.495,
  radius = 0.105,
  segments = 8,
  color = "#38bdf8",
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

// Simple factory icon: rectangle with two smoke stacks on one side and smoke
function FactoryIcon({ color = "#111" }) {
  return (
    <group position={[0, -0.06, 0]}>
      {/* Main building */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.26, 0.13, 0.02]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Left smokestack */}
      <mesh position={[-0.09, 0.08, 0]}>
        <boxGeometry args={[0.045, 0.19, 0.02]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Right smokestack */}
      <mesh position={[-0.03, 0.08, 0]}>
        <boxGeometry args={[0.045, 0.15, 0.02]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Smoke */}
      <mesh position={[-0.09, 0.21, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.09, 0.25, 0]}>
        <sphereGeometry args={[0.017, 12, 12]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// Sensor suite icon: just three black arcs and a black dot, shifted down/left, now larger
function SensorSuiteIcon() {
  const offset = [-0.045, -0.045, 0];
  const scale = 1.45; // Increased scale for larger icon
  return (
    <group position={offset} scale={[scale, scale, scale]}>
      {/* Outer arc */}
      <mesh position={[0.025, 0, 0.001]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.13, 0.012, 16, 32, Math.PI / 1.35]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Middle arc */}
      <mesh position={[0.025, 0, 0.001]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.012, 16, 32, Math.PI / 1.35]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Inner arc */}
      <mesh position={[0.025, 0, 0.001]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.07, 0.012, 16, 32, Math.PI / 1.35]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Origin dot */}
      <mesh position={[0.025, 0, 0.01]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

// Simple house icon for reconstructed shelter, now larger
function HouseIcon({ color = "#111" }) {
  const scale = 1.45; // Increased scale for larger icon
  return (
    <group scale={[scale, scale, scale]}>
      {/* House base */}
      <mesh position={[0, -0.025, 0]}>
        <boxGeometry args={[0.13, 0.11, 0.02]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.045, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.09, 0.08, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

const ICONS = {
  resource_extractor: FactoryIcon,
  sensor_suite: SensorSuiteIcon,
  reconstructed_shelter: HouseIcon,
};

export default function BuildingFloatingIcon({
  type = "resource_extractor",
  color,
  yOffset = 0.7,
}) {
  const groupRef = useRef();
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  // Always use blue for all building backgrounds
  const iconColor = "#38bdf8";
  const Icon = ICONS[type] || null;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Larger rounded square background */}
      <RoundedSquare
        size={0.495}
        radius={0.105}
        color={iconColor}
        opacity={0.85}
      />
      {/* Icon */}
      {Icon && <Icon color="#111" />}
    </group>
  );
}
