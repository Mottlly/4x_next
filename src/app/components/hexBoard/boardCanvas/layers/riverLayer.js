import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";

export default function RiverLayer({ board, heightScale }) {
  return (
    <>
      {board.tiles
        .filter((t) => t.riverPresent)
        .map((tile) => {
          const [x, , z] = hexToPosition(tile.q, tile.r, board.spacing);
          const y = tile.height * heightScale + 0.05;
          return (
            <mesh
              key={`river-${tile.q}-${tile.r}`}
              position={[x, y, z]}
              renderOrder={1000}
            >
              <sphereGeometry args={[board.spacing * 0.1, 8, 8]} />
              <meshStandardMaterial color="deepskyblue" />
            </mesh>
          );
        })}
    </>
  );
}
