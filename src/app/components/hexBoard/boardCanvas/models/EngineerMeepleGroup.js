import React from "react";
import Meeple from "./Meeple";
import { Hammer, HardHat, ToolBelt } from "./MeepleAccessories";

const EngineerMeepleGroup = ({ color, edgeColor }) => (
  <group position={[0, -0.18, 0]}>
    <Meeple
      color={color}
      edgeColor={edgeColor}
      position={[-0.26, 0, -0.09]}
      scale={1}
      rotation={0.12}
      accessories={
        <>
          {Hammer}
          {HardHat}
          {ToolBelt}
        </>
      }
    />
    <Meeple
      color={color}
      edgeColor={edgeColor}
      position={[0.26, 0, 0.09]}
      scale={0.92}
      rotation={-0.12}
      accessories={
        <>
          {Hammer}
          {HardHat}
          {ToolBelt}
        </>
      }
    />
  </group>
);

export default EngineerMeepleGroup;