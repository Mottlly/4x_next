import React from "react";
import { buildingOptions } from "../../../library/utililies/game/gamePieces/schemas/buildBank";
import { unitBuildOptions } from "../../../library/utililies/game/gamePieces/unitBuildOptions";
import {
  Package,
  Printer,
  Sword,
  Eye,
  HardHat,
  BadgeCheck,
} from "lucide-react";
import { getAvailableUpgrades } from "../../../library/utililies/game/settlements/upgradeUtilities";
import { settlementPanelStyles } from "@/library/styles/stylesIndex";

// Map unit keys to icons
const unitIcons = {
  scout: Eye,
  engineer: HardHat,
  security: BadgeCheck,
};

export default function SettlementPanel({
  tile,
  onClose,
  onBuildUnit,
  resources,
  onStartUpgrade,
  currentTurn,
}) {
  const cfg = buildingOptions[tile.building] || {};
  const availableUpgrades = getAvailableUpgrades(tile);

  // Helper to check if enough resources
  const canAfford = (cost) =>
    Object.entries(cost).every(([k, v]) => (resources[k] ?? 0) >= v);

  // Helper to check if enough resources for an upgrade
  const canAffordUpgrade = (cost) =>
    Object.entries(cost).every(([k, v]) => (resources[k] ?? 0) >= v);

  return (
    <div className={settlementPanelStyles.container}>
      <div className={settlementPanelStyles.header}>
        <h3 className={settlementPanelStyles.title}>
          {cfg.label || "Settlement"}
        </h3>
        <button
          onClick={onClose}
          className={settlementPanelStyles.closeButton}
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className={settlementPanelStyles.grid}>
        {/* Build Unit Column */}
        <div>
          <div className={settlementPanelStyles.sectionTitle}>Build Unit:</div>
          <div className="flex flex-col gap-2">
            {unitBuildOptions.map((unit) => (
              <button
                key={unit.key}
                className={settlementPanelStyles.unitButton(
                  canAfford(unit.cost)
                )}
                disabled={!canAfford(unit.cost)}
                onClick={() => onBuildUnit(unit.key, unit.cost, tile)}
              >
                <span className="flex flex-col items-center flex-1">
                  <span className={settlementPanelStyles.unitLabel}>
                    {unit.label}
                  </span>
                  <span className={settlementPanelStyles.unitCosts}>
                    <span className={settlementPanelStyles.costItem}>
                      <Package className="w-4 h-4" />
                      {unit.cost.rations}
                    </span>
                    <span className={settlementPanelStyles.costItem}>
                      <Printer className="w-4 h-4" />
                      {unit.cost.printingMaterial}
                    </span>
                    <span className={settlementPanelStyles.costItem}>
                      <Sword className="w-4 h-4" />
                      {unit.cost.weapons}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Settlement Upgrades Column */}
        <div>
          <div className={settlementPanelStyles.sectionTitle}>Upgrades:</div>
          <div className="flex flex-col gap-2">
            {tile.upgradeInProgress ? (
              <div className={settlementPanelStyles.upgradeInProgress}>
                Upgrading: {tile.upgradeInProgress.key} (
                {currentTurn - tile.upgradeInProgress.startedTurn}/
                {tile.upgradeInProgress.duration} turns)
              </div>
            ) : availableUpgrades.length === 0 ? (
              <div className={settlementPanelStyles.allUpgradesBuilt}>
                All upgrades built
              </div>
            ) : (
              availableUpgrades.map((upgrade) => (
                <button
                  key={upgrade.key}
                  className={settlementPanelStyles.upgradeButton(
                    canAffordUpgrade(upgrade.cost)
                  )}
                  disabled={!canAffordUpgrade(upgrade.cost)}
                  onClick={() => onStartUpgrade(upgrade.key)}
                >
                  <span className={settlementPanelStyles.upgradeLabel}>
                    {upgrade.label} ({upgrade.duration} turns)
                  </span>
                  <span className={settlementPanelStyles.upgradeCosts}>
                    <span className={settlementPanelStyles.costItem}>
                      <Package className="w-4 h-4" />
                      {upgrade.cost.rations}
                    </span>
                    <span className={settlementPanelStyles.costItem}>
                      <Printer className="w-4 h-4" />
                      {upgrade.cost.printingMaterial}
                    </span>
                    <span className={settlementPanelStyles.costItem}>
                      <Sword className="w-4 h-4" />
                      {upgrade.cost.weapons}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
