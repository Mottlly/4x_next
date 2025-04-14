import { hexToPosition, getNeighborsAxial } from "../hexUtilities";

/**
 * Returns the neighboring tiles of a given tile from board.tiles
 * by using the new getNeighborsAxial utility.
 */
export function getNeighbors(tile, board) {
  // Get the axial coordinates for all neighbors.
  const neighborCoords = getNeighborsAxial(tile.q, tile.r);

  // Map those coordinates into actual tile objects using board.tiles.
  return neighborCoords
    .map(({ q, r }) => board.tiles.find((t) => t.q === q && t.r === r))
    .filter(Boolean);
}

/**
 * Computes the Euclidean distance on the XZ-plane between two tiles.
 */
export function distanceBetweenTiles(tileA, tileB, spacing) {
  const posA = hexToPosition(tileA.q, tileA.r, spacing);
  const posB = hexToPosition(tileB.q, tileB.r, spacing);
  const dx = posA[0] - posB[0];
  const dz = posA[2] - posB[2];
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Returns the distance from a tile to the nearest water or lake tile.
 */
export function nearestWaterDistance(tile, waterTiles, spacing) {
  let minDist = Infinity;
  for (const wt of waterTiles) {
    const d = distanceBetweenTiles(tile, wt, spacing);
    if (d < minDist) {
      minDist = d;
    }
  }
  return minDist;
}

/**
 * Generates rivers on the board using the specified source tiles.
 */
export function generateRivers(board, sourceTiles) {
  const waterTiles = board.tiles.filter(
    (tile) => tile.type === "water" || tile.type === "lake"
  );

  sourceTiles.forEach((sourceTile) => {
    let currentTile = sourceTile;
    currentTile.river = true;
    let iterations = 0;

    while (
      iterations < 10 &&
      currentTile &&
      currentTile.type !== "water" &&
      currentTile.type !== "lake"
    ) {
      const neighbors = getNeighbors(currentTile, board);
      if (neighbors.length === 0) break;

      let candidates = neighbors.filter((n) => n.height <= currentTile.height);
      const downhill = candidates.filter((n) => n.height < currentTile.height);
      if (downhill.length > 0) {
        candidates = downhill;
      }
      if (candidates.length === 0) break;

      let bestCandidate = null;
      let bestDistance = Infinity;
      for (const candidate of candidates) {
        const d = nearestWaterDistance(candidate, waterTiles, board.spacing);
        if (d < bestDistance) {
          bestDistance = d;
          bestCandidate = candidate;
        }
      }
      if (!bestCandidate) break;

      if (iterations >= 7) {
        const lakeProb = (iterations - 7 + 1) / 3;
        if (Math.random() < lakeProb) {
          bestCandidate.type = "lake";
          break;
        }
      }

      bestCandidate.river = true;
      currentTile = bestCandidate;
      iterations++;
    }
  });
}
