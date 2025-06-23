import React from "react";

export default function BerryBush({ position = [0, 0, 0], scale = 1, rotation = 0 }) {
  // Main bush: a green sphere, with several small red/purple spheres as berries
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
      {/* Bush body */}
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#3b7a2a" />
      </mesh>
      {/* Berries */}
      <mesh position={[0.09, 0.28, 0.04]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[-0.08, 0.23, -0.07]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[0.04, 0.22, -0.09]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#7b1fa2" />
      </mesh>
      <mesh position={[-0.07, 0.29, 0.06]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
    </group>
  );
}