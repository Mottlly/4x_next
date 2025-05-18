import { hexDistance } from "./distanceFinder";
import { hexLine } from "./sightLineTiles";
import { VISION_BLOCKING_TILE_TYPES } from "./visionBlockingTypes";

export function getTilesWithLOS(tiles, visionSources) {
  const tileMap = new Map(tiles.map((t) => [`${t.q},${t.r}`, t]));
  const visibleTiles = new Set();

  for (const source of visionSources) {
    for (const tile of tiles) {
      if (hexDistance(source, tile) > source.vision) continue;
      const line = hexLine(source, tile);
      let blocked = false;
      for (let i = 1; i < line.length; i++) {
        const step = tileMap.get(`${line[i].q},${line[i].r}`);
        if (!step) continue;
        if (VISION_BLOCKING_TILE_TYPES.has(step.type)) {
          if (i < line.length - 1) blocked = true;
          break;
        }
      }
      if (!blocked) visibleTiles.add(`${tile.q},${tile.r}`);
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
