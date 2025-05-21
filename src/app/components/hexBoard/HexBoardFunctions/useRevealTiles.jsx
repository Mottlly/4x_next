import { useEffect } from "react";
import { getTilesWithLOS } from "../../../../library/utililies/game/tileUtilities/lineOfSight/sightLineAlgo";
import { buildingOptions } from "../../../../library/utililies/game/gamePieces/schemas/buildBank";

export default function useRevealTiles(board, pieces, setBoard) {
  useEffect(() => {
    let changed = false;

    // Gather all vision sources: pieces and buildings with vision
    const visionSources = [
      ...pieces.map((piece) => ({
        q: piece.q,
        r: piece.r,
        vision: piece.vision ?? 2,
      })),
      ...board.tiles
        .filter(
          (tile) => tile.building && buildingOptions[tile.building]?.vision
        )
        .map((tile) => ({
          q: tile.q,
          r: tile.r,
          vision: buildingOptions[tile.building].vision,
        })),
    ];

    // Use LOS to determine visible tiles
    const tilesWithLOS = getTilesWithLOS(board.tiles, visionSources);

    const newTiles = board.tiles.map((tile) => {
      const losTile = tilesWithLOS.find(
        (t) => t.q === tile.q && t.r === tile.r
      );
      if (tile.discovered) return tile;
      if (losTile && losTile.visible) {
        changed = true;
        return { ...tile, discovered: true };
      }
      return tile;
    });

    if (changed) {
      setBoard((b) => ({ ...b, tiles: newTiles }));
    }
  }, [board.tiles, pieces, setBoard]);
}
