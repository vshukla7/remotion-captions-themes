import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { InternalThemeProps } from "../types";

export const CapCutTheme: React.FC<InternalThemeProps> = ({
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
  const baseSize = typeof fontSize === "number" ? fontSize : 72;
  const scaledFontSize = `${baseSize * scaleFactor}px`;

  // Scale growth animation on the container over the course of the active line
  const lineStart = activeLine.words[0].start;
  const lineEnd = activeLine.words[activeLine.words.length - 1].end;
  const lineStartFrame = Math.round(lineStart * fps);
  const lineEndFrame = Math.round(lineEnd * fps);
  const lineDuration = Math.max(1, lineEndFrame - lineStartFrame);

  const containerScale = interpolate(
    frame - lineStartFrame,
    [0, lineDuration],
    [1.0, 1.15],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: `${10 * scaleFactor}px ${16 * scaleFactor}px`,
        maxWidth: "85%",
        textAlign: "center",
        transform: `scale(${containerScale})`,
        transition: "transform 0.05s ease-out",
      }}
    >
      {activeLine.words.map((word, index) => {
        const isActive = time >= word.start && time < word.end;
        const wordStartFrame = Math.round(word.start * fps);

        const wordRelativeFrame = frame - wordStartFrame;
        const wordOpacity = interpolate(wordRelativeFrame, [0, 8], [0, 1], {
          extrapolateRight: "clamp",
        });
        const wordTranslateY = interpolate(wordRelativeFrame, [0, 10], [15 * scaleFactor, 0], {
          extrapolateRight: "clamp",
        });

        // Use passed colors directly
        const color = isActive ? secondaryColor : primaryColor;

        const transform = isActive ? `scale(${1.15})` : `scale(1.0)`;

        return (
          <span
            key={index}
            style={{
              color,
              fontFamily: '"Poppins", sans-serif',
              fontSize: scaledFontSize,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              textShadow: `0 ${10 * scaleFactor}px ${20 * scaleFactor}px rgba(0,0,0,0.4)`,
              transform: `${transform} translateY(${wordTranslateY}px)`,
              opacity: wordOpacity,
              display: "inline-block",
              transition: "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1), color 0.1s ease",
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
