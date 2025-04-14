"use client";

import React, { useRef, useState } from "react";
import { Edges } from "@react-three/drei";

const Bestagon = ({ position, color, userData }) => {
  const meshRef = useRef();
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);

    // Optional: manually change material color or edge color here
    if (meshRef.current) {
      meshRef.current.userData.selected = !selected;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      userData={userData}
    >
      <cylinderGeometry args={[1, 1, 0.5, 6]} />
      <meshStandardMaterial color={color} />
      <Edges color={selected ? "lime" : "white"} />
    </mesh>
  );
};

export default Bestagon;
