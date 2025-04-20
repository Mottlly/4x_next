"use client";

import React, { useRef, useState } from "react";
import { Edges } from "@react-three/drei";

const Bestagon = ({
  position,
  color,
  userData,
  onClick: onExternalClick, // ← accept an onClick prop
}) => {
  const meshRef = useRef();
  const [selected, setSelected] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();

    // toggle the green/white edge
    setSelected((sel) => !sel);
    if (meshRef.current) {
      meshRef.current.userData.selected = !selected;
    }

    // call your external handler, passing the tile data
    if (onExternalClick) {
      onExternalClick(userData.tile);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick} // now both internal + external fire
      userData={userData}
    >
      <cylinderGeometry args={[1, 1, 0.5, 6]} />
      <meshStandardMaterial color={color} />
      <Edges color={selected ? "lime" : "white"} />
    </mesh>
  );
};

export default Bestagon;
