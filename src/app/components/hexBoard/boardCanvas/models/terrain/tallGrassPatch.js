import React from "react";

export default function TallGrassPatch({
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
}) {
  // Each patch is a cluster of 3–5 thin, slightly bent cylinders (blades)
  const blades = Array.from({ length: 4 }, (_, i) => {
    const angle = (i / 4) * Math.PI * 2 + rotation;
    const x = Math.cos(angle) * 0.08 * scale;
    const z = Math.sin(angle) * 0.08 * scale;
    const bladeRot = angle + (Math.random() - 0.5) * 0.3;
    return (
      <mesh
        key={i}
        position={[x, 0.18 * scale, z]}
        rotation={[0, bladeRot, (Math.random() - 0.5) * 0.3]}
      >
        <cylinderGeometry
          args={[0.015 * scale, 0.025 * scale, 0.36 * scale, 6]}
        />
        <meshStandardMaterial color="#7ec850" />
      </mesh>
    );
  });

  return (
    <group
      position={position}
      scale={[scale, scale, scale]}
      rotation={[0, rotation, 0]}
    >
      {blades}
    </group>
  );
}
