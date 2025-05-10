import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";

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
            renderOrder={999}
          >
            <cylinderGeometry
              args={[spacing * 0.85, spacing * 0.85, 0.02, 6]}
            />
            <meshBasicMaterial
              color="cyan"
              wireframe
              transparent
              opacity={0.8}
              depthTest={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(MovementLayer);
