import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Reuse the RoundedSquare helper from BuildingFloatingIcon.js
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

// Import your hostile icons (e.g. CastleIcon) from UnitFloatingIcon.js
import { CastleIcon } from "./UnitFloatingIcon";

const ICONS = {
  hostileFortress: CastleIcon,
  // Add more hostile building/unit icons here if needed
};

export default function HostileBuildingFloatingIcon({
  type = "hostileFortress",
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
      {/* Red rounded square background */}
      <RoundedSquare
        size={0.495}
        radius={0.105}
        color="#e57373"
        opacity={0.85}
      />
      {/* Icon */}
      {Icon && <Icon color="#fff" />}
    </group>
  );
}