import React, { useState, useEffect, useRef } from "react";

const TileInfoPanel = ({ tile }) => {
  const [displayTile, setDisplayTile] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // whenever `tile` changes, clear prior timers…
    clearTimeout(timerRef.current);

    if (tile) {
      // new hover: show placeholder immediately
      setLoading(true);
      setDisplayTile(null);

      // if still over same tile after 1 s, show real panel
      timerRef.current = setTimeout(() => {
        setDisplayTile(tile);
        setLoading(false);
      }, 1000);
    } else {
      // moved off: clear everything
      setLoading(false);
      setDisplayTile(null);
    }

    return () => clearTimeout(timerRef.current);
  }, [tile]);

  if (loading) {
    return (
      <div
        className="
          absolute top-4 left-4 w-72 p-4
          bg-black bg-opacity-90
          border border-cyan-500 rounded-lg
          shadow-lg ring-2 ring-cyan-400 ring-opacity-50
          font-mono text-cyan-200
          pointer-events-none z-10
          flex items-center justify-center
        "
      >
        <div className="animate-pulse uppercase tracking-wider">
          initializing data stream...
        </div>
      </div>
    );
  }

  if (!displayTile) return null;

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
          <span className="font-semibold">{displayTile.q}</span>
        </li>
        <li>
          <span className="inline-block w-12 text-right pr-2">Y:</span>
          <span className="font-semibold">{displayTile.r}</span>
        </li>
        <li>
          <span className="inline-block w-12 text-right pr-2">Type:</span>
          <span className="font-semibold">{displayTile.type || "water"}</span>
        </li>
        {displayTile.river && (
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

export default React.memo(TileInfoPanel);
