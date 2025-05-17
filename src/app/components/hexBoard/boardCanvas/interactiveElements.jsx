import React, { useRef } from "react";
import Bestagon from "./bestagon";
import hexToPosition from "../../../../library/utililies/game/tileUtilities/positionFinder";
import getColourForType from "../../../../library/utililies/game/tileUtilities/getColourForType";

const InteractiveBoard = ({
  board,
  setHoveredTile,
  isDraggingRef,
  onTileClick,
}) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const heightScale = 0.5; // Scale for tile height.

  // Pointer‐move logic unchanged…
  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();
    const intersect = event.intersections?.[0];
    const tile = intersect?.object?.userData?.tile || null;
    const prev = previousTileRef.current;
    if (
      (!tile && !prev) ||
      (tile &&
        prev &&
        tile.q === prev.q &&
        tile.r === prev.r &&
        tile.type === prev.type)
    ) {
      return;
    }
    previousTileRef.current = tile;
    setHoveredTile(tile);
  };

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {board.tiles.map((tile) => {
        const { q, r, type, height, riverPresent } = tile;
        const [x, , z] = hexToPosition(q, r, board.spacing);
        const color = getColourForType(type);

        return (
          <group key={`${q}-${r}`}>
            <Bestagon
              position={[x, height * heightScale, z]}
              color={color}
              userData={{ tile }}
              onClick={() => onTileClick(tile)}
              spacing={board.spacing}
            />

            {/* draw a little blue sphere if this tile has a river */}
            {riverPresent && (
              <mesh position={[x, height * heightScale + 0.1, z]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="deepskyblue" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

export default InteractiveBoard;
