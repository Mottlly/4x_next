"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";

// Sample JSON board definition
const boardData = {
  rows: 25,
  cols: 25,
  spacing: 1.05, // Controls overall hex size & placement
  tiles: [
    { q: 1, r: 0, type: "forest" },
    { q: 2, r: 1, type: "desert" },
    { q: 3, r: 2, type: "forest" },
  ],
};

// Function to map tile types to colors
const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "blue";
    case "forest":
      return "#90EE90"; // Light green
    case "desert":
      return "yellow";
    default:
      return "gray";
  }
};

// Function to convert hex grid (q, r) to 3D positions (Adjusted for better fit)
const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65; // FIXED: Makes hexes perfectly connect on x-axis
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};

const HexBoard = ({ board }) => {
  const elements = [];

  // Generate full water layer (base)
  for (let q = 0; q < board.cols; q++) {
    for (let r = 0; r < board.rows; r++) {
      const position = hexToPosition(q, r, board.spacing);
      elements.push(
        <Bestagon key={`water-${q}-${r}`} position={position} color="blue" />
      );
    }
  }

  // Place additional tiles (forest, desert, etc.) on top, slightly overlapping the water layer
  board.tiles.forEach(({ q, r, type }) => {
    const position = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    elements.push(
      <Bestagon
        key={`tile-${q}-${r}`}
        position={[position[0], 0.3, position[2]]}
        color={color}
      />
    );
  });

  return (
    <Canvas
      camera={{ position: [10, 10, 15] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} />
      {elements}
      <MapControls />
    </Canvas>
  );
};

export default function App() {
  return <HexBoard board={boardData} />;
}
