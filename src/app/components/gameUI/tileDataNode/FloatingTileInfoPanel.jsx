import React, { forwardRef } from "react";
import { floatingTileInfoPanelStyles } from "../../../../library/styles/stylesIndex";

const FloatingTileInfoPanel = forwardRef((props, ref) => (
  <div ref={ref} style={floatingTileInfoPanelStyles.panel} />
));

export default FloatingTileInfoPanel;
