import React from "react";
import { BUILDING_CONFIG } from "../../../library/utililies/game/gamePieces/buildBank";

export default function SettlementPanel({ tile, onClose }) {
  const cfg = BUILDING_CONFIG[tile.building] || {};
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
        <button className="w-full py-2 bg-green-600 rounded hover:bg-green-700">
          Build Unit
        </button>
        <button className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700">
          Manage Upgrades
        </button>
      </div>
    </div>
  );
}
