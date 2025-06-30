import { useRef, useCallback } from "react";
import { settlementUpgradeOptions } from "../../../../library/utililies/game/settlements/settlementUpgrades";
import { buildingOptions } from "../../../../library/utililies/game/gamePieces/schemas/buildBank";
import { floatingTileInfoPanelStyles } from "@/library/styles/stylesIndex";

// Helper to convert style object to inline style string
function styleObjToStr(obj) {
  return Object.entries(obj)
    .map(
      ([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`
    )
    .join(";");
}

// Combine upgrade and building key->label into one map
const keyToLabel = {};

// Add building labels
Object.entries(buildingOptions).forEach(([key, val]) => {
  keyToLabel[key] = val.label;
});
// Add upgrade labels
Object.values(settlementUpgradeOptions).forEach((arr) => {
  arr.forEach((upgrade) => {
    keyToLabel[upgrade.key] = upgrade.label;
  });
});

export default function useFloatingTileInfo(pieces = []) {
  const infoPanelRef = useRef();

  const showTileInfo = useCallback(
    (tile, pointerEvent) => {
      if (!infoPanelRef.current) return;
      if (!tile) {
        infoPanelRef.current.innerHTML = `
        <h2 style="${styleObjToStr(
          floatingTileInfoPanelStyles.heading
        )}">DATA NODE</h2>
        <div style="${styleObjToStr(
          floatingTileInfoPanelStyles.noData
        )}">-- NO DATA STREAM --<br/><span style="font-size:12px;">Awaiting sector scan...</span></div>
      `;
        infoPanelRef.current.style.opacity = 0.7;
        return;
      }

      const isFogged = !tile.discovered;

      // --- PIECE INFO SECTION ---
      const piecesOnTile = pieces.filter(
        (p) => p.q === tile.q && p.r === tile.r
      );
      let pieceSection = "";
      if (piecesOnTile.length > 0) {
        pieceSection = `
        <div style="margin-top:10px;">
          <b>Piece${piecesOnTile.length > 1 ? "s" : ""} on Tile:</b>
          <ul style="margin:4px 0 0 14px;padding:0;">
            ${piecesOnTile
              .map(
                (p) =>
                  `<li>
                    <b>Type:</b> ${p.type} &nbsp;
                    <b>Moves:</b> ${p.movesLeft ?? "?"} &nbsp;
                    <b>Vision:</b> ${p.vision ?? "?"}
                  </li>`
              )
              .join("")}
          </ul>
        </div>
      `;
      }
      // --- END PIECE INFO SECTION ---

      infoPanelRef.current.innerHTML = `
      <h2 style="${styleObjToStr(
        floatingTileInfoPanelStyles.heading
      )}">DATA NODE</h2>
      <div><b>X:</b> ${tile.q} &nbsp; <b>Y:</b> ${tile.r}</div>
      <div><b>Type:</b> ${isFogged ? "?" : tile.type || "water"}</div>
      ${
        isFogged
          ? ""
          : tile.riverPresent
          ? `<div><b>River:</b> Present</div>`
          : ""
      }
      ${
        isFogged
          ? ""
          : tile.specialResource
          ? `<div><b>Special Resource:</b> ${tile.specialResource}</div>`
          : ""
      }
      ${
        isFogged
          ? ""
          : tile.building
          ? `<div><b>Building:</b> ${
              keyToLabel[tile.building] || tile.building
            }</div>`
          : ""
      }
      ${
        isFogged
          ? ""
          : tile.building && tile.upgrades && tile.upgrades.length > 0
          ? `<div><b>Upgrades:</b> ${tile.upgrades
              .map((key) => keyToLabel[key] || key)
              .join(", ")}</div>`
          : ""
      }
      ${pieceSection}
      <div style="${styleObjToStr(
        floatingTileInfoPanelStyles.sectorNote
      )}"><em>Sector coordinates ⎯ data stream stabilized</em></div>
    `;
      infoPanelRef.current.style.opacity = 1;
      if (pointerEvent) {
        infoPanelRef.current.style.left = pointerEvent.clientX + 24 + "px";
        infoPanelRef.current.style.top = pointerEvent.clientY - 24 + "px";
      }
    },
    [pieces]
  );

  return { infoPanelRef, showTileInfo };
}
