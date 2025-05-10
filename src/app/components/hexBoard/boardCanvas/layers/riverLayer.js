import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";

function RiverLayer({ tiles, spacing, heightScale }) {
  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + 0.05;
        return (
          <mesh
            key={`river-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={1000}
          >
            <sphereGeometry args={[spacing * 0.1, 8, 8]} />
            <meshStandardMaterial color="deepskyblue" />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(RiverLayer);
