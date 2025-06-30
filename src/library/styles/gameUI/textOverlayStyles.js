export const textOverlayStyles = {
  // Backdrop that covers the entire screen (transparent for tutorial mode)
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    boxSizing: "border-box",
    pointerEvents: "none" // Allow clicks to pass through backdrop
  },

  // Main container for the overlay content
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    border: "2px solid #333",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "auto",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    pointerEvents: "auto" // Re-enable pointer events for the content
  },

  // Title styling
  title: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    margin: "0 0 12px 0",
    lineHeight: "1.3"
  },

  // Content styling
  content: {
    fontSize: "1rem",
    lineHeight: "1.6",
    margin: "0",
    flex: "1"
  },

  // Button container
  buttonContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
    flexWrap: "wrap"
  },

  // Base button styling
  button: {
    padding: "10px 20px",
    border: "2px solid transparent",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "80px",
    outline: "none"
  },

  // Specific button types
  closeButton: {
    backgroundColor: "#dc2626",
    color: "white",
    border: "2px solid #dc2626"
  },

  nextButton: {
    backgroundColor: "#059669",
    color: "white",
    border: "2px solid #059669"
  },

  previousButton: {
    backgroundColor: "#6b7280",
    color: "white", 
    border: "2px solid #6b7280"
  },

  // Position variants
  positions: {
    center: {
      alignSelf: "center"
    },
    top: {
      alignSelf: "flex-start",
      marginTop: "40px"
    },
    bottom: {
      alignSelf: "flex-end",
      marginBottom: "40px"
    },
    "top-left": {
      position: "absolute",
      top: "40px",
      left: "40px"
    },
    "top-right": {
      position: "absolute",
      top: "40px",
      right: "40px"
    },
    "bottom-left": {
      position: "absolute",
      bottom: "40px",
      left: "40px"
    },
    "bottom-right": {
      position: "absolute",
      bottom: "40px",
      right: "40px"
    }
  },

  // Size variants
  sizes: {
    small: {
      width: "320px",
      minHeight: "180px"
    },
    medium: {
      width: "480px",
      minHeight: "240px"
    },
    large: {
      width: "640px",
      minHeight: "320px"
    },
    fullscreen: {
      width: "90vw",
      height: "90vh"
    }
  },

  // Theme variants
  themes: {
    dark: {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      border: "2px solid #333",
      title: {
        color: "#ffffff"
      },
      content: {
        color: "#e5e5e5"
      },
      button: {
        // Button hover effects will be added via CSS-in-JS or inline styles
      }
    },
    light: {
      backgroundColor: "#ffffff",
      color: "#1f2937",
      border: "2px solid #e5e7eb",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      title: {
        color: "#111827"
      },
      content: {
        color: "#374151"
      },
      button: {
        // Light theme button styling
      }
    },
    game: {
      backgroundColor: "#0f172a",
      color: "#f1f5f9",
      border: "2px solid #334155",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
      backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      title: {
        color: "#f8fafc",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
      },
      content: {
        color: "#cbd5e1"
      },
      button: {
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)"
      }
    }
  },

  // Animation variants
  animations: {
    fade: {
      transition: "opacity 0.3s ease-in-out",
      visible: {
        opacity: 1
      },
      hidden: {
        opacity: 0
      }
    },
    slide: {
      transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
      visible: {
        opacity: 1,
        transform: "translateY(0)"
      },
      hidden: {
        opacity: 0,
        transform: "translateY(-20px)"
      }
    },
    scale: {
      transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
      visible: {
        opacity: 1,
        transform: "scale(1)"
      },
      hidden: {
        opacity: 0,
        transform: "scale(0.95)"
      }
    }
  }
};
