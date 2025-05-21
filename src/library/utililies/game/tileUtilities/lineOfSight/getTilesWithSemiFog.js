import { getTilesWithLOS } from "./sightLineAlgo";
import { buildingOptions } from "../../gamePieces/schemas/buildBank";

/**
 * Returns a new tiles array with a `semiFogged` property set to true for tiles that:
 * - are discovered
 * - are NOT currently in vision of any friendly piece or building
 * - do NOT have a building
 */
export function getTilesWithSemiFog(tiles, pieces) {
  // Gather all vision sources: pieces and buildings with vision
  const visionSources = [
    ...pieces.map((piece) => ({
      q: piece.q,
      r: piece.r,
      vision: piece.vision ?? 2,
    })),
    ...tiles
      .filter((tile) => tile.building && buildingOptions[tile.building]?.vision)
      .map((tile) => ({
        q: tile.q,
        r: tile.r,
        vision: buildingOptions[tile.building].vision,
      })),
  ];

  // Use LOS to determine visible tiles
  const tilesWithLOS = getTilesWithLOS(tiles, visionSources);

  return tilesWithLOS.map((tile) => {
    const hasBuilding = !!tile.building;
    return {
      ...tile,
      semiFogged: tile.discovered && !tile.visible && !hasBuilding,
    };
  });
}
