import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { riverStyles } from "@/library/styles/stylesIndex";

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
            <sphereGeometry
              args={[spacing * riverStyles.geometry.args[0], 8, 8]}
            />
            <meshStandardMaterial color={riverStyles.color} />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(RiverLayer);
