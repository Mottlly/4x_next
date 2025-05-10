import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";
import FogBestagon from "../fogagon";

function FogLayer({ tiles, spacing, heightScale, onTileClick }) {
  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + 0.01;
        return (
          <FogBestagon
            key={`fog-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            userData={{ tile }}
            onClick={() => onTileClick(tile)}
            radius={spacing}
            thickness={0.3}
            speed={0.5}
          />
        );
      })}
    </>
  );
}

export default React.memo(FogLayer);
