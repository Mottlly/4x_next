export const floatingTileInfoPanelStyles = {
  panel: {
    position: "fixed",
    left: 12,
    top: 12,
    minWidth: 220,
    maxWidth: 320,
    background: "rgba(20,30,40,0.95)",
    color: "#aef",
    border: "1px solid #0ff",
    borderRadius: 8,
    padding: "10px 16px",
    fontFamily: "monospace",
    zIndex: 1000,
    pointerEvents: "none",
    transition: "opacity 0.15s",
    opacity: 1,
  },
  heading: {
    marginBottom: 8,
  },
  noData: {
    color: "#0ff",
    opacity: 0.6,
  },
  sectorNote: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
};
