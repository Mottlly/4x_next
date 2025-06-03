import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { loadingScreenStyles } from "@/library/styles/stylesIndex";

export default function LoadingScreen() {
  const { t } = useTranslation("common");
  const messages = t("loadingMessages", { returnObjects: true });

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [messages.length]);

  return (
    <div style={loadingScreenStyles.container}>
      <h1>Drop Ship System Diagnostics</h1>
      <p style={loadingScreenStyles.message}>{messages[currentMessageIndex]}</p>
    </div>
  );
}
