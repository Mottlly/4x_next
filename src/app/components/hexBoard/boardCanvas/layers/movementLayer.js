import React, { useMemo, useRef, useEffect } from "react";
import { Shape, ExtrudeGeometry, Matrix4, Object3D } from "three";
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

function MovementLayer({
  reachableTiles,
  spacing,
  heightScale,
  hostilePieces = [],
  attackMode = false,
  tiles = [],
}) {
  const movementInstanceRef = useRef();
  const hostileInstanceRef = useRef();

  // Create geometries for reuse
  const movementHexGeometry = useMemo(
    () =>
      createHexagonBorderGeometry(
        spacing,
        movementStyles.borderScale,
        movementStyles.thickness
      ),
    [spacing]
  );

  const hostileHexGeometry = useMemo(
    () =>
      createHexagonBorderGeometry(
        spacing,
        hostileHighlightStyle.borderScale,
        hostileHighlightStyle.thickness
      ),
    [spacing]
  );

  // Update movement instances
  useEffect(() => {
    if (!movementInstanceRef.current || !reachableTiles.length) return;

    const tempObject = new Object3D();
    const matrix = new Matrix4();

    reachableTiles.forEach((tile, index) => {
      const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
      const y = tile.height * heightScale + 0.1;

      tempObject.position.set(x, y, z);
      tempObject.rotation.set(-Math.PI / 2, 0, 0);
      tempObject.updateMatrix();

      movementInstanceRef.current.setMatrixAt(index, tempObject.matrix);
    });

    movementInstanceRef.current.instanceMatrix.needsUpdate = true;
    movementInstanceRef.current.count = reachableTiles.length;
  }, [reachableTiles, spacing, heightScale]);

  // Update hostile instances
  useEffect(() => {
    if (!hostileInstanceRef.current || !attackMode || !reachableTiles.length)
      return;

    const tempObject = new Object3D();

    // reachableTiles in attack mode contains the attackable hostile tiles
    reachableTiles.forEach((tile, index) => {
      const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
      const y = tile.height * heightScale + 0.13;

      tempObject.position.set(x, y, z);
      tempObject.rotation.set(-Math.PI / 2, 0, 0);
      tempObject.updateMatrix();

      hostileInstanceRef.current.setMatrixAt(index, tempObject.matrix);
    });

    hostileInstanceRef.current.instanceMatrix.needsUpdate = true;
    hostileInstanceRef.current.count = reachableTiles.length;
  }, [reachableTiles, attackMode, spacing, heightScale]);

  return (
    <>
      {/* Normal movement highlights - instanced */}
      {reachableTiles.length > 0 && (
        <instancedMesh
          ref={movementInstanceRef}
          args={[movementHexGeometry, null, reachableTiles.length]}
          renderOrder={movementStyles.renderOrder}
        >
          <meshBasicMaterial
            color={movementStyles.color}
            wireframe={false}
            transparent
            opacity={movementStyles.opacity}
            depthTest={movementStyles.depthTest}
          />
        </instancedMesh>
      )}

      {/* Hostile piece highlights - instanced (only in attack mode) */}
      {attackMode && hostilePieces.length > 0 && (
        <instancedMesh
          ref={hostileInstanceRef}
          args={[hostileHexGeometry, null, hostilePieces.length]}
          renderOrder={hostileHighlightStyle.renderOrder}
        >
          <meshBasicMaterial
            color={hostileHighlightStyle.color}
            wireframe={false}
            transparent
            opacity={hostileHighlightStyle.opacity}
            depthTest={hostileHighlightStyle.depthTest}
          />
        </instancedMesh>
      )}
    </>
  );
}

export default React.memo(MovementLayer);
