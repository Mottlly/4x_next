import React from "react";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { isTileVisible } from "../../../../../../library/utililies/game/tileUtilities/lineOfSight/isVisibleHelper";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";
import GoodyHut from "../../models/pieces/GoodyHut";

function NeutralPiecesLayer({
  neutralPieces,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  return (
    <>
      {neutralPieces.map((p) => {
        const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile || !isTileVisible(tile)) return null;

        const [x, , z] = hexToPosition(p.q, p.r, spacing);
        const y = tile.height * heightScale + 0.5;
        const style = pieceTypeStyles[p.type] || { color: "orange" };

        return (
          <group
            key={`neutral-piece-${p.id}`}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onTileClick?.(tile, p);
            }}
          >
            {p.type === "goodyHut" ? (
              <GoodyHut />
            ) : (
              <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
                <meshStandardMaterial color={style.color} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

export default React.memo(NeutralPiecesLayer);
