import React from "react";

export default function MountainMesh({ position = [0, 0, 0], scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Main peak */}
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.22, 0.65, 7]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
      {/* Side peak 1 */}
      <mesh position={[-0.13, 0.18, 0.09]}>
        <coneGeometry args={[0.11, 0.32, 7]} />
        <meshStandardMaterial color="#757575" />
      </mesh>
      {/* Side peak 2 */}
      <mesh position={[0.14, 0.13, -0.08]}>
        <coneGeometry args={[0.09, 0.22, 7]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 0.62, 0]}>
        <coneGeometry args={[0.09, 0.13, 7]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
}