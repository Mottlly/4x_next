export function computeOutpostInfo(board) {
  let max = 0;
  let used = 0;
  for (const tile of board.tiles) {
    if (tile.building === "reconstructed_shelter") {
      max += 3;
    } else if (tile.building === "colony_settlement") {
      max += 3; // Colony settlements provide same capacity as reconstructed shelters
    } else if (
      tile.building === "resource_extractor" ||
      tile.building === "sensor_suite"
    ) {
      used += 1;
    }
    // Add more settlement types or outpost types as needed
  }
  return { used, max };
}
