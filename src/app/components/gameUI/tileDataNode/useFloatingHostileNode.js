import { useRef, useCallback } from "react";
import { floatingTileInfoPanelStyles } from "@/library/styles/stylesIndex";

function styleObjToStr(obj) {
  return Object.entries(obj)
    .map(
      ([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`
    )
    .join(";");
}

export default function useFloatingHostileInfo() {
  const infoPanelRef = useRef();

  const showHostileInfo = useCallback((piece, tile, pointerEvent) => {
    if (!infoPanelRef.current) return;
    // Apply the panel style
    Object.assign(infoPanelRef.current.style, floatingTileInfoPanelStyles.panel);

    if (!piece) {
      infoPanelRef.current.style.opacity = 0;
      return;
    }
    infoPanelRef.current.innerHTML = `
      <h2 style="${styleObjToStr(
        floatingTileInfoPanelStyles.heading
      )}">${piece.type || "Hostile"}</h2>
      <div><b>Health:</b> ${piece.stats?.health ?? "?"}</div>
      <div><b>Attack:</b> ${piece.stats?.attack ?? "?"}</div>
      <div><b>Defense:</b> ${piece.stats?.defense ?? "?"}</div>
      <div><b>Range:</b> ${piece.range ?? 1}</div>
      <div style="${styleObjToStr(
        floatingTileInfoPanelStyles.sectorNote
      )}"><em>Hostile unit data stream</em></div>
    `;
    infoPanelRef.current.style.opacity = 1;
    if (pointerEvent?.clientX) {
      infoPanelRef.current.style.left = pointerEvent.clientX + 24 + "px";
      infoPanelRef.current.style.top = pointerEvent.clientY - 24 + "px";
    }
  }, []);

  return { hostileInfoPanelRef: infoPanelRef, showHostileInfo };
}