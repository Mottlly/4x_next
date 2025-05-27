"use client";

import React, { useRef, useState } from "react";
import { Edges } from "@react-three/drei";
import { tileTypeStyles } from "@/library/styles/stylesIndex";

const Bestagon = ({
  position,
  userData,
  onClick: onExternalClick,
  spacing = 1,
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

  const tileType = userData?.tile?.type || "default";
  const style = tileTypeStyles[tileType] || tileTypeStyles.default;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      userData={userData}
    >
      <cylinderGeometry args={[spacing, spacing, style.geometry.args[2], 6]} />
      <meshStandardMaterial color={style.color} />
      <Edges color={style.edgeColor} />
    </mesh>
  );
};

export default Bestagon;
