import React from "react";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { isTileVisible } from "../../../../../../library/utililies/game/tileUtilities/lineOfSight/isVisibleHelper";

function HostilePiecesLayer({
  hostilePieces,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  return (
    <>
      {hostilePieces.map((p) => {
        const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile || !isTileVisible(tile)) return null;

        const [x, , z] = hexToPosition(p.q, p.r, spacing);
        const y = tile.height * heightScale + 0.5;

        return (
          <mesh
            key={`hostile-piece-${p.id}`}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onTileClick?.(tile, p); // Optionally handle click
            }}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(HostilePiecesLayer);
