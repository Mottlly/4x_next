import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import Bestagon from "@/app/components/bestagon";
import boardData from "../../library/defaultBoard";
import TileInfoPanel from "../components/gameUI/infoTile";

const getColorForType = (type) => {
  switch (type) {
    case "water":
      return "blue";
    case "forest":
      return "#90EE90";
    case "desert":
      return "yellow";
    default:
      return "gray";
  }
};

const hexToPosition = (q, r, spacing) => {
  const xOffset = spacing * 1.65;
  const zOffset = spacing * 1.42;
  return [q * xOffset + (r % 2) * (xOffset / 2), 0, -r * zOffset];
};

const InteractiveBoard = ({ board, setHoveredTile, isDraggingRef }) => {
  const groupRef = useRef();

  const previousTileRef = useRef(null);

  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return; // 🧠 Do nothing while dragging

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

  const elements = [];

  const landTilePositions = new Set(board.tiles.map(({ q, r }) => `${q},${r}`));

  for (let q = 0; q < board.cols; q++) {
    for (let r = 0; r < board.rows; r++) {
      if (!landTilePositions.has(`${q},${r}`)) {
        const pos = hexToPosition(q, r, board.spacing);
        const tile = { q, r, type: "water" };
        elements.push(
          <Bestagon
            key={`water-${q}-${r}`}
            position={pos}
            color="blue"
            userData={{ tile }}
          />
        );
      }
    }
  }

  board.tiles.forEach(({ q, r, type }) => {
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    const tile = { q, r, type };
    elements.push(
      <Bestagon
        key={`tile-${q}-${r}`}
        position={[pos[0], 0.3, pos[2]]}
        color={color}
        userData={{ tile }}
      />
    );
  });

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {elements}
    </group>
  );
};

export default function App() {
  const [hoveredTile, setHoveredTile] = useState(null);
  const isDraggingRef = useRef(false);
  const dragTimeoutRef = useRef(null); // 🆕 Store timeout ID

  const handlePointerDown = () => {
    isDraggingRef.current = true;

    // Clear any previous timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const handlePointerUp = () => {
    // Set a delay before allowing hover again
    dragTimeoutRef.current = setTimeout(() => {
      isDraggingRef.current = false;
      dragTimeoutRef.current = null;
    }, 800); // ⏳ Adjust this for inertia feel
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
          board={boardData}
          setHoveredTile={setHoveredTile}
          isDraggingRef={isDraggingRef}
        />
        <MapControls enableDamping />
      </Canvas>
      <TileInfoPanel tile={hoveredTile} />
    </div>
  );
}
