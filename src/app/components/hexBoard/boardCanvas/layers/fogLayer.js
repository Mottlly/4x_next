import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";
import FogBestagon from "../fogagon";

export default function FogLayer({ board, heightScale, onTileClick }) {
  return (
    <>
      {board.tiles
        .filter((t) => !t.discovered)
        .map((tile) => {
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.01;
          return (
            <FogBestagon
              key={`fog-${tile.q}-${tile.r}`}
              position={[x, y, z]}
              userData={{ tile }}
              onClick={() => onTileClick(tile)}
              radius={board.spacing}
              thickness={0.3}
              speed={0.5}
            />
          );
        })}
    </>
  );
}
