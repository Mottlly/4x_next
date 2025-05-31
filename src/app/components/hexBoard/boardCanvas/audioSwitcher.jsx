import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef } from "react";

const FADE_SPEED = 0.003; // Adjust for faster/slower fade

const AudioSwitcher = ({ threshold, sciFiAudioRef, natureAudioRef }) => {
  const { camera } = useThree();
  const target = useRef("nature"); // "nature" or "scifi"

  useFrame(() => {
    if (!sciFiAudioRef.current || !natureAudioRef.current) return;

    // Decide which should be active
    const shouldBeSciFi = camera.position.y >= threshold;
    const activeRef = shouldBeSciFi ? sciFiAudioRef : natureAudioRef;
    const inactiveRef = shouldBeSciFi ? natureAudioRef : sciFiAudioRef;
    target.current = shouldBeSciFi ? "scifi" : "nature";

    // Play the active track if not already playing
    if (activeRef.current.paused) {
      activeRef.current.play().catch(() => {});
    }
    // Pause the inactive track only when fully faded out
    if (inactiveRef.current.volume <= 0.01 && !inactiveRef.current.paused) {
      inactiveRef.current.pause();
    }

    // Fade volumes
    if (shouldBeSciFi) {
      // Fade in sci-fi, fade out nature
      if (sciFiAudioRef.current.volume < 1)
        sciFiAudioRef.current.volume = Math.min(
          1,
          sciFiAudioRef.current.volume + FADE_SPEED
        );
      if (natureAudioRef.current.volume > 0)
        natureAudioRef.current.volume = Math.max(
          0,
          natureAudioRef.current.volume - FADE_SPEED
        );
    } else {
      // Fade in nature, fade out sci-fi
      if (natureAudioRef.current.volume < 1)
        natureAudioRef.current.volume = Math.min(
          1,
          natureAudioRef.current.volume + FADE_SPEED
        );
      if (sciFiAudioRef.current.volume > 0)
        sciFiAudioRef.current.volume = Math.max(
          0,
          sciFiAudioRef.current.volume - FADE_SPEED
        );
    }
  });

  return null;
};

export default AudioSwitcher;
