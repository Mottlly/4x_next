import { useEffect } from "react";

export default function useUnlockAudio(sciFiAudioRef, natureAudioRef) {
  useEffect(() => {
    const unlock = () => {
      if (sciFiAudioRef.current) sciFiAudioRef.current.play().catch(() => {});
      if (natureAudioRef.current) natureAudioRef.current.play().catch(() => {});
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [sciFiAudioRef, natureAudioRef]);
}