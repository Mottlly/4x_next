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
    <div
      className="
        absolute bottom-4 right-4 z-20
        w-96 p-4
        bg-gray-900 bg-opacity-90
        border border-yellow-500
        rounded-lg shadow-lg
        text-white
      "
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">{cfg.label || "Settlement"}</h3>
        <button
          onClick={onClose}
          className="text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Build Unit Column */}
        <div>
          <div className="font-semibold mb-2 text-sm">Build Unit:</div>
          <div className="flex flex-col gap-2">
            {unitBuildOptions.map((unit) => {
              return (
                <button
                  key={unit.key}
                  className={`w-full py-1 px-2 rounded text-xs flex flex-row items-center ${
                    canAfford(unit.cost)
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-700 cursor-not-allowed opacity-60"
                  }`}
                  disabled={!canAfford(unit.cost)}
                  onClick={() => onBuildUnit(unit.key, unit.cost, tile)}
                >
                  {/* Left: Label above costs */}
                  <span className="flex flex-col items-center flex-1">
                    <span className="font-medium text-center w-full">
                      {unit.label}
                    </span>
                    <span className="flex flex-row items-center gap-2 mt-0.5 opacity-80">
                      <span className="inline-flex items-center gap-0.5">
                        <Package className="w-4 h-4" />
                        {unit.cost.rations}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Printer className="w-4 h-4" />
                        {unit.cost.printingMaterial}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Sword className="w-4 h-4" />
                        {unit.cost.weapons}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settlement Upgrades Column */}
        <div>
          <div className="font-semibold mb-2 text-sm">Upgrades:</div>
          <div className="flex flex-col gap-2">
            {tile.upgradeInProgress ? (
              <div className="text-yellow-300">
                Upgrading: {tile.upgradeInProgress.key} (
                {currentTurn - tile.upgradeInProgress.startedTurn}/
                {tile.upgradeInProgress.duration} turns)
              </div>
            ) : availableUpgrades.length === 0 ? (
              <div className="text-gray-400 text-xs">All upgrades built</div>
            ) : (
              availableUpgrades.map((upgrade) => (
                <button
                  key={upgrade.key}
                  className={`w-full py-1 px-2 rounded text-sm flex flex-col items-center mb-1 ${
                    canAffordUpgrade(upgrade.cost)
                      ? "bg-blue-700 hover:bg-blue-800"
                      : "bg-gray-700 cursor-not-allowed opacity-60"
                  }`}
                  disabled={!canAffordUpgrade(upgrade.cost)}
                  onClick={() => onStartUpgrade(upgrade.key)}
                >
                  <span className="font-medium text-center w-full">
                    {upgrade.label} ({upgrade.duration} turns)
                  </span>
                  <span className="flex flex-row items-center gap-2 mt-0.5 opacity-80">
                    <span className="inline-flex items-center gap-0.5">
                      <Package className="w-4 h-4" />
                      {upgrade.cost.rations}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Printer className="w-4 h-4" />
                      {upgrade.cost.printingMaterial}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
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
