import React from "react";
import hexToPosition from "../../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { pieceTypeStyles } from "@/library/styles/stylesIndex";

function PiecesLayer({
  pieces,
  selectedPieceId,
  tiles,
  spacing,
  heightScale,
  onTileClick,
}) {
  return (
    <>
      {pieces.map((p) => {
        const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile) return null;

        const [x, , z] = hexToPosition(p.q, p.r, spacing);
        const y = tile.height * heightScale + 0.5;
        const style =
          selectedPieceId === p.id
            ? { color: "yellow" }
            : pieceTypeStyles[p.type] || pieceTypeStyles.default;

        return (
          <mesh
            key={`piece-${p.id}`}
            position={[x, y, z]}
            onClick={(e) => {
              e.stopPropagation();
              onTileClick(tile);
            }}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.6, 16]} />
            <meshStandardMaterial color={style.color} />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(PiecesLayer);
