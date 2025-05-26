import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import FogBestagon from "../fogagon";

function FogLayer({ tiles, spacing, heightScale, onTileClick }) {
  const fogThickness = 0.18; // thinner fog, adjust as needed
  const fogYOffset = 0.01;   // small lift to avoid z-fighting

  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        // Center the fog so its bottom sits just above the tile's top
        const y = tile.height * heightScale + 0.25 + (fogThickness / 2) + fogYOffset;
        return (
          <FogBestagon
            key={`fog-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            userData={{ tile }}
            onClick={() => onTileClick(tile)}
            radius={spacing}
            thickness={fogThickness}
            speed={0.5}
          />
        );
      })}
    </>
  );
}

export default React.memo(FogLayer);
