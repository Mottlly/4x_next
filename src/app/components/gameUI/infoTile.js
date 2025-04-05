import React from "react";

const TileInfoPanel = ({ tile }) => {
  if (!tile) return null;
  return (
    <div className="absolute top-4 left-4 p-4 bg-white text-black rounded shadow-lg z-10 pointer-events-none w-64">
      <h2 className="text-lg font-bold mb-2">Tile Info</h2>
      <ul className="text-sm">
        <li>
          <strong>Q:</strong> {tile.q}
        </li>
        <li>
          <strong>R:</strong> {tile.r}
        </li>
        <li>
          <strong>Type:</strong> {tile.type || "water"}
        </li>
        {tile.river && (
          <li>
            <strong>River:</strong> Present
          </li>
        )}
      </ul>
    </div>
  );
};

export default TileInfoPanel;
