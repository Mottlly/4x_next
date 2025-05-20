import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

function SemiFogLayer({ tiles, spacing, heightScale }) {
  const fogHeight = spacing * 0.5 + 0.02; // slightly taller than tile
  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        // Center the fog overlay vertically on the tile
        const y = tile.height * heightScale;
        return (
          <mesh
            key={`semifog-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={1000}
            pointerEvents="none"
          >
            <cylinderGeometry args={[spacing, spacing, fogHeight, 6]} />
            <meshStandardMaterial
              color="#444"
              transparent
              opacity={0.45}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(SemiFogLayer);
