import hexToPosition from "../tileUtilities/Positioning/positionFinder";
import getNeighborsAxial from "../tileUtilities/Positioning/getNeighbors";

/**
 * Given board.tiles and board.tileMap (a Map<"q,r",tile>), carve rivers from sourceTiles.
 * Returns an array of river paths (each path is an array of tiles in order).
 */
export function generateRivers(board, sourceTiles) {
  const { tiles, tileMap, spacing } = board;
  const waterTiles = tiles.filter(
    (t) => t.type === "water" || t.type === "lake"
  );

  const riverPaths = [];

  sourceTiles.forEach((source) => {
    let current = source;
    const path = [];
    // mark the source
    current.riverPresent = true;
    path.push(current);

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

      // If the next tile is water or lake, stop here
      if (best.type === "water" || best.type === "lake") {
        best.riverPresent = true;
        path.push(best);
        break;
      }

      // carve the river
      best.riverPresent = true;
      path.push(best);

      // advance
      current = best;
      iterations++;
    }

    // Only add non-trivial rivers (length > 1)
    if (path.length > 1) {
      riverPaths.push(path);
    }
  });

  return riverPaths;
}
