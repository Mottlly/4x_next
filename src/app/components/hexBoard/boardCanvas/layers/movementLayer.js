import React, { useMemo } from "react";
import { Shape, ExtrudeGeometry } from "three";
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

// Create hexagon border geometry
function createHexagonBorderGeometry(spacing, borderScale, thickness) {
  const radius = spacing * borderScale;
  const innerRadius = radius * 0.9; // Create a border effect
  
  // Create outer hexagon shape (rotated 30 degrees for odd-r offset grid)
  const outerShape = new Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6; // Add 30 degree rotation for flat-top hexagons
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      outerShape.moveTo(x, y);
    } else {
      outerShape.lineTo(x, y);
    }
  }
  outerShape.closePath();
  
  // Create inner hexagon hole (rotated 30 degrees for odd-r offset grid)
  const innerHole = new Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 + Math.PI / 6; // Add 30 degree rotation for flat-top hexagons
    const x = Math.cos(angle) * innerRadius;
    const y = Math.sin(angle) * innerRadius;
    if (i === 0) {
      innerHole.moveTo(x, y);
    } else {
      innerHole.lineTo(x, y);
    }
  }
  innerHole.closePath();
  
  // Add hole to shape
  outerShape.holes = [innerHole];
  
  // Extrude settings
  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: false,
  };
  
  return new ExtrudeGeometry(outerShape, extrudeSettings);
}

function MovementLayer({ reachableTiles, spacing, heightScale, hostilePieces = [], attackMode = false, tiles = [] }) {
  // Get unique hostile tile positions
  const hostileTiles = hostilePieces.map((p) => `${p.q},${p.r}`);
  const hostileTileSet = new Set(hostileTiles);

  // Create geometries for reuse
  const movementHexGeometry = useMemo(
    () => createHexagonBorderGeometry(spacing, movementStyles.borderScale, movementStyles.thickness),
    [spacing]
  );
  
  const hostileHexGeometry = useMemo(
    () => createHexagonBorderGeometry(spacing, hostileHighlightStyle.borderScale, hostileHighlightStyle.thickness),
    [spacing]
  );

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
            rotation={[-Math.PI / 2, 0, 0]} // Rotate to lay flat
            renderOrder={movementStyles.renderOrder}
            geometry={movementHexGeometry}
          >
            <meshBasicMaterial
              color={movementStyles.color}
              wireframe={false}
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
              rotation={[-Math.PI / 2, 0, 0]} // Rotate to lay flat
              renderOrder={hostileHighlightStyle.renderOrder}
              geometry={hostileHexGeometry}
            >
              <meshBasicMaterial
                color={hostileHighlightStyle.color}
                wireframe={false}
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
