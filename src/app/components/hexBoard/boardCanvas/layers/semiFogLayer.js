import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";

function SemiFogLayer({ tiles, spacing, heightScale }) {
  const fogHeight = spacing * 0.3; // thinner fog layer
  const fogYOffset = 0.4; // small lift to avoid z-fighting

  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        // Place fog just above the tile
        const y = tile.height * heightScale + fogYOffset;
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
