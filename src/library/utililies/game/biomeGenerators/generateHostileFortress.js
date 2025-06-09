import { v4 as uuidv4 } from "uuid";
import { hexDistance } from "../tileUtilities/Positioning/distanceFinder";

/**
 * Spawns a hostile fortress on a tile at least `minDistance` away from player spawn.
 * @param {Array} tiles - All board tiles.
 * @param {Object} playerSpawn - {q, r} of player spawn.
 * @param {number} minDistance - Minimum hex distance from player spawn.
 * @returns {Object|null} fortress object or null if none found.
 */
export function generateHostileFortress(tiles, playerSpawn, minDistance = 6) {
  // Only consider tiles that are not water/lake/impassable and have no building
  const validTiles = tiles.filter(
    (tile) =>
      !["water", "lake", "impassable mountain"].includes(tile.type) &&
      !tile.building &&
      hexDistance(tile, playerSpawn) >= minDistance
  );
  if (validTiles.length === 0) return null;

  // Pick a random valid tile
  const tile = validTiles[Math.floor(Math.random() * validTiles.length)];
  return {
    id: uuidv4(),
    type: "hostileFortress",
    q: tile.q,
    r: tile.r,
    stats: { health: 15, attack: 2, defense: 4 },
  };
}
