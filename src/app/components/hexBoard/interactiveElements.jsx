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

    // Bail out if nothing really changed:
    if (
      (!tile && !prev) || // both null
      (tile &&
        prev &&
        tile.q === prev.q &&
        tile.r === prev.r &&
        tile.type === prev.type) // same tile
    ) {
      return;
    }

    // Otherwise record and emit
    previousTileRef.current = tile;
    setHoveredTile(tile);
  };

  const elements = board.tiles.map((tile) => {
    const { q, r, type, height, river } = tile;
    const [x, , z] = hexToPosition(q, r, board.spacing);
    const color = getColourForType(type);

    return (
      <group key={`${q}-${r}`}>
        <Bestagon
          position={[x, height * heightScale, z]}
          color={color}
          userData={{ tile }}
          onClick={() => onTileClick(tile)}
        />
        {river && (
          <mesh position={[x, height * heightScale + 0.1, z]}>
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
