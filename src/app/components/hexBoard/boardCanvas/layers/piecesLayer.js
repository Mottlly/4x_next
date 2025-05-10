import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";

export default function PiecesLayer({
  pieces,
  selectedPieceId,
  board,
  heightScale,
  onTileClick,
}) {
  return (
    <>
      {pieces.map((p) => {
        const tile = board.tiles.find((t) => t.q === p.q && t.r === p.r);
        if (!tile) return null;
        const [x, , z] = hexToPosition(p.q, p.r, board.spacing);
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
