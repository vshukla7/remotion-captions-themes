import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { InternalThemeProps } from "../types";

export const KarlTheme: React.FC<InternalThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const time = frame / fps;

  // Find active line
  let activeLineIdx = 0;
  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    if (line.words.length === 0) continue;
    const lineStart = line.words[0].start;
    const lineEnd = line.words[line.words.length - 1].end;
    if (time >= lineStart && time <= lineEnd) {
      activeLineIdx = i;
      break;
    }
    if (time > lineEnd) {
      activeLineIdx = i;
    }
  }

  const activeLine = data.lines[activeLineIdx] || data.lines[0];
  if (!activeLine || !activeLine.words.length) return null;

  // Responsive scaling
  const scaleFactor = width / 1080;
  const baseSize = typeof fontSize === "number" ? fontSize : 82;
  const scaledFontSize = `${baseSize * scaleFactor}px`;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${10 * scaleFactor}px ${16 * scaleFactor}px`,
        maxWidth: "90%",
        textAlign: "center",
      }}
    >
      {activeLine.words.map((word, index) => {
        const wordStartFrame = Math.round(word.start * fps);
        const isActive = time >= word.start && time < word.end;
        const isRevealed = frame >= wordStartFrame;

        // Individual word spring pop entrance
        const pop = spring({
          frame: frame - wordStartFrame,
          fps,
          config: { damping: 12, stiffness: 200 },
        });

        const color = isActive ? secondaryColor : primaryColor;
        const transform = isRevealed ? `scale(${pop})` : "scale(0)";
        const opacity = isRevealed ? (isActive ? 1.0 : 0.75) : 0;

        return (
          <span
            key={index}
            style={{
              color,
              fontFamily: '"Inter", sans-serif',
              fontSize: scaledFontSize,
              fontWeight: 800,
              fontStyle: "italic",
              textTransform: "uppercase",
              textShadow: `0 ${10 * scaleFactor}px ${30 * scaleFactor}px rgba(0,0,0,0.8), 0 ${4 * scaleFactor}px ${8 * scaleFactor}px rgba(0,0,0,0.5)`,
              transform,
              opacity,
              display: "inline-block",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
