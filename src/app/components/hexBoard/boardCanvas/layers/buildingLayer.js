import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/positionFinder";

function BuildingLayer({ tiles, spacing, heightScale }) {
  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + 0.2;
        let geom;
        let color = "#c2a465";

        switch (tile.building) {
          case "reconstructed_shelter":
            geom = (
              <cylinderGeometry args={[0, spacing * 0.4, spacing * 0.6, 4]} />
            );
            color = "#9b59b6";
            break;
          case "resource_extractor":
            geom = (
              <cylinderGeometry
                args={[spacing * 0.3, spacing * 0.3, spacing * 0.5, 16]}
              />
            );
            color = "#27ae60";
            break;
          case "sensor_suite":
            geom = <sphereGeometry args={[spacing * 0.35, 16, 16]} />;
            color = "#5f27cd";
            break;
          default:
            geom = (
              <cylinderGeometry args={[0, spacing * 0.4, spacing * 0.6, 4]} />
            );
        }

        return (
          <mesh
            key={`building-${tile.q}-${tile.r}`}
            position={[x, y, z]}
            renderOrder={500}
          >
            {geom}
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
    </>
  );
}

export default React.memo(BuildingLayer);
