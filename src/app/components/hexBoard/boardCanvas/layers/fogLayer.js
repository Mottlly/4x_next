import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import FogBestagon from "../fogagon";
import { fogStyles } from "@/library/styles/stylesIndex";

function FogLayer({ tiles, spacing, heightScale, onTileClick }) {
  const fogThickness = fogStyles.geometry.args[2];
  const fogYOffset = 0.01;

  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y =
          tile.height * heightScale + 0.25 + fogThickness / 2 + fogYOffset;
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
