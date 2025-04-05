import React, { useState, useEffect } from "react";

export default function LoadingScreen() {
  const messages = [
    "Thawing out the crew...",
    "Preparing for landing on [unknown]...",
    "Deploying heat shields...",
    "Analyzing local Flora and Fauna...",
    "Identifying mineral deposits...",
    "Downloading alien enviornment safety protocols...",
    "Error(503): Server Unavailable, contact IT support...",
    "Searching for optimal landing site...",
    "Analyzing atmospheric conditions...",
    "CAUTION: dense atmospheric conditions...",
    "WARNING: heat shields failing...",
    "WARNING: 47.867% of emergency supplies lost...",
    "WARNING: Emergency fusion cells lost...",
    "Diverting energy to secondary heat shields...",
    "WARNING Life support systems failing, diagnosing...",
    "Life Support Systems failing due to: energy deficit",
    "Cancelling crew thaw...",
    "Informing Corporate of lost assets...",
    "Subtracting value of lost assets from your bank account...",
    "Informing next of kin of likely death...",
    "Error(404): No next of kin found...",
    "Transferring crew assets to corporate account for safekeeping...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Update the message index every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [messages.length]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <h1>Drop Ship System Diagnostics</h1>
      <p style={{ fontSize: "1.5rem" }}>{messages[currentMessageIndex]}</p>
    </div>
  );
}
