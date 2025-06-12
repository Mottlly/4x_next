import React from "react";
import { Edges } from "@react-three/drei";

const Meeple = ({
  color = "#228b22",
  edgeColor = "#222",
  position = [0, 0, 0],
  scale = 1,
  rotation = 0,
  accessories = null,
}) => (
  <group position={position} scale={[scale, scale, scale]} rotation={[0, rotation, 0]}>
    {/* Body */}
    <mesh position={[0, 0.09, 0]}>
      <boxGeometry args={[0.36, 0.38, 0.18]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Head */}
    <mesh position={[0, 0.35, 0]}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Left leg */}
    <mesh position={[-0.11, -0.08, 0]}>
      <boxGeometry args={[0.14, 0.18, 0.18]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Right leg */}
    <mesh position={[0.11, -0.08, 0]}>
      <boxGeometry args={[0.14, 0.18, 0.18]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Left arm */}
    <mesh position={[-0.26, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Right arm */}
    <mesh position={[0.26, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.07, 0.18, 16]} />
      <meshStandardMaterial color={color} />
      <Edges color={edgeColor} />
    </mesh>
    {/* Accessories (e.g. binoculars) */}
    {accessories}
  </group>
);

export default Meeple;