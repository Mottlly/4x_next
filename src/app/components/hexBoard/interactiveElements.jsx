// InteractiveBoard.jsx
import React, { useRef } from "react";
import Bestagon from "./bestagon";
import hexToPosition from "../../../library/utililies/game/tileUtilities/positionFinder";
import getNeighborsAxial from "../../../library/utililies/game/tileUtilities/getNeighbors";
import getColourForType from "../../../library/utililies/game/tileUtilities/getColourForType";

const InteractiveBoard = ({
  board,
  setHoveredTile,
  isDraggingRef,
  onTileClick,
}) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const heightScale = 0.5; // Scale for tile height.

  // Handles pointer movement over the board.
  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();
    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;
    // Only update if the pointer moves to a different tile.
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

  const elements = [];

  // Render each tile along with the river sphere if the tile data indicates river.
  board.tiles.forEach((tile) => {
    const { q, r, type, height, river } = tile;
    const pos = hexToPosition(q, r, board.spacing);
    const color = getColourForType(type);
    elements.push(
      <group key={`tile-${q}-${r}`}>
        <Bestagon
          position={[pos[0], height * heightScale, pos[2]]}
          color={color}
          userData={{ tile: { q, r, type, height, river } }}
          onClick={() => {
            console.log("InteractiveBoard: tile clicked →", tile);
            onTileClick(tile);
          }}
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
