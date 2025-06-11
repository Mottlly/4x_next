import React, { useMemo } from "react";
import PineTreeMesh from "../models/pineTreeMesh";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

function getOuterRingPositions(
  q,
  r,
  spacing,
  tileHeight,
  count = 12,
  radiusFactor = 0.78
) {
  // Returns positions around the outer edge of a hex tile
  const [cx, , cz] = hexToPosition(q, r, spacing);
  const y = tileHeight;
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.PI / 6 + i * ((2 * Math.PI) / count); // offset so not aligned with corners
    const px = cx + Math.cos(angle) * spacing * radiusFactor;
    const pz = cz + Math.sin(angle) * spacing * radiusFactor;
    positions.push([px, y, pz]);
  }
  return positions;
}

function PineTreeLayer({ tiles, spacing, heightScale }) {
  const pineTrees = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "forest" && tile.discovered) // <-- add tile.discovered
      .flatMap((tile) => {
        const y = tile.height * heightScale + 0.01;
        const positions = getOuterRingPositions(
          tile.q,
          tile.r,
          spacing,
          y,
          12,
          0.78
        );
        return positions.map((pos, i) => ({
          key: `pine-${tile.q}-${tile.r}-${i}`,
          pos,
          scale: 0.32 + 0.12 * Math.sin(i * 2.1 + tile.q + tile.r),
        }));
      });
  }, [tiles, spacing, heightScale]);

  return (
    <>
      {pineTrees.map(({ key, pos, scale }) => (
        <PineTreeMesh key={key} position={pos} scale={scale} />
      ))}
    </>
  );
}

export default React.memo(PineTreeLayer);
