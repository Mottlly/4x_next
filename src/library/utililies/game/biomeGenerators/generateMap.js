import { createNoise2D } from "simplex-noise";
import hexToPosition from "../tileUtilities/positionFinder";
import getNeighborsAxial from "../tileUtilities/getNeighbors";
import { generateRivers } from "../otherGenerators/riverGenerator";

export function generateBiomeMap(cols, rows, seed = Math.random()) {
  const elevationNoise = createNoise2D(() => seed);
  const biomeNoise = createNoise2D(() => seed + 500);

  const elevationScale = 0.05;
  const biomeScale = 0.08;
  const tiles = [];

  // Step 1: Generate Tiles with Discrete Elevation Levels and Biomes
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const rawElev =
        (elevationNoise(q * elevationScale, r * elevationScale) + 1) / 2;
      let elevationLevel = Math.floor(rawElev * 4) + 1;
      if (elevationLevel > 4) elevationLevel = 4;

      let type;
      if (elevationLevel === 1) {
        type = "water";
      } else if (elevationLevel === 4) {
        type = "mountain";
      } else {
        const rawBiome = (biomeNoise(q * biomeScale, r * biomeScale) + 1) / 2;
        if (rawBiome < 0.33) {
          type = "plains";
        } else if (rawBiome < 0.66) {
          type = "grassland";
        } else {
          type = "forest";
        }
      }

      tiles.push({
        q,
        r,
        type,
        height: elevationLevel,
        elevationLevel,
        discovered: false,
      });
    }
  }

  // Create a lookup for fast access by coordinates.
  const tileMap = new Map();
  tiles.forEach((t) => {
    tileMap.set(`${t.q},${t.r}`, t);
  });

  // Step 2: Flood-Fill Water Regions to Identify Lakes
  const visited = new Set();
  for (const tile of tiles) {
    const key = `${tile.q},${tile.r}`;
    if (tile.type === "water" && !visited.has(key)) {
      const region = [];
      let touchesBorder = false;
      const stack = [tile];

      while (stack.length) {
        const current = stack.pop();
        const currentKey = `${current.q},${current.r}`;
        if (visited.has(currentKey)) continue;
        visited.add(currentKey);
        region.push(current);

        // If region touches the border, it remains water.
        if (
          current.q === 0 ||
          current.r === 0 ||
          current.q === cols - 1 ||
          current.r === rows - 1
        ) {
          touchesBorder = true;
        }

        const neighbors = getNeighborsAxial(current.q, current.r);
        for (const n of neighbors) {
          const nKey = `${n.q},${n.r}`;
          const nTile = tileMap.get(nKey);
          if (nTile && nTile.type === "water" && !visited.has(nKey)) {
            stack.push(nTile);
          }
        }
      }

      // Convert isolated water regions to lakes.
      if (!touchesBorder) {
        region.forEach((t) => {
          t.type = "lake";
        });
      }
    }
  }

  // Step 3: Upgrade Fully Surrounded Mountain Tiles to Impassable Mountains
  for (const tile of tiles) {
    if (tile.type === "mountain" && tile.elevationLevel === 4) {
      let isSurrounded = true;
      const neighbors = getNeighborsAxial(tile.q, tile.r);
      for (const n of neighbors) {
        const nKey = `${n.q},${n.r}`;
        const nTile = tileMap.get(nKey);
        if (!nTile || nTile.type !== "mountain") {
          isSurrounded = false;
          break;
        }
      }
      if (isSurrounded) {
        tile.type = "impassable mountain";
        tile.height = 5;
        tile.elevationLevel = 5;
      }
    }
  }

  // Step 4: River Generation
  const board = {
    cols,
    rows,
    spacing: 1.05, // Adjust if needed
    tiles,
  };
  const riverProbability = 0.04; // 4% chance to start a river on a mountain tile
  const sourceTiles = tiles.filter(
    (t) =>
      t.type === "mountain" &&
      t.elevationLevel === 4 &&
      Math.random() < riverProbability
  );

  generateRivers(board, sourceTiles);

  return tiles;
}
