import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";
import TileInfoPanel from "../components/gameUI/infoTile";

// Utility: Map tile type to color
const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "#4169E1";
    case "lake":
      return "#007BA7";
    case "forest":
      return "#228B22";
    case "desert":
      return "#EDC9Af";
    case "mountain":
      return "#A9A9A9";
    case "plains":
      return "#90EE90";
    default:
      return "#CCCCCC";
  }
};

// Convert axial coordinates to 3D position
const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65;
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};

const InteractiveBoard = ({ board, setHoveredTile, isDraggingRef }) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const elements = [];

  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();

    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;

    const sameTile =
      tile &&
      prev &&
      tile.q === prev.q &&
      tile.r === prev.r &&
      tile.type === prev.type;

    if (sameTile || (!tile && !prev)) return;

    previousTileRef.current = tile;
    setHoveredTile(tile);
  };

  board.tiles.forEach((tile) => {
    const { q, r, type, height, river } = tile;
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    elements.push(
      <group key={`tile-${q}-${r}`}>
        <Bestagon
          position={[pos[0], height, pos[2]]}
          color={color}
          userData={{ tile: { q, r, type, height, river } }} // include river explicitly
        />
        {river && (
          <mesh position={[pos[0], height + 0.1, pos[2]]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#0000FF" />
          </mesh>
        )}
      </group>
    );
  });

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {elements}
    </group>
  );
};

export default function HexBoard({ board }) {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null);

  const handlePointerDown = () => {
    isDraggingRef.current = true;
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const handlePointerUp = () => {
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      dragTimeoutRef.current = null;
    }, 800);
  };

  return (
    <div className="relative">
      <Canvas
        camera={{ position: [10, 10, 15] }}
        style={{ width: "100vw", height: "100vh" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 20, 10]} />
        <InteractiveBoard
          board={board}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
        />
        <MapControls enableDamping />
      </Canvas>
      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
