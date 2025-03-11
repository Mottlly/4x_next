"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";
import boardData from "../../library/defaultBoard";

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

// Function to convert hex grid (q, r) to 3D positions
const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65;
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};

const HexBoard = ({ board }) => {
  const elements = [];

  // Create a set of land tile positions to prevent water rendering underneath
  const landTilePositions = new Set(board.tiles.map(({ q, r }) => `${q},${r}`));

  // Generate water tiles, excluding ones that match land tiles
  for (let q = 0; q < board.cols; q++) {
    for (let r = 0; r < board.rows; r++) {
      if (!landTilePositions.has(`${q},${r}`)) {
        const position = hexToPosition(q, r, board.spacing);
        elements.push(
          <Bestagon key={`water-${q}-${r}`} position={position} color="blue" />
        );
      }
    }
  }

  // Place land tiles
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
