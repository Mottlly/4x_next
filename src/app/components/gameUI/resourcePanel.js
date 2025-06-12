import React from "react";
import { Package, Printer, Sword, Flag } from "lucide-react";
import { resourcePanelStyles } from "@/library/styles/stylesIndex";

export default function ResourcePanel({ resources, outpostInfo }) {
  return (
    <div className={resourcePanelStyles.container}>
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
            </span>
          </li>
          <li className="flex flex-col items-center">
            <Printer className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.printingMaterial}
            </span>
          </li>
          <li className="flex flex-col items-center">
            <Sword className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.weapons}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
