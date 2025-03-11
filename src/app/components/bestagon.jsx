"use client";

import React, { useState } from "react"; // Ensure useState is imported
import { Edges } from "@react-three/drei";

const Bestagon = ({ position, color }) => {
  const [selected, setSelected] = useState(false); // Ensure useState is used properly

  const handleClick = () => {
    setSelected((prev) => !prev); // Toggle selected state
  };

  return (
    <mesh position={position} onClick={handleClick}>
      {" "}
      {/* Handle clicks correctly */}
      <cylinderGeometry args={[1, 1, 0.5, 6]} />
      <meshStandardMaterial color={color} />
      <Edges color={selected ? "lime" : "white"} />{" "}
      {/* Changes outline on click */}
    </mesh>
  );
};

export default Bestagon;
