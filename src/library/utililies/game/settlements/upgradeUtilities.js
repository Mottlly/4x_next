import { settlementUpgradeOptions } from "./settlementUpgrades";

// Start an upgrade on a tile
export function startUpgrade(tile, upgradeKey, currentTurn) {
  const options = settlementUpgradeOptions[tile.building] || [];
  const upgrade = options.find((u) => u.key === upgradeKey);
  if (!upgrade) throw new Error("Invalid upgrade for this settlement type.");

  return {
    ...tile,
    upgradeInProgress: {
      key: upgrade.key,
      startedTurn: currentTurn,
      duration: upgrade.duration,
      cost: upgrade.cost,
      upkeep: upgrade.upkeep,
    },
  };
}

// Advance upgrades for all tiles on turn end
export function processUpgrades(tiles, currentTurn) {
  return tiles.map((tile) => {
    if (!tile.upgradeInProgress) return tile;

    const { startedTurn, duration, key } = tile.upgradeInProgress;
    if (currentTurn - startedTurn >= duration) {
      // Upgrade complete
      return {
        ...tile,
        upgrades: [...(tile.upgrades || []), key],
        upgradeInProgress: null,
      };
    }
    return tile;
  });
}

// Get available upgrades for a tile
export function getAvailableUpgrades(tile) {
  const all = settlementUpgradeOptions[tile.building] || [];
  const built = new Set(tile.upgrades || []);
  return all.filter((u) => !built.has(u.key));
}