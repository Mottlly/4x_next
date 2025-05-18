import { hexDistance } from "./distanceFinder";
import { hexLine } from "./sightLineTiles";
import { VISION_BLOCKING_TILE_TYPES } from "./visionBlockingTypes";
import getNeighborsAxial from "./getNeighbors";

export function getTilesWithLOS(tiles, visionSources) {
  const tileMap = new Map(tiles.map((t) => [`${t.q},${t.r}`, t]));
  const visibleTiles = new Set();

  for (const source of visionSources) {
    for (const tile of tiles) {
      if (hexDistance(source, tile) > source.vision) continue;

      // Check direct line and lines to each neighbor of the target tile
      const neighborCoords = getNeighborsAxial(tile.q, tile.r);
      const linesToCheck = [
        tile,
        ...neighborCoords
          .map(({ q, r }) => tileMap.get(`${q},${r}`))
          .filter(Boolean),
      ];

      let visible = false;
      for (const target of linesToCheck) {
        const line = hexLine(source, target);

        // Add this debug log:
        console.log(
          `LOS from (${source.q},${source.r}) to (${tile.q},${tile.r}):`,
          line.map((l) => tileMap.get(`${l.q},${l.r}`)?.type)
        );

        let blocked = false;
        for (let i = 1; i < line.length; i++) {
          const step = tileMap.get(`${line[i].q},${line[i].r}`);
          if (!step) continue;
          if (VISION_BLOCKING_TILE_TYPES.has(step.type)) {
            blocked = true;
            break;
          }
        }
        if (!blocked) {
          visible = true;
          break;
        }
      }
      if (visible) visibleTiles.add(`${tile.q},${tile.r}`);
    }
  }

  return tiles.map((tile) => {
    const key = `${tile.q},${tile.r}`;
    return {
      ...tile,
      visible: visibleTiles.has(key),
    };
  });
}
