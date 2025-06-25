import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import hexToPosition from "../../../../../library/utililies/game/tileUtilities/Positioning/positionFinder";
import { buildingTypeStyles } from "@/library/styles/stylesIndex";
import ReconstructedShelterMesh from "../models/buildings/reconstructedShelterMesh";
import ResourceExtractorMesh from "../models/buildings/resourceExtractorMesh";
import SensorSuiteMesh from "../models/buildings/SensorSuiteMesh";
import HostileFortressMesh from "../models/buildings/hostileFortressMesh";

const HealthBar = ({
  health,
  maxHealth = 15,
  width = 0.7,
  height = 0.08,
  yOffset = 0.45,
  vertical = false,
}) => {
  const percent = Math.max(0, Math.min(1, health / maxHealth));
  const groupRef = useRef();
  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  // Solid color based on health percent
  let color = "#4caf50"; // green
  if (percent <= 0.25) color = "#e53935"; // red
  else if (percent <= 0.5) color = "#ffb300"; // yellow

  const borderColor = "#00bfff"; // Your UI blue

  // Swap width/height for vertical, and adjust bar fill direction
  const barWidth = vertical ? height : width;
  const barHeight = vertical ? width : height;

  return (
    <group ref={groupRef} position={[0, yOffset, 0]}>
      {/* Border */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[barWidth + 0.04, barHeight + 0.04]} />
        <meshBasicMaterial color={borderColor} transparent opacity={0.95} />
      </mesh>
      {/* Background */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[barWidth, barHeight]} />
        <meshBasicMaterial color="#333" transparent opacity={0.85} />
      </mesh>
      {/* Foreground (health) */}
      <mesh
        position={
          vertical
            ? [0, -(barHeight * (1 - percent)) / 2, 0.02]
            : [-(barWidth * (1 - percent)) / 2, 0, 0.02]
        }
      >
        <planeGeometry
          args={
            vertical
              ? [barWidth, barHeight * percent]
              : [barWidth * percent, barHeight]
          }
        />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

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

        // Check if building has health stats for health bar
        const maxHealth = tile.stats?.health;
        const currentHealth = tile.stats?.currentHealth;
        const hasHealthStats = maxHealth !== null && currentHealth !== null;

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
          <group key={`building-${tile.q}-${tile.r}`}>
            <mesh position={[x, y, z]} renderOrder={500}>
              {geom}
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Show health bar beside the building if it has health stats */}
            {hasHealthStats && (
              <group position={[x + 0.3, y + 0.7, z]}>
                <HealthBar
                  health={currentHealth}
                  maxHealth={maxHealth}
                  yOffset={0}
                  vertical
                  width={0.6}
                  height={0.07}
                />
              </group>
            )}
          </group>
        );
      })}
    </>
  );
}

export default React.memo(BuildingLayer);
