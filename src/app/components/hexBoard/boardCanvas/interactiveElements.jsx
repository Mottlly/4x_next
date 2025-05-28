import React, { useRef } from "react";
import Bestagon from "./bestagon";
import hexToPosition from "../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import getColourForType from "../../../../library/utililies/game/tileUtilities/typeChecks/getColourForType";
import { tileTypeStyles } from "@/library/styles/stylesIndex"; // <-- import your styles

const InteractiveBoard = ({
  board,
  setHoveredTile,
  isDraggingRef,
  onTileClick,
}) => {
  const groupRef = useRef();
  const previousTileRef = useRef(null);
  const heightScale = 0.5; // Scale for tile height.

  const handlePointerMove = (event) => {
    if (isDraggingRef.current) return;
    event.stopPropagation();
    const tileIntersect = event.intersections?.find(
      (i) => i.object?.userData?.tile
    );
    const tile = tileIntersect?.object?.userData?.tile || null;
    setHoveredTile(tile, event.pointerEvent); // Pass the native pointer event
  };

  return (
    <group ref={groupRef} onPointerMove={handlePointerMove}>
      {board.tiles.map((tile) => {
        const { q, r, type, height, riverPresent } = tile;
        const [x, , z] = hexToPosition(q, r, board.spacing);
        const color = getColourForType(type);
        const style = tileTypeStyles[type] || tileTypeStyles.default; // <-- define style here
        const thickness = style.geometry.args[2];
        const topY = height * heightScale;

        return (
          <group key={`${q}-${r}`}>
            <Bestagon
              position={[x, topY, z]}
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
