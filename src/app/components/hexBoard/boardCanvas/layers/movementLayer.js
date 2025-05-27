import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { movementStyles } from "@/library/styles/stylesIndex";

function MovementLayer({ reachableTiles, spacing, heightScale }) {
  return (
    <>
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
    </>
  );
}

export default React.memo(MovementLayer);
