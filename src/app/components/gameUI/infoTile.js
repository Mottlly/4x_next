import React from "react";

const TileInfoPanel = ({ tile }) => {
  if (!tile) return null;

  return (
    <div
      className="
        absolute top-4 left-4 w-72 p-4
        bg-gray-900 bg-opacity-80 backdrop-blur-sm
        border border-cyan-500 rounded-lg
        shadow-lg ring-2 ring-cyan-400 ring-opacity-50
        font-mono text-cyan-300
        pointer-events-none z-10
      "
    >
      <h2 className="flex items-center justify-between text-xl font-bold uppercase tracking-wider mb-3">
        <span> DATA NODE</span>
      </h2>
      <ul className="space-y-1 text-sm">
        <li>
          <span className="inline-block w-12 text-right pr-2">X:</span>
          <span className="font-semibold">{tile.q}</span>
        </li>
        <li>
          <span className="inline-block w-12 text-right pr-2">Y:</span>
          <span className="font-semibold">{tile.r}</span>
        </li>
        <li>
          <span className="inline-block w-12 text-right pr-2">Type:</span>
          <span className="font-semibold">{tile.type || "water"}</span>
        </li>
        {tile.river && (
          <li>
            <span className="inline-block w-12 text-right pr-2">River:</span>
            <span className="font-semibold text-blue-400">Present</span>
          </li>
        )}
      </ul>
      <div className="mt-3 border-t border-cyan-500 pt-2 text-xs opacity-70">
        <em>Sector coordinates ⎯ data stream stabilized</em>
      </div>
    </div>
  );
};

export default TileInfoPanel;
