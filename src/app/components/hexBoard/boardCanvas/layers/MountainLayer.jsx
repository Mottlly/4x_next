import React, { useMemo } from "react";
import MountainMesh from "../models/mountainMesh";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

function getOuterRingPositions(q, r, spacing, tileHeight, count = 8, radiusFactor = 0.7) {
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

function MountainLayer({ tiles, spacing, heightScale }) {
  const mountains = useMemo(() => {
    return tiles
      .filter((tile) => tile.type === "mountain" && tile.discovered)
      .flatMap((tile) => {
        const y = tile.height * heightScale + 0.01;
        const positions = getOuterRingPositions(tile.q, tile.r, spacing, y, 8, 0.7);
        return positions.map(({ pos, rot }, i) => ({
          key: `mountain-${tile.q}-${tile.r}-${i}`,
          pos,
          scale: 0.55 + 0.18 * Math.sin(i * 1.7 + tile.q + tile.r),
          rot,
        }));
      });
  }, [tiles, spacing, heightScale]);

  return (
    <>
      {mountains.map(({ key, pos, scale, rot }) => (
        <MountainMesh key={key} position={pos} scale={scale} rotation={rot} />
      ))}
    </>
  );
}

export default React.memo(MountainLayer);