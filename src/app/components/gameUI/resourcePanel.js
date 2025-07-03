import React from "react";
import { Package, Printer, Sword, Flag } from "lucide-react";
import { resourcePanelStyles } from "@/library/styles/stylesIndex";

export default function ResourcePanel({
  resources,
  outpostInfo,
  resourceDelta = {},
}) {
  return (
    <div className={resourcePanelStyles.container} id="resource-panel">
      <div className={resourcePanelStyles.panel} style={{ minWidth: 380 }}>
        <ul
          className="flex flex-row items-end justify-center gap-6 w-full"
          style={{ margin: 0, padding: 0, listStyle: "none" }}
        >
          <li className="flex flex-col items-center">
            <Flag className={resourcePanelStyles.icon} />
            <div className="flex items-center justify-center min-w-[70px] whitespace-nowrap">
              <span className={resourcePanelStyles.value}>
                {outpostInfo.used} / {outpostInfo.max}
              </span>
            </div>
          </li>
          <li className="flex flex-col items-center">
            <Package className={resourcePanelStyles.icon} />
            <div className="flex items-center justify-center min-w-[70px] whitespace-nowrap">
              <span className={resourcePanelStyles.value}>
                {resources.rations}
              </span>
              {resourceDelta.rations !== 0 && (
                <span
                  className={`text-xs opacity-90 ml-1 ${
                    resourceDelta.rations > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ({resourceDelta.rations > 0 ? "+" : ""}
                  {resourceDelta.rations})
                </span>
              )}
            </div>
          </li>
          <li className="flex flex-col items-center">
            <Printer className={resourcePanelStyles.icon} />
            <div className="flex items-center justify-center min-w-[70px] whitespace-nowrap">
              <span className={resourcePanelStyles.value}>
                {resources.printingMaterial}
              </span>
              {resourceDelta.printingMaterial !== 0 && (
                <span
                  className={`text-xs opacity-90 ml-1 ${
                    resourceDelta.printingMaterial > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ({resourceDelta.printingMaterial > 0 ? "+" : ""}
                  {resourceDelta.printingMaterial})
                </span>
              )}
            </div>
          </li>
          <li className="flex flex-col items-center">
            <Sword className={resourcePanelStyles.icon} />
            <div className="flex items-center justify-center min-w-[70px] whitespace-nowrap">
              <span className={resourcePanelStyles.value}>
                {resources.weapons}
              </span>
              {resourceDelta.weapons !== 0 && (
                <span
                  className={`text-xs opacity-90 ml-1 ${
                    resourceDelta.weapons > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ({resourceDelta.weapons > 0 ? "+" : ""}
                  {resourceDelta.weapons})
                </span>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
