import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { movementStyles } from "@/library/styles/stylesIndex";

// Add this style for hostile highlight
const hostileHighlightStyle = {
  color: "red",
  opacity: 0.9,
  wireframe: true,
  borderScale: 0.85,
  thickness: 0.04,
  renderOrder: 1000,
  depthTest: false,
};

function MovementLayer({ reachableTiles, spacing, heightScale, hostilePieces = [], attackMode = false, tiles = [] }) {
  // Get unique hostile tile positions
  const hostileTiles = hostilePieces.map((p) => `${p.q},${p.r}`);
  const hostileTileSet = new Set(hostileTiles);

  return (
    <>
      {/* Normal movement highlights */}
      {reachableTiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + 0.1;
        return (
          <mesh
            key={`border-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={movementStyles.renderOrder}
          >
            <cylinderGeometry
              args={[
                spacing * movementStyles.borderScale,
                spacing * movementStyles.borderScale,
                movementStyles.thickness,
                6,
              ]}
            />
            <meshBasicMaterial
              color={movementStyles.color}
              wireframe={movementStyles.wireframe}
              transparent
              opacity={movementStyles.opacity}
              depthTest={movementStyles.depthTest}
            />
          </mesh>
        );
      })}
      {/* Hostile piece highlights (only in attack mode) */}
      {attackMode &&
        hostilePieces.map((p) => {
          const tile = tiles.find((t) => t.q === p.q && t.r === p.r);
          if (!tile) return null;
          const [x, , z] = hexToPosition(p.q, p.r, spacing);
          const y = tile.height * heightScale + 0.13;
          return (
            <mesh
              key={`hostile-highlight-${p.q}-${p.r}`}
              position={[x, y, z]}
              renderOrder={hostileHighlightStyle.renderOrder}
            >
              <cylinderGeometry
                args={[
                  spacing * hostileHighlightStyle.borderScale,
                  spacing * hostileHighlightStyle.borderScale,
                  hostileHighlightStyle.thickness,
                  6,
                ]}
              />
              <meshBasicMaterial
                color={hostileHighlightStyle.color}
                wireframe={hostileHighlightStyle.wireframe}
                transparent
                opacity={hostileHighlightStyle.opacity}
                depthTest={hostileHighlightStyle.depthTest}
              />
            </mesh>
          );
        })}
    </>
  );
}

export default React.memo(MovementLayer);
