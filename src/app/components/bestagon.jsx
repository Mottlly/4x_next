"use client";

import React, { useState, useMemo } from "react";
import { Edges } from "@react-three/drei";

const Bestagon = ({ position, color }) => {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected((prev) => !prev);
  };

  return (
    <mesh position={position} onClick={handleClick}>
      <cylinderGeometry args={[1, 1, 0.5, 6]} />
      <meshStandardMaterial color={color} />
      <Edges color={selected ? "lime" : "white"} />
    </mesh>
  );
};

export default Bestagon;
