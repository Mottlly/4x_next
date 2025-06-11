import React, { useMemo } from "react";
import TallGrassPatch from "../models/tallGrassPatch";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

function getOuterRingPositions(q, r, spacing, tileHeight, count = 12, radiusFactor = 0.78) {
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.PI / 6 + i * ((2 * Math.PI) / count);
    const px = cx + Math.cos(angle) * spacing * radiusFactor;
    const pz = cz + Math.sin(angle) * spacing * radiusFactor;
    positions.push({ pos: [px, y, pz], rot: angle + Math.random() * 0.6 });
  }
  return positions;
}

function GrassPatchLayer({ tiles, spacing, heightScale }) {
  const grassPatches = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "plains" && tile.discovered)
      .flatMap((tile) => {
        const y = tile.height * heightScale + 0.01;
        const positions = getOuterRingPositions(tile.q, tile.r, spacing, y, 30, 0.78);
        return positions.map(({ pos, rot }, i) => ({
          key: `grass-${tile.q}-${tile.r}-${i}`,
          pos,
          scale: (0.5 + 0.18 * Math.sin(i * 1.7 + tile.q + tile.r)) * 1.1,
          rot,
        }));
      });
  }, [tiles, spacing, heightScale]);

  return (
    <>
      {grassPatches.map(({ key, pos, scale, rot }) => (
        <TallGrassPatch key={key} position={pos} scale={scale} rotation={rot} />
      ))}
    </>
  );
}

export default React.memo(GrassPatchLayer);
