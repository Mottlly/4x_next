import { hexDistance } from "./distanceFinder";
import { BUILDING_CONFIG } from "../gamePieces/buildBank";

/**
 * Returns a new tiles array with a `semiFogged` property set to true for tiles that:
 * - are discovered
 * - are NOT currently in vision of any friendly piece or building
 * - do NOT have a building
 */
export function getTilesWithSemiFog(tiles, pieces) {
  // Filter out tiles that are not discovered
  const visionSources = [
    ...pieces.map((piece) => ({
      q: piece.q,
      r: piece.r,
      vision: piece.vision ?? 2,
    })),
    ...tiles
      .filter((tile) => tile.building && BUILDING_CONFIG[tile.building]?.vision)
      .map((tile) => ({
        q: tile.q,
        r: tile.r,
        vision: BUILDING_CONFIG[tile.building].vision,
      })),
  ];

  // Compute visible tiles
  const visibleTiles = new Set();
  visionSources.forEach((source) => {
    tiles.forEach((tile) => {
      if (hexDistance(tile, source) <= source.vision) {
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
