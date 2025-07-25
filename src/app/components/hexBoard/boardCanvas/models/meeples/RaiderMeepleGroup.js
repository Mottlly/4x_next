import React from "react";
import Meeple from "./Meeple";
import { RaiderSword } from "./MeepleAccessories";

// Much lighter red for visibility
const LIGHT_RED = "#e57373";

const RaiderMeepleGroup = ({ color = LIGHT_RED, edgeColor }) => (
  <group position={[0, -0.18, 0]}>
    <Meeple
      color={color}
      edgeColor={edgeColor}
      position={[-0.26, 0, -0.09]}
      scale={1}
      rotation={0.12}
      accessories={RaiderSword}
    />
    <Meeple
      color={color}
      edgeColor={edgeColor}
      position={[0.26, 0, 0.09]}
      scale={0.92}
      rotation={-0.12}
      accessories={RaiderSword}
    />
  </group>
);

export default RaiderMeepleGroup;
