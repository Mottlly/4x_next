import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

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
            <meshStandardMaterial
              color={
                selectedPieceId === p.id
                  ? "yellow"
                  : p.type === "pod"
                  ? "green"
                  : "red"
              }
            />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(PiecesLayer);
