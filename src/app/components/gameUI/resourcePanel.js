import React from "react";
import { Package, Printer, Sword, Flag } from "lucide-react";
import { resourcePanelStyles } from "@/library/styles/stylesIndex";

export default function ResourcePanel({
  resources,
  outpostInfo,
  resourceDelta = {},
}) {
  // Helper function to format the delta display with colors
  const formatDelta = (delta) => {
    if (delta === 0) return "";
    const sign = delta > 0 ? "+" : "";
    const colorClass = delta > 0 ? "text-green-400" : "text-red-400";
    return (
      <span className={`text-xs opacity-90 ${colorClass}`}>
        {` (${sign}${delta})`}
      </span>
    );
  };

  return (
    <div className={resourcePanelStyles.container} id="resource-panel">
      <div className={resourcePanelStyles.panel} style={{ minWidth: 300 }}>
        <ul
          className="flex flex-row items-end justify-center gap-8 w-full"
          style={{ margin: 0, padding: 0, listStyle: "none" }}
        >
          <li className="flex flex-col items-center">
            <Flag className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {outpostInfo.used} / {outpostInfo.max}
            </span>
          </li>
          <li className="flex flex-col items-center">
            <Package className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.rations}
              {formatDelta(resourceDelta.rations)}
            </span>
          </li>
          <li className="flex flex-col items-center">
            <Printer className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.printingMaterial}
              {formatDelta(resourceDelta.printingMaterial)}
            </span>
          </li>
          <li className="flex flex-col items-center">
            <Sword className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.weapons}
              {formatDelta(resourceDelta.weapons)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
