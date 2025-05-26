import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import SemiFogBestagon from "../SemiFogBestagon";

function SemiFogLayer({ tiles, spacing, heightScale }) {
  const fogHeight = spacing * 0.05;
  const fogYOffset = 0.3;

  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + fogYOffset;
        return (
          <SemiFogBestagon
            key={`semifog-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            radius={spacing}
            thickness={fogHeight}
            speed={0.25}
          />
        );
      })}
    </>
  );
}

export default React.memo(SemiFogLayer);
