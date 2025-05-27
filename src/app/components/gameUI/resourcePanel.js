import React from "react";
import { Package, Printer, Sword } from "lucide-react";
import { resourcePanelStyles } from "@/library/styles";

export default function ResourcePanel({ resources }) {
  return (
    <div className={resourcePanelStyles.container}>
      <div className={resourcePanelStyles.panel}>
        <ul className={resourcePanelStyles.list}>
          <li className={resourcePanelStyles.item}>
            <Package className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>{resources.rations}</span>
          </li>
          <li className={resourcePanelStyles.item}>
            <Printer className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>{resources.printingMaterial}</span>
          </li>
          <li className={resourcePanelStyles.item}>
            <Sword className={resourcePanelStyles.icon} />
            <span className={resourcePanelStyles.value}>{resources.weapons}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
