import { createNoise2D } from "simplex-noise";
import getNeighborsAxial from "../tileUtilities/Positioning/getNeighbors";
import { generateRivers } from "../otherGenerators/riverGenerator";
import { defaultTile } from "../tileUtilities/tileSchema";

/**
 * Generates a biome map with elevation, biomes, lakes, clustered impassable peaks, and rivers.
 * Impassable clusters are fully surrounded by regular mountain tiles.
 * @param {number} cols - number of columns (q-axis)
 * @param {number} rows - number of rows (r-axis)
 * @param {number} [seed=Math.random()] - optional seed for noise
 * @returns {Array<Object>} array of tile objects
 */
export function generateBiomeMap(cols, rows, seed = Math.random()) {
  const elevationNoise = createNoise2D(() => seed);
  const biomeNoise = createNoise2D(() => seed + 500);
  const peakNoise = createNoise2D(() => seed + 1000);

  const elevationScale = 0.05;
  const biomeScale = 0.08;
  const peakScale = 0.1; // controls cluster roughness

  // Step 1: generate base tiles using defaultTile
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const rawElev =
        (elevationNoise(q * elevationScale, r * elevationScale) + 1) / 2;
      let elevationLevel = Math.min(4, Math.floor(rawElev * 4) + 1);

      let type;
      if (elevationLevel === 1) {
        type = "water";
      } else if (elevationLevel === 4) {
        type = "mountain";
      } else {
        const rawBiome = (biomeNoise(q * biomeScale, r * biomeScale) + 1) / 2;
        type =
          rawBiome < 0.33 ? "plains" : rawBiome < 0.66 ? "grassland" : "forest";
      }

      tiles.push({
        ...defaultTile,
        q,
        r,
        type,
        height: elevationLevel,
        elevationLevel,
        discovered: false,
      });
    }
  }

  // Build a quick lookup map for neighbors
  const tileMap = new Map(tiles.map((t) => [`${t.q},${t.r}`, t]));

  // Step 2: identify lakes by flood-filling interior water regions
  const visited = new Set();
  tiles.forEach((tile) => {
    const key = `${tile.q},${tile.r}`;
    if (tile.type === "water" && !visited.has(key)) {
      const region = [];
      let touchesBorder = false;
      const stack = [tile];

      while (stack.length) {
        const current = stack.pop();
        const cKey = `${current.q},${current.r}`;
        if (visited.has(cKey)) continue;
        visited.add(cKey);
        region.push(current);

        // border check
        if (
          current.q === 0 ||
          current.r === 0 ||
          current.q === cols - 1 ||
          current.r === rows - 1
        )
          touchesBorder = true;

        getNeighborsAxial(current.q, current.r).forEach(({ q, r }) => {
          const n = tileMap.get(`${q},${r}`);
          if (n && n.type === "water" && !visited.has(`${q},${r}`)) {
            stack.push(n);
          }
        });
      }

      if (!touchesBorder)
        region.forEach((t) => {
          t.type = "lake";
        });
    }
  });

  // Step 3: cluster-based impassable peaks fully surrounded by mountain
  // 3a: compute raw peak noise for each mountain tile
  const mountains = tiles.filter(
    (t) => t.type === "mountain" && t.elevationLevel === 4
  );
  const rawPeaks = new Map();
  mountains.forEach((tile) => {
    const val = (peakNoise(tile.q * peakScale, tile.r * peakScale) + 1) / 2;
    rawPeaks.set(`${tile.q},${tile.r}`, val);
  });

  const seedThreshold = 0.8;
  const growThreshold = 0.6;
  const impassableSet = new Set();

  // 3b: seed impassable from high-noise spikes, interior-only
  rawPeaks.forEach((val, key) => {
    if (val <= seedThreshold) return;
    const [q, r] = key.split(",").map(Number);
    // interior check: all neighbors must be regular mountain
    const neighbors = getNeighborsAxial(q, r);
    const interior = neighbors.every(({ q: nq, r: nr }) => {
      const n = tileMap.get(`${nq},${nr}`);
      return n && n.type === "mountain";
    });
    if (interior) impassableSet.add(key);
  });

  // 3c: grow clusters where moderately high noise and neighbors include seeds, interior-only
  rawPeaks.forEach((val, key) => {
    if (impassableSet.has(key) || val <= growThreshold) return;
    const [q, r] = key.split(",").map(Number);
    const neighbors = getNeighborsAxial(q, r);
    // must be interior to mountain region
    const interior = neighbors.every(({ q: nq, r: nr }) => {
      const n = tileMap.get(`${nq},${nr}`);
      return n && (n.type === "mountain" || impassableSet.has(`${nq},${nr}`));
    });
    if (!interior) return;
    // require at least two seeded neighbors
    const adjSeeds = neighbors.filter(({ q: nq, r: nr }) =>
      impassableSet.has(`${nq},${nr}`)
    ).length;
    if (adjSeeds >= 2) impassableSet.add(key);
  });

  // 3d: apply impassable clustering
  impassableSet.forEach((key) => {
    const tile = tileMap.get(key);
    if (tile) {
      tile.type = "impassable mountain";
      tile.height = 5;
      tile.elevationLevel = 5;
    }
  });

  // Step 4: river generation
  const board = { cols, rows, spacing: 1.05, tiles, tileMap };
  const sources = tiles.filter(
    (t) => t.type === "mountain" && Math.random() < 0.04
  );
  const riverPaths = generateRivers(board, sources);

  // Return both tiles (with riverPresent set) and riverPaths
  return {
    ...board,
    riverPaths,
  };
}
