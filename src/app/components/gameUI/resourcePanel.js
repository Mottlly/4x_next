import React from "react";
import { Package, Printer, Sword, Flag } from "lucide-react";
import { resourcePanelStyles } from "@/library/styles/stylesIndex";

export default function ResourcePanel({ resources, outpostInfo }) {
  return (
    <div className={resourcePanelStyles.container}>
      <div className={resourcePanelStyles.panel}>
        <ul className={resourcePanelStyles.list}>
          <li className={resourcePanelStyles.item}>
            <Package className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.rations}
            </span>
          </li>
          <li className={resourcePanelStyles.item}>
            <Printer className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.printingMaterial}
            </span>
          </li>
          <li className={resourcePanelStyles.item}>
            <Sword className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>
              {resources.weapons}
            </span>
          </li>
        </ul>
        <div className="flex flex-col items-center mt-2">
          <Flag className="w-6 h-6 mb-1 text-yellow-400" />
          <span className="text-xs text-gray-200">
            Outposts: {outpostInfo.used} / {outpostInfo.max}
          </span>
        </div>
      </div>
    </div>
  );
}
