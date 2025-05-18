import React, { forwardRef } from "react";

const FloatingTileInfoPanel = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{
      position: "fixed",
      left: 12,
      top: 12,
      minWidth: 220, // was 300
      maxWidth: 320,
      background: "rgba(20,30,40,0.95)",
      color: "#aef",
      border: "1px solid #0ff",
      borderRadius: 8,
      padding: "10px 16px", // less vertical padding
      fontFamily: "monospace",
      zIndex: 1000,
      pointerEvents: "none",
      transition: "opacity 0.15s",
      opacity: 1,
    }}
  />
));

export default FloatingTileInfoPanel;
