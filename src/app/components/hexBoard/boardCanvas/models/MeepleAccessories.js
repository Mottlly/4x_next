import React from "react";
import { Edges } from "@react-three/drei";

// Binoculars accessory for a scout meeple
export const Binoculars = (
  <>
    <mesh position={[-0.04, 0.39, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
      <meshStandardMaterial color="#222" />
      <Edges color="#666" />
    </mesh>
    <mesh position={[0.04, 0.39, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
      <meshStandardMaterial color="#222" />
      <Edges color="#666" />
    </mesh>
    <mesh position={[0, 0.39, 0.14]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.06, 0.01, 0.01]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  </>
);