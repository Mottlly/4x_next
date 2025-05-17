import React, { forwardRef } from "react";

const FloatingTileInfoPanel = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{
      position: "fixed",
      left: 40,
      top: 40,
      minWidth: 300,
      background: "rgba(20,30,40,0.95)",
      color: "#aef",
      border: "1px solid #0ff",
      borderRadius: 8,
      padding: 12,
      fontFamily: "monospace",
      zIndex: 1000,
      pointerEvents: "none",
      transition: "opacity 0.15s",
      opacity: 1,
    }}
  />
));

export default FloatingTileInfoPanel;