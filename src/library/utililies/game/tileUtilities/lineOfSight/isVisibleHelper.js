export function isTileVisible(tile) {
  return !tile.fogged && !tile.semiFogged && tile.discovered;
}
