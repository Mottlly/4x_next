import getNeighborsAxial from "@/library/utililies/game/tileUtilities/Positioning/getNeighbors";

// Returns an array of neighbor heights (or null if no neighbor)
export default function getNeighborHeights(tile, tiles) {
  const neighbors = getNeighborsAxial(tile.q, tile.r);
  return neighbors.map(({ q, r }) => {
    const neighbor = tiles.find((t) => t.q === q && t.r === r);
    return neighbor ? neighbor.height : null;
  });
}
