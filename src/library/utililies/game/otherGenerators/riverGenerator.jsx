import hexToPosition from "../tileUtilities/positionFinder";
import getNeighborsAxial from "../tileUtilities/getNeighbors";

/**
 * Given board.tiles and board.tileMap (a Map<"q,r",tile>), carve rivers from sourceTiles.
 * Returns an array of tiles that became river segments.
 */
export function generateRivers(board, sourceTiles) {
  const { tiles, tileMap, spacing } = board;
  const waterTiles = tiles.filter(
    (t) => t.type === "water" || t.type === "lake"
  );

  const riverSegments = [];

  sourceTiles.forEach((source) => {
    let current = source;
    // mark the source
    current.riverPresent = true;
    riverSegments.push(current);

    let iterations = 0;
    while (
      iterations < 10 &&
      current.type !== "water" &&
      current.type !== "lake"
    ) {
      // get the actual tile objects via fast Map lookups
      const neighbors = getNeighborsAxial(current.q, current.r)
        .map(({ q, r }) => tileMap.get(`${q},${r}`))
        .filter(Boolean);

      if (!neighbors.length) break;

      // only move downhill (or flat) toward water
      let candidates = neighbors.filter((n) => n.height <= current.height);
      const downhill = candidates.filter((n) => n.height < current.height);
      if (downhill.length) candidates = downhill;
      if (!candidates.length) break;

      // pick the neighbor closest to any water tile
      let best = candidates[0];
      let bestDist = Infinity;
      candidates.forEach((c) => {
        // Euclidean on XZ-plane
        const [x1, , z1] = hexToPosition(c.q, c.r, spacing);
        waterTiles.forEach((wt) => {
          const [x2, , z2] = hexToPosition(wt.q, wt.r, spacing);
          const d = (x1 - x2) ** 2 + (z1 - z2) ** 2;
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        });
      });

      // chance to spawn a lake after iteration 7–10
      if (iterations >= 7) {
        const lakeProb = (iterations - 7 + 1) / 3; // .33, .66, 1
        if (Math.random() < lakeProb) {
          best.type = "lake";
          best.riverPresent = true;
          riverSegments.push(best);
          break;
        }
      }

      // carve the river
      best.riverPresent = true;
      riverSegments.push(best);

      // advance
      current = best;
      iterations++;
    }
  });

  return riverSegments;
}
