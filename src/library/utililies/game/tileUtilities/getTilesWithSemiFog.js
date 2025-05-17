import { hexDistance } from "./distanceFinder";

/**
 * Returns a new tiles array with a `semiFogged` property set to true for tiles that:
 * - are discovered
 * - are NOT currently in vision of any friendly piece
 * - do NOT have a building
 */
export function getTilesWithSemiFog(tiles, pieces) {
  // Compute visible tiles
  const visibleTiles = new Set();
  pieces.forEach((piece) => {
    tiles.forEach((tile) => {
      if (hexDistance(tile, piece) <= (piece.vision ?? 2)) {
        visibleTiles.add(`${tile.q},${tile.r}`);
      }
    });
  });

  return tiles.map((tile) => {
    const key = `${tile.q},${tile.r}`;
    const isVisible = visibleTiles.has(key);
    const hasBuilding = !!tile.building;
    return {
      ...tile,
      semiFogged: tile.discovered && !isVisible && !hasBuilding,
    };
  });
}
