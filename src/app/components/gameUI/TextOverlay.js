import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { textOverlayStyles } from "@/library/styles/stylesIndex";

/**
 * TextOverlay Component - A flexible overlay component for tutorials and notifications
 * 
 * @param {Object} props
 * @param {boolean} props.isVisible - Controls overlay visibility
 * @param {string} props.title - Main title text
 * @param {string} props.content - Main content text
 * @param {string} props.position - Overlay position: 'center', 'top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 * @param {string} props.size - Overlay size: 'small', 'medium', 'large', 'fullscreen'
 * @param {boolean} props.hasCloseButton - Show close button
 * @param {boolean} props.hasNextButton - Show next button
 * @param {boolean} props.hasPreviousButton - Show previous button
 * @param {string} props.nextButtonText - Custom text for next button
 * @param {string} props.previousButtonText - Custom text for previous button
 * @param {string} props.closeButtonText - Custom text for close button
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onNext - Next callback
 * @param {Function} props.onPrevious - Previous callback
 * @param {boolean} props.autoHide - Auto hide after timeout
 * @param {number} props.autoHideDelay - Auto hide delay in milliseconds (default: 5000)
 * @param {string} props.theme - Theme: 'dark', 'light', 'game'
 * @param {Object} props.customStyles - Custom style overrides
 * @param {React.ReactNode} props.children - Custom content instead of title/content
 * @param {boolean} props.clickOutsideToClose - Close when clicking outside overlay
 * @param {string} props.animation - Animation type: 'fade', 'slide', 'scale'
 * @param {boolean} props.transparentBackdrop - Use transparent backdrop (no grey overlay)
 */
export default function TextOverlay({
  isVisible = false,
  title = "",
  content = "",
  position = "center",
  size = "medium",
  hasCloseButton = true,
  hasNextButton = false,
  hasPreviousButton = false,
  nextButtonText = null,
  previousButtonText = null,
  closeButtonText = null,
  onClose = null,
  onNext = null,
  onPrevious = null,
  autoHide = false,
  autoHideDelay = 5000,
  theme = "game",
  customStyles = {},
  children = null,
  clickOutsideToClose = true,
  animation = "fade",
  transparentBackdrop = false
}) {
  const { t } = useTranslation("common");
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto hide functionality
  useEffect(() => {
    if (isVisible && autoHide && autoHideDelay > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDelay, onClose]);

  // Animation handling
  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && clickOutsideToClose && onClose && !transparentBackdrop) {
      onClose();
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case "Escape":
          if (onClose) onClose();
          break;
        case "ArrowRight":
        case "Enter":
          if (hasNextButton && onNext) onNext();
          break;
        case "ArrowLeft":
          if (hasPreviousButton && onPrevious) onPrevious();
          break;
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [isVisible, onClose, onNext, onPrevious, hasNextButton, hasPreviousButton]);

  // Don't render if not visible and not animating
  if (!isVisible && !isAnimating) return null;

  // Get button text with fallbacks
  const getCloseButtonText = () => closeButtonText || t("close", "Close");
  const getNextButtonText = () => nextButtonText || t("next", "Next");
  const getPreviousButtonText = () => previousButtonText || t("previous", "Previous");

  // Combine styles
  const overlayStyle = {
    ...textOverlayStyles.backdrop,
    ...textOverlayStyles.animations[animation],
    ...(isVisible ? textOverlayStyles.animations[animation].visible : textOverlayStyles.animations[animation].hidden),
    ...(transparentBackdrop ? {} : { backgroundColor: "rgba(0, 0, 0, 0.7)", pointerEvents: "auto" }),
    ...customStyles.backdrop
  };

  const contentStyle = {
    ...textOverlayStyles.container,
    ...textOverlayStyles.positions[position],
    ...textOverlayStyles.sizes[size],
    ...textOverlayStyles.themes[theme],
    ...customStyles.container
  };

  return (
    <div 
      style={overlayStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "overlay-title" : undefined}
      aria-describedby={content ? "overlay-content" : undefined}
    >
      <div style={contentStyle}>
        {/* Custom content or default title/content layout */}
        {children ? (
          children
        ) : (
          <>
            {title && (
              <h2 
                id="overlay-title"
                style={{
                  ...textOverlayStyles.title,
                  ...textOverlayStyles.themes[theme].title,
                  ...customStyles.title
                }}
              >
                {title}
              </h2>
            )}
            {content && (
              <div 
                id="overlay-content"
                style={{
                  ...textOverlayStyles.content,
                  ...textOverlayStyles.themes[theme].content,
                  ...customStyles.content
                }}
              >
                {content}
              </div>
            )}
          </>
        )}

        {/* Button container */}
        {(hasCloseButton || hasNextButton || hasPreviousButton) && (
          <div style={{
            ...textOverlayStyles.buttonContainer,
            ...customStyles.buttonContainer
          }}>
            {hasPreviousButton && onPrevious && (
              <button
                onClick={onPrevious}
                style={{
                  ...textOverlayStyles.button,
                  ...textOverlayStyles.themes[theme].button,
                  ...textOverlayStyles.previousButton,
                  ...customStyles.button,
                  ...customStyles.previousButton
                }}
                aria-label={getPreviousButtonText()}
              >
                {getPreviousButtonText()}
              </button>
            )}
            
            {hasNextButton && onNext && (
              <button
                onClick={onNext}
                style={{
                  ...textOverlayStyles.button,
                  ...textOverlayStyles.themes[theme].button,
                  ...textOverlayStyles.nextButton,
                  ...customStyles.button,
                  ...customStyles.nextButton
                }}
                aria-label={getNextButtonText()}
              >
                {getNextButtonText()}
              </button>
            )}

            {hasCloseButton && onClose && (
              <button
                onClick={onClose}
                style={{
                  ...textOverlayStyles.button,
                  ...textOverlayStyles.themes[theme].button,
                  ...textOverlayStyles.closeButton,
                  ...customStyles.button,
                  ...customStyles.closeButton
                }}
                aria-label={getCloseButtonText()}
              >
                {getCloseButtonText()}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
