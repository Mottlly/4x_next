import { useFrame, useThree } from "@react-three/fiber";
import React from "react";

const AudioSwitcher = ({ threshold, sciFiAudioRef, natureAudioRef }) => {
  const { camera } = useThree();

  // On every frame, check camera height and toggle audio.
  useFrame(() => {
    if (!sciFiAudioRef.current || !natureAudioRef.current) return;
    if (camera.position.y < threshold) {
      if (natureAudioRef.current.paused) {
        natureAudioRef.current.play().catch(() => {});
      }
      if (!sciFiAudioRef.current.paused) {
        sciFiAudioRef.current.pause();
      }
    } else {
      if (sciFiAudioRef.current.paused) {
        sciFiAudioRef.current.play().catch(() => {});
      }
      if (!natureAudioRef.current.paused) {
        natureAudioRef.current.pause();
      }
    }
  });

  return null;
};

export default AudioSwitcher;
