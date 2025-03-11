"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon"; // Use absolute import

const createLayer = (rows, cols, spacing, yOffset, color) => {
  const hexes = [];
  const xOffset = Math.sqrt(3) * spacing;
  const zOffset = spacing * 1.5;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * xOffset;
      const y = yOffset;
      const z = row * zOffset;
      hexes.push(
        <Bestagon
          key={`${row}-${col}-${yOffset}`}
          position={[x + (row % 2) * (xOffset / 2), y, -z]}
          color={color}
        />
      );
    }
  }
  return hexes;
};

const HexBoard = () => {
  return (
    <Canvas
      camera={{ position: [10, 10, 15] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} />
      {createLayer(10, 10, 1.05, 0, "blue")} {/* Bottom blue layer */}
      {createLayer(7, 7, 1.05, 0.6, "#90EE90")}{" "}
      {/* Middle lighter green layer */}
      {createLayer(5, 5, 1.05, 1.2, "yellow")} {/* Top yellow layer */}
      <OrbitControls />
    </Canvas>
  );
};

export default HexBoard;
