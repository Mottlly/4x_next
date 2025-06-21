import React from "react";
import Meeple from "./Meeple";
import { Axe, Sword } from "./MeepleAccessories";

const RaiderMeepleGroup = ({ color, edgeColor }) => (
  <group position={[0, -0.18, 0]}>
    <Meeple
      color={color}
      edgeColor={edgeColor}
      position={[-0.26, 0, -0.09]}
      scale={1}
      rotation={0.12}
      accessories={
        <>
          {Axe}
          {Sword}
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
          {Axe}
          {Sword}
        </>
      }
    />
  </group>
);

export default RaiderMeepleGroup;