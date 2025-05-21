import React from "react";
import { buildingOptions } from "../../../library/utililies/game/gamePieces/schemas/buildBank";
import { unitBuildOptions } from "../../../library/utililies/game/gamePieces/unitBuildOptions";

export default function SettlementPanel({
  tile,
  onClose,
  onBuildUnit,
  resources,
}) {
  const cfg = buildingOptions[tile.building] || {};

  // Helper to check if enough resources
  const canAfford = (cost) =>
    Object.entries(cost).every(([k, v]) => (resources[k] ?? 0) >= v);

  return (
    <div
      className="
        absolute bottom-4 right-4 z-20
        w-80 p-4
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

      <div className="space-y-2">
        <div className="font-semibold mb-2">Build Unit:</div>
        {unitBuildOptions.map((unit) => (
          <button
            key={unit.key}
            className={`w-full py-2 rounded ${
              canAfford(unit.cost)
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 cursor-not-allowed opacity-60"
            }`}
            disabled={!canAfford(unit.cost)}
            onClick={() => onBuildUnit(unit.key, unit.cost, tile)}
          >
            {unit.label}{" "}
            <span className="text-xs opacity-80">
              (Cost: R{unit.cost.rations} P{unit.cost.printingMaterial} W
              {unit.cost.weapons})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
