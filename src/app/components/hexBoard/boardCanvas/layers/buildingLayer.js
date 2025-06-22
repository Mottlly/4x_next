import React from "react";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { buildingTypeStyles } from "@/library/styles/stylesIndex";
import ReconstructedShelterMesh from "../models/reconstructedShelterMesh";
import ResourceExtractorMesh from "../models/resourceExtractorMesh";
import SensorSuiteMesh from "../models/SensorSuiteMesh";
import HostileFortressMesh from "../models/hostileFortressMesh";

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
            geom = <ReconstructedShelterMesh scale={spacing * 0.7} />;
            break;
          case "resource_extractor":
            geom = <ResourceExtractorMesh scale={spacing * 0.7} />;
            break;
          case "sensor_suite":
            geom = <SensorSuiteMesh scale={spacing * 0.7} />;
            break;
          case "hostileFortress":
            geom = <HostileFortressMesh scale={spacing * 0.7} />;
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
