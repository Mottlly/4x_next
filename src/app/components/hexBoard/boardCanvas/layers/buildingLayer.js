import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { buildingTypeStyles } from "@/library/styles/stylesIndex";

function BuildingLayer({ tiles, spacing, heightScale }) {
  return (
    <>
      {tiles.map((tile) => {
        const [x, , z] = hexToPosition(tile.q, tile.r, spacing);
        const y = tile.height * heightScale + 0.2;
        let geom;
        let color =
          buildingTypeStyles[tile.building]?.color ||
          buildingTypeStyles.default.color;

        switch (tile.building) {
          case "reconstructed_shelter":
            geom = (
              <cylinderGeometry args={[0, spacing * 0.4, spacing * 0.6, 4]} />
            );
            break;
          case "resource_extractor":
            geom = (
              <cylinderGeometry
                args={[spacing * 0.3, spacing * 0.3, spacing * 0.5, 16]}
              />
            );
            break;
          case "sensor_suite":
            geom = <sphereGeometry args={[spacing * 0.35, 16, 16]} />;
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
