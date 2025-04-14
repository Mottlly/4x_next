// InteractiveBoard.jsx
import React, { useRef } from "react";
import Bestagon from "./bestagon";
import { getColorForType, hexToPosition } from "./hexUtilities";

const InteractiveBoard = ({ board, setHoveredTile, isDraggingRef }) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const heightScale = 0.5; // Scale for tile height.
  const elements = [];

  // Handles pointer movement over the board.
  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();
    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;
    if (
      tile &&
      prev &&
      tile.q === prev.q &&
      tile.r === prev.r &&
      tile.type === prev.type
    )
      return;
    previousTileRef.current = tile;
    setHoveredTile(tile); // Update hovered tile.
  };

  // Render each tile and optional river sphere.
  board.tiles.forEach((tile) => {
    const { q, r, type, height, river } = tile;
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColorForType(type);
    elements.push(
      <group key={`tile-${q}-${r}`}>
        <Bestagon
          position={[pos[0], height * heightScale, pos[2]]}
          color={color}
          userData={{ tile: { q, r, type, height, river } }}
        />
        {river && (
          <mesh position={[pos[0], height * heightScale + 0.1, pos[2]]}>
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

export default InteractiveBoard;
